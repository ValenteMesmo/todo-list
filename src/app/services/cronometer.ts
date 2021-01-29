import { Injectable } from '@angular/core';
import { throttle } from '../shared/throttle.decorator';
import { StoreService, TodoCollection } from './StoreService';
import * as moment from 'moment';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class Cronometer {
  time = "0:00:00";

  private seconds = 0;
  private minutes = 0;
  private hours = 0;
  private intervalId;

  running = false;

  todos: TodoCollection;

  constructor(public readonly notification: NotificationService) {
    moment.locale('pt-br');

    StoreService.getCurrent().subscribe(f => {
      this.todos = f;

      //this.todos.times.map(f => moment(f).toDate());
      if (this.todos.times.length % 2 === 0)
        this.pauseClick();
      else
        this.playClick();

      let currentTime = 0;

      const now = moment().toDate();
      const nowTime = moment().set({ hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() })
        .toDate()
        .getTime();

      if (this.todos.times.length) {
        for (let i = 0; i < this.todos.times.length; i += 2) {
          const a = this.todos.times[i];
          const b = this.todos.times[i + 1];

          const dateA = moment(now);
          dateA.set(this.getTimeObject(a));
       

          if (b) {
            const dateB = moment(now);
            dateB.set(this.getTimeObject(b));   
            currentTime += dateB.toDate().getTime() - dateA.toDate().getTime();
          }
          else
            currentTime += nowTime - dateA.toDate().getTime();
        }
        const aaa = moment(now).toDate();
        aaa.setHours(0);
        aaa.setMinutes(0);
        aaa.setSeconds(0);
        aaa.setMilliseconds(currentTime);
        this.seconds = aaa.getSeconds();
        this.minutes = aaa.getMinutes();
        this.hours = aaa.getHours();
        this.time = this.formatHourFromDate(aaa);
      }
      else
        this.time = "0:00:00";
    });
  }

  private getTimeObject(timeString: string) {
    const values = timeString.split(':');

    if (values.length !== 3)
      return { hour: 0, minute: 0, second: 0, millisecond: 0 };

    return { hour: Number(values[0]), minute: Number(values[1]), second: Number(values[2]) };
  }

  private formatHourFromDate(date: Date) {
    return this.formatHour(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  private formatHour(hours: number, minutes: number, seconds: number) {
    return `${hours}:${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
  }

  @throttle()
  removeTime(time) {
    this.todos.times = this.todos.times.filter(f => f !== time);

    StoreService.save(this.todos);
  }

  @throttle()
  click() {
    this.todos.times.push(this.formatHourFromDate(moment().toDate()));

    if (this.running)
      this.pauseClick();
    else
      this.playClick();

    StoreService.save(this.todos);
  }

  private loop() {

    this.seconds++

    if (this.seconds > 59) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes > 59) {
      this.minutes = 0;
      this.hours++;
    }

    if (this.hours === 8 && this.minutes === 0 && this.seconds === 0)
      this.notification.notify("8 hours done!", "(╯°□°) ╯︵ ┻━┻");

    this.time = this.formatHour(this.hours, this.minutes, this.seconds);
  }

  private playClick() {
    this.running = true;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.loop(), 1000);
  }

  private pauseClick() {
    this.running = false;
    clearInterval(this.intervalId);
  }

  private resetClick() {
    clearInterval(this.intervalId);
    this.time = `0:00:00`;

    this.hours =
      this.minutes =
      this.seconds = 0;
  }
}
