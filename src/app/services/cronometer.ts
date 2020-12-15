import { Injectable } from '@angular/core';
import { throttle } from '../shared/throttle.decorator';
import { StoreService, TodoCollection } from './StoreService';

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

  constructor() {
    StoreService.getCurrent().subscribe(f => {
      this.todos = f;


      this.todos.times.map(f => new Date(f));
      if (this.todos.times.length % 2 === 0)
        this.pauseClick();
      else 
        this.playClick();

      let currentTime = 0;
      if (this.todos.times.length) {
        for (let i = 0; i < this.todos.times.length; i += 2) {
          let a = this.todos.times[i];
          let b = this.todos.times[i + 1];
          if (b)
            currentTime += new Date("01/01/2018 " + b).getTime() - new Date("01/01/2018 " + a).getTime();
          else
            currentTime += new Date(`01/01/2018 ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`).getTime() - new Date("01/01/2018 " + a).getTime();
        }
        const aaa = new Date(`01/01/2018 00:00:00`);
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
    this.todos.times.push(this.formatHourFromDate(new Date()));

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
