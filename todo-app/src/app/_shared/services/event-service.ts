import { Injectable } from "@angular/core";
import { EventProcessor, TodoEvent } from "./event-processor";
import { MyTimer } from "./my-timer";
import { NotificationService } from "./notification.service";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: utilizar cron para cadastrar tarefas recorrentes
  public processor: EventProcessor;
  public timer: MyTimer = new MyTimer();

  constructor(
    private readonly StorageService: StorageService
    , readonly NotificationService: NotificationService) {
    this.processor = new EventProcessor();

    this.processor.timeAdded.subscribe(value =>
      this.timer.click(value)
    );

    this.processor.timeRemoved.subscribe(value =>
      this.timer.undoClick(value)
    );

    const previousDayData = StorageService.getLastDay();

    let _events = StorageService.getCurrent();

    this.processor.onEventsChanged.subscribe(f => {
      console.log(f);
      this.StorageService.save(f);
    });

    this.processor.processAll(_events);

    setTimeout(() => {
      this.timer.onPomodoroStarted.subscribe(f => NotificationService.send(f, ""));
      this.timer.onShortBreakStarted.subscribe(f => NotificationService.send(f, ""));
      this.timer.onLongBreakStarted.subscribe(f => NotificationService.send(f, ""));
    }, 1000);
  }

  publish(e: TodoEvent) {
    this.processor.process(e);
  }
}
