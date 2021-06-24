import { Injectable } from "@angular/core";
import { Constants } from "../constants";
import { EventProcessor, TodoEvent } from "./event-processor";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: separar tarefas em mainquests e sidequests... main feitas em pomodoro, side feitas no break
  //TODO: utilizar cron para cadastrar tarefas recorrentes
  public processor: EventProcessor;
  private events: TodoEvent[] = [];

  constructor() {
    this.processor = new EventProcessor();

    let _events = (JSON.parse(
      localStorage.getItem(`${Constants.store_key}-${new Date().toLocaleDateString()}`)
    ) || []) as TodoEvent[];

    this.processor.onEventsChanged.subscribe(f => this.events = f);

    this.processor.processAll(_events);

    console.log(_events);

    setTimeout(() => {
      this.processor.timer.onPomodoroStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onShortBreakStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onLongBreakStarted.subscribe(f => NotificationService.send(f, ""));
    }, 1000);
  }

  publish(e: TodoEvent) {
    this.processor.process(e);

    setTimeout(() =>
      localStorage.setItem(
        `${Constants.store_key}-${new Date().toLocaleDateString()}`
        , JSON.stringify(this.events)), 0);
  }
}
