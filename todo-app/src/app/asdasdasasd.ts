import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { throttle } from "./_shared/decorators/throttle.decorator";

export enum EventType {
  chronometerButtonClicked = 0,
  timeclicked = 1,
  taskCreated = 2,
  TaskOrderChanged = 3,
}

export interface Quests {
  name: string,
  pomodoroCount: number,
  repeatable: boolean,

  completed: number
}

export interface TodoEvent {
  type: EventType;
  date: Date;
  args?: any;
}

export class MyTimer {
  private seconds = 0;
  private minutes = 0;
  private hours = 0;
  public clicks: Date[] = [];
  public currentTime: string;
  public goal: string;
  public pomodoroTime: string;
  public pomodoroState = 0;
  public pomodoroCount = 0;
  public onPomodoroStarted = new EventEmitter<string>();
  public onShortBreakStarted = new EventEmitter<string>();
  public onLongBreakStarted = new EventEmitter<string>();

  public running: boolean;
  pomodoroCountdown: string;
  currentTimeInterval: string;

  constructor() {

  }

  click(when: Date) {
    this.clicks.push(when);

    if (this.running)
      this.pause();
    else
      this.start();

    this.recalculateTimer();
  }

  undoClick(which: Date) {
    this.clicks = this.clicks.filter(f => f.toLocaleTimeString() != which.toLocaleTimeString());

    if (this.running)
      this.pause();
    else
      this.start();

    this.recalculateTimer();
  }

  private setMilliseconds(value: number) {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = Math.floor(value / 1000);

    if (this.seconds >= 60) {
      this.minutes = Math.floor(this.seconds / 60);
      this.seconds = Math.floor(this.seconds % 60);

      if (this.minutes >= 60) {
        this.hours = Math.floor(this.minutes / 60);
        this.minutes = Math.floor(this.minutes % 60);
      }
    }
  }

  private recalculateTimer() {
    if (this.clicks.length > 0) {
      let milliseconds = 0;

      for (var i = 1; i < this.clicks.length; i++)
        if (i % 2 != 0)
          milliseconds += this.clicks[i].getTime() - this.clicks[i - 1].getTime();

      if (this.running) {
        const last = this.clicks.length % 2 == 0
          ? Date.now()
          : this.clicks[this.clicks.length - 1].getTime();

        milliseconds += Date.now() - last;

        const lastClick = this.clicks[this.clicks.length - 1];
        this.setPomodoro(Date.now() - lastClick.getTime());
      }
      else
        this.setPomodoro(0);

      this.setMilliseconds(milliseconds);
    }
    else {
      this.setMilliseconds(0);
      this.setPomodoro(0);
    }

    this.currentTime = new Date(1989, 4, 8, this.hours, this.minutes, this.seconds).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.goal = this.calculateGoal();
    this.updateCurrentTimeInterval();
  }

  setPomodoro(milliseconds: number) {

    let seconds = Math.floor(milliseconds / 1000);
    let minutes = 0;

    if (seconds >= 60) {
      minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
    }

    const previousPomodoroState = this.pomodoroState;
    this.pomodoroCount = 0;
    this.pomodoroState = 0;

    while (true) {

      if (this.pomodoroState == 0) {
        if (minutes >= 25) {
          minutes -= 25;
          this.pomodoroCount++;

          if (this.pomodoroCount % 4 == 0)
            this.pomodoroState = 2;
          else
            this.pomodoroState = 1;
        }
        else
          break;
      }
      else if (this.pomodoroState == 1) {
        if (minutes >= 5) {
          minutes -= 5;
          this.pomodoroState = 0;
        }
        else
          break;
      } else if (this.pomodoroState == 2) {
        if (minutes >= 30) {
          minutes -= 30;
          this.pomodoroState = 0;
        }
        else
          break;
      } else
        break;

    }

    if (this.running && this.pomodoroState != previousPomodoroState) {
      if (this.pomodoroState == 0)
        this.onPomodoroStarted.emit("bora trabalhar!");
      else if (this.pomodoroState == 1)
        this.onShortBreakStarted.emit("beber agua?");
      else
        this.onLongBreakStarted.emit("bora estudar?");
    }

    const pomodoroDate = new Date(1989, 4, 8);

    if (this.pomodoroState == 0)
      pomodoroDate.setMinutes(25);
    else if (this.pomodoroState == 1)
      pomodoroDate.setMinutes(5);
    else
      pomodoroDate.setMinutes(30);

    pomodoroDate.setSeconds(pomodoroDate.getSeconds() - seconds);
    pomodoroDate.setMinutes(pomodoroDate.getMinutes() - minutes);

    this.pomodoroTime = `00:${this.zeroPad(minutes)}:${this.zeroPad(seconds)}`;
    this.pomodoroCountdown = `00:${this.zeroPad(pomodoroDate.getMinutes())}:${this.zeroPad(pomodoroDate.getSeconds())}`;
  }

  updateCurrentTimeInterval() {
    if (this.clicks.length > 0) {
      const latests = this.clicks.sort()[this.clicks.length -1];

      const a = new Date(1989, 4, 8, 0, 0, 0);
      a.setMilliseconds(
        Date.now()
        -
        latests.getTime()
      );
      this.currentTimeInterval = a.toLocaleTimeString();
    }
  }

  calculateGoal(): string {
    const worked = new Date(1989, 4, 8, this.hours, this.minutes, this.seconds).getTime();
    const goal = new Date(1989, 4, 8, 8, 0, 0).getTime();

    const result = new Date(1989, 4, 8, 0, 0, 0);

    const delta = goal - worked;
    result.setMilliseconds(delta);

    return `${delta > 0 ? '-' : '+'}${this.zeroPad(result.getHours())}:${this.zeroPad(result.getMinutes())}`;
  }

  private start() {
    this.running = true;
    this.timeLoop();
  }

  private timeLoop() {
    this.recalculateTimer();
    if (this.running)
      setTimeout(() => this.timeLoop(), 1000);
  }

  private pause() {
    this.running = false;
  }

  private toLocaleTimeString() {
    return `${this.zeroPad(this.hours)}:${this.zeroPad(this.minutes)}:${this.zeroPad(this.seconds)}`;
  }

  private zeroPad(n) {
    if (n >= 0 && n <= 9)
      return `0${n}`;

    if (n < 0 && n >= -9)
      return `-0${n * -1}`;

    if (n < 0)
      return `-${n}`;

    return `${n}`;
  }
}

export class EventProcessor {
  public onEventsChanged: BehaviorSubject<TodoEvent[]>;

  public _events: TodoEvent[] = [];
  public timer: MyTimer;

  constructor() {
    this.timer = new MyTimer();
    this.onEventsChanged = new BehaviorSubject<TodoEvent[]>(this._events);
  }

  public process(e: TodoEvent) {
    this.processSingleEvent(e, true);
  }

  private processSingleEvent(e: TodoEvent, emitChanges: boolean) {
    e.date = new Date(e.date);

    if (e.type == EventType.chronometerButtonClicked)
      this.handleTimerStarted(e);

    if (e.type == EventType.timeclicked)
      this.handleTimeClicked(e);

    if (emitChanges == false)
      return;

    this._events.push(e);
    this.onEventsChanged.next(this._events);
  }

  public processAll(events: TodoEvent[]) {
    events.forEach(e => this.processSingleEvent(e, false));
    this._events = events;
    this.onEventsChanged.next(this._events);
  }

  private handleTimerStarted(e: TodoEvent) {
    this.timer.click(e.date);
  }

  private handleTimeClicked(e: TodoEvent) {
    this.timer.undoClick(new Date(e.args));
  }
}

export const Constants = {
  store_key: 'todov2-id-000'
};

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: separar tarefas em mainquests e sidequests... main feitas em pomodoro, side feitas no break
  //TODO: utilizar cron para cadastrar tarefas recorrentes
  public processor: EventProcessor;

  constructor() {
    this.processor = new EventProcessor();

    let _events = (JSON.parse(
      localStorage.getItem(`${Constants.store_key}-${new Date().toLocaleDateString()}`)
    ) || []) as TodoEvent[];

    this.processor.processAll(_events);

    setTimeout(() => {
      this.processor.timer.onPomodoroStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onShortBreakStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onLongBreakStarted.subscribe(f => NotificationService.send(f, ""));
    }, 1000);
  }

  publish(e: TodoEvent, save = true) {
    this.processor.process(e);

    localStorage.setItem(
      `${Constants.store_key}-${new Date().toLocaleDateString()}`
      , JSON.stringify(this.processor._events));
  }
}

class _NotificationService {
  private _permissionGranted: boolean = false;
  get permissionGranted(): boolean {
    return this._permissionGranted;
  }
  set permissionGranted(value: boolean) {
    if (value)
      this.requestPermission();
    else {
      this._permissionGranted = false;
      localStorage.setItem(`${Constants.store_key}-notifications`, '0');
    }
  }

  constructor() {
    this._permissionGranted =
      Notification.permission == "granted"
      && localStorage.getItem(`${Constants.store_key}-notifications`) == '1';
  }

  @throttle()
  public send(
    title: string
    , body: string
    , iconUrl: string = 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png') {

    if (this.permissionGranted == false)
      return;

    const notification = new Notification(title, {
      icon: iconUrl,
      body: body,
      //silent: true
    });

    //window.navigator.vibrate(pattern)

    setTimeout(() => notification.close(), 1000 * 60 * 3);

    notification.onclick = () => {
      window.open(window.location.href);
    };
  }

  public requestPermission() {
    if (Notification.permission == "granted") {
      this._permissionGranted = true;
      localStorage.setItem(`${Constants.store_key}-notifications`, '1');
      return;
    }

    Notification.requestPermission().then(f => {
      this._permissionGranted = f == "granted";
      localStorage.setItem(`${Constants.store_key}-notifications`, this._permissionGranted ? '1' : '0');
    });
  }

}

export const NotificationService = new _NotificationService();
