import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { AuthenticationService } from "../../authentication/authentication.service";
import { AppStateService } from "./app-state.service";
import { EventProcessor, EventType, TodoEvent } from "./event-processor";
import { MyTimer } from "./my-timer";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: 'root' })
export class EventService {
  //TODO: utilizar cron para cadastrar tarefas recorrentes  
  public processor: EventProcessor;
  public timer: MyTimer = new MyTimer();

  constructor(
    private readonly state: AppStateService
    , readonly NotificationService: NotificationService
    , private readonly azure: AuthenticationService
  ) { }

  initialize(): Observable<void> {

    return new Observable(sub => {
      this.processor = new EventProcessor(this.state);

      this.processor.timeAdded.subscribe(value =>
        this.timer.click(value)
      );

      this.processor.timeRemoved.subscribe(value =>
        this.timer.undoClick(value)
      );

      let _events = this.getCurrent();

      if (this.isFirstAccessOfTheDay()) {
        this.getLastDay().subscribe(previousDayData => {


          console.log(previousDayData);
          const processor2 = new EventProcessor(this.state);
          processor2.processAll(previousDayData);


          [...processor2.tasks]
            .concat(processor2.completedTasks.filter(f => f.repeat))
            .forEach(f =>
              this.state.addEvent({
                type: EventType.taskCreated
                , date: new Date()
                , args: { ...f, index: _events.length }
              })
            );

          console.log(processor2.tasks);
        });
      }

      this.processor.processAll(_events);

      this.timer.onPomodoroStarted.subscribe(f => this.NotificationService.send(f, ""));
      this.timer.onShortBreakStarted.subscribe(f => this.NotificationService.send(f, ""));
      this.timer.onLongBreakStarted.subscribe(f => this.NotificationService.send(f, ""));

      sub.next();
      sub.complete();
    });
  }

  publish(e: TodoEvent) {
    this.processor.process(e);
  }  

  public getCurrent(): TodoEvent[] {
    return this.state["_events"];
  }

  public getLastDay(): Observable<TodoEvent[]> {
    return this.state.getByDate(this.state.lastDate);
  }

  public isFirstAccessOfTheDay(): boolean {
    return new Date().toLocaleDateString() != this.state.lastDate.toLocaleDateString();
  }
}
