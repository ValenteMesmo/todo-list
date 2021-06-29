import { Subject } from "rxjs";
import { TaskType } from "./event-processor";

export class MyTimer {
  private readonly pomodoroDuration = 25;
  private readonly breakDuration = 5;
  private readonly longBreakDuration = 30;

  private seconds = 0;
  private minutes = 0;
  private hours = 0;
  public clicks: Date[] = [];
  public currentTime: string;
  public goal: string;
  public pomodoroTime: string;
  public pomodoroState = 0;
  public pomodoroCount = 0;
  //TODO: move to processor?
  public onPomodoroStarted = new Subject<string>();
  public onShortBreakStarted = new Subject<string>();
  public onLongBreakStarted = new Subject<string>();

  public running: boolean;
  public pomodoroCountdown: string;
  public currentTimeInterval: string = "00:00";

  constructor() {
    this.timeLoop();
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

  clear() {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.clicks = [];
    this.currentTime = '';
    this.goal = '';
    this.pomodoroTime = '';
    this.pomodoroState = 0;
    this.pomodoroCount = 0;
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

    this.currentTime = new Date(1989, 4, 8, this.hours, this.minutes, this.seconds)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.goal = this.calculateGoal();
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

      if (this.pomodoroState == TaskType.Pomodoro) {
        if (minutes >= this.pomodoroDuration) {
          minutes -= this.pomodoroDuration;
          this.pomodoroCount++;

          if (this.pomodoroCount % 4 == 0)
            this.pomodoroState = 2;
          else
            this.pomodoroState = 1;
        }
        else
          break;
      }
      else if (this.pomodoroState == TaskType.Break) {
        if (minutes >= this.breakDuration) {
          minutes -= this.breakDuration;
          this.pomodoroState = 0;
        }
        else
          break;
      } else if (this.pomodoroState == TaskType.LongBreak) {
        if (minutes >= this.longBreakDuration) {
          minutes -= this.longBreakDuration;
          this.pomodoroState = 0;
        }
        else
          break;
      } else
        break;

    }

    if (this.running && this.pomodoroState != previousPomodoroState) {
      if (this.pomodoroState == 0)
        this.onPomodoroStarted.next("bora trabalhar!");
      else if (this.pomodoroState == 1)
        this.onShortBreakStarted.next("beber agua?");
      else
        this.onLongBreakStarted.next("bora estudar?");
    }

    const pomodoroDate = new Date(1989, 4, 8);

    if (this.pomodoroState == 0)
      pomodoroDate.setMinutes(this.pomodoroDuration);
    else if (this.pomodoroState == 1)
      pomodoroDate.setMinutes(this.breakDuration);
    else
      pomodoroDate.setMinutes(this.longBreakDuration);

    pomodoroDate.setSeconds(pomodoroDate.getSeconds() - seconds);
    pomodoroDate.setMinutes(pomodoroDate.getMinutes() - minutes);

    this.pomodoroTime = `00:${this.zeroPad(minutes)}:${this.zeroPad(seconds)}`;
    this.pomodoroCountdown = `${this.zeroPad(pomodoroDate.getMinutes())}:${this.zeroPad(pomodoroDate.getSeconds())}`;
  }

  updateCurrentTimeInterval() {
    if (this.clicks.length > 0) {
      const latests = this.clicks.sort()[this.clicks.length - 1];

      const a = new Date(1989, 4, 8, 0, 0, 0);
      a.setMilliseconds(
        Date.now()
        -
        latests.getTime()
      );

      if (a.getHours() < Number(this.currentTimeInterval.split(':')[0]))
        window.location.reload();

      this.currentTimeInterval = a.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });      
    }
  }

  calculateGoal(): string {
    const worked = new Date(1989, 4, 8, this.hours, this.minutes, this.seconds).getTime();
    const goal = new Date(1989, 4, 8, 8, 0, 0).getTime();

    const result = new Date(1989, 4, 8, 0, 0, 0);

    const plus = worked > goal;
    const delta = plus ? worked - goal : goal - worked;
    result.setMilliseconds(delta);

    return `${plus ? '+' : '-'}${this.zeroPad(result.getHours())}:${this.zeroPad(result.getMinutes())}`;
  }

  private start() {
    this.running = true;
    this.pomodoroCount = 0;
    this.pomodoroState = 0;
    this.pomodoroCountdown = `${this.pomodoroDuration}:00`;
  }

  private timeLoop() {
    if (this.running)
      this.recalculateTimer();

    this.updateCurrentTimeInterval();
    setTimeout(() => this.timeLoop(), 1000);
  }

  private pause() {
    this.running = false;
    this.pomodoroCount = 0;
    this.pomodoroState = 0;
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

