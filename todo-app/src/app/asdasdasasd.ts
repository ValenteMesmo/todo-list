import { Injectable } from "@angular/core";

export enum EventType {
  chronometerButtonClicked,
  taskCreated,
  TaskOrderChanged,
}

export interface Quests {
  name: string,
  pomodoroCount: number,
  repeatable: boolean,

  completed: number
}

export class MyTimer {
  private seconds = 0;
  private minutes = 0;
  private hours = 0;
  private timeout: any;
  public clicks: Date[] = [];
  public currentTime: string;
  public goal: string;

  public get running(): boolean {
    return !!this.timeout;
  }

  constructor() {
  }

  click(when: Date) {
    this.clicks.push(when);
    this.recalculateTimer();

    if (this.timeout)
      this.pause();
    else
      this.start();
  }

  private setMilliseconds(value: number) {
    this.seconds = value / 1000;

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

      if (this.timeout) {
        const last = this.clicks.length % 2 == 0 ? Date.now() : this.clicks[this.clicks.length - 1].getTime();
        milliseconds += Date.now() - last;
      }

      this.setMilliseconds(milliseconds);
    }

    this.currentTime = this.toLocaleTimeString();
    this.goal = this.calculateGoal();
  }

  calculateGoal(): string {
    const worked = new Date(1989, 4, 8, this.hours, this.minutes, this.seconds).getTime();
    const goal = new Date(1989, 4, 8, 8, 0, 0).getTime();

    const result = new Date(1989, 4, 8, 0, 0, 0);
    result.setMilliseconds(goal - worked);

    return `${this.zeroPad(result.getHours())}:${this.zeroPad(result.getMinutes())}:${this.zeroPad(result.getSeconds())}`;
  }

  private start() {
    clearTimeout(this.timeout);
    this.timeout = setInterval(() => this.recalculateTimer(), 1000);
  }

  private pause() {
    clearTimeout(this.timeout);
    this.timeout = null;
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

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: separar tarefas em mainquests e sidequests... main feitas em pomodoro, side feitas no break

  timer: MyTimer;

  constructor() {

    this.timer = new MyTimer();
  }

  publish(type: EventType, date: Date, arg: any) {
    if (type == EventType.chronometerButtonClicked)
      this.handleTimerStarted(date);

  }

  private handleTimerStarted(date: Date) {
    this.timer.click(date);
  }

}
