import { Injectable } from "@angular/core";
import { EventProcessor, EventType, TodoEvent } from "./event-processor";
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

    //StorageService.save([]);
    this.processor = new EventProcessor();

    this.processor.timeAdded.subscribe(value =>
      this.timer.click(value)
    );

    this.processor.timeRemoved.subscribe(value =>
      this.timer.undoClick(value)
    );



    let _events = StorageService.getCurrent();


    if (StorageService.isFirstAccessOfTheDay()) {
      const previousDayData = StorageService.getLastDay();
      console.log(previousDayData);
      const processor2 = new EventProcessor();
      processor2.processAll(previousDayData);


      [...processor2.tasks]
        .concat(processor2.completedTasks.filter(f => f.repeat))        
        .forEach(f =>
          _events.push({
            type: EventType.taskCreated
            , date: new Date()
            , args: { ...f, index: _events.length }
          })
        );

      console.log(processor2.tasks);
    }


    this.processor.processAll(_events);

    this.processor.onEventsChanged.subscribe(f => {
      if (f.length)
        this.StorageService.save(f);
    });

    this.timer.onPomodoroStarted.subscribe(f => NotificationService.send(f, ""));
    this.timer.onShortBreakStarted.subscribe(f => NotificationService.send(f, ""));
    this.timer.onLongBreakStarted.subscribe(f => NotificationService.send(f, ""));

  }

  publish(e: TodoEvent) {
    this.processor.process(e);
  }
}
