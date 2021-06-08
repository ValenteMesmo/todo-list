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
    if (n > 9)
      return `${n}`;

    return `0${n}`;
  }
}

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: separar tarefas em mainquests e sidequests... main feitas em pomodoro, side feitas no break

  //times: Date[] = [];
  //tasks = [];

  //running = false;
  //timer: Timer;
  timer: MyTimer;
  //currentTime = "00:00:00";
  //startDate: Date;

  constructor() {

    //this.timer = new Timer();
    this.timer = new MyTimer();
    //this.timer.addEventListener('secondsUpdated', e =>
    //  this.currentTime = this.timer.getTimeValues().toString()
    //);

    //setInterval(() => {
    //  let mili = 0;
    //  for (var i = 0; i < this.times.length - 1; i += 2) {
    //    mili += this.times[i + 1].getTime() - this.times[i].getTime();
    //  }

    //  if (this.running) {
    //    const a = new Date();
    //    a.setMilliseconds(mili);
    //    mili += this.times[this.times.length - 1].getTime() - a.getTime();
    //  }
    //  const b = new Date();
    //  b.setMilliseconds(mili)
    //  this.currentTime = b.toLocaleTimeString();
    //}, 1000);
  }

  publish(type: EventType, date: Date, arg: any) {
    if (type == EventType.chronometerButtonClicked)
      this.handleTimerStarted(date);

  }

  private handleTimerStarted(date: Date) {
    this.timer.click(date);
    //if (this.running) {
    //  this.timer.click(date);
    //  this.running = false;
    //  this.times.push(date);
    //  //this.currentTime = this.timer.getTimeValues().toString();
    //  return;
    //}

    //this.startDate = date;
    //const milliseconds = Math.abs(
    //  date.getTime()
    //  - this.startDate.getTime()
    //);
    ////this.startDate.setMilliseconds(milliseconds);
    //this.timer.click(date);
    ////this.timer.start({
    ////  precision: 'seconds'
    ////  , startValues: {
    ////    seconds: milliseconds
    ////  }
    ////});

    //this.running = true;

    ////this.currentTime = this.timer.getTimeValues().toString();
    //this.times.push(date);
  }

}
