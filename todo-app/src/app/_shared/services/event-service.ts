import { Injectable } from "@angular/core";
import { EventProcessor, TodoEvent } from "./event-processor";
import { NotificationService } from "./notification.service";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: utilizar cron para cadastrar tarefas recorrentes
  public processor: EventProcessor;
  private events: TodoEvent[] = [];

  constructor(
    private readonly StorageService: StorageService
    , readonly NotificationService: NotificationService) {
    this.processor = new EventProcessor();

    const previousDayData = StorageService.getLastDay();
    console.log(previousDayData);

    let _events = StorageService.getCurrent();
    console.log(_events);

    this.processor.onEventsChanged.subscribe(f => this.events = f);

    this.processor.processAll(_events);

    setTimeout(() => {
      this.processor.timer.onPomodoroStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onShortBreakStarted.subscribe(f => NotificationService.send(f, ""));
      this.processor.timer.onLongBreakStarted.subscribe(f => NotificationService.send(f, ""));
    }, 1000);
  }

  publish(e: TodoEvent) {
    this.processor.process(e);

    setTimeout(() => this.StorageService.save(this.events), 0);
  }
}
