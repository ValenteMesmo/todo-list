import { Component } from "@angular/core";
import { EventType, Task, TaskType } from "../../_shared/services/event-processor";
import { EventService } from "../../_shared/services/event-service";

@Component({
  selector: 'app-current-task',
  templateUrl: 'current-task.component.html',
  styleUrls: ['current-task.component.scss'],
})
export class CurrentTaskComponent {
  pomodoroTask: Task;
  breakTask: Task;
  longBreakTask: Task;

  constructor(public service: EventService) {

    service.processor.onEventsChanged.subscribe(f => {
      this.pomodoroTask = service.processor.tasks.find(f => f.type == TaskType.Pomodoro);
      this.breakTask = service.processor.tasks.find(f => f.type == TaskType.Break);
      this.longBreakTask = service.processor.tasks.find(f => f.type == TaskType.LongBreak);
    });

  }

  completeTask() {

    let index = 0;

    if (this.service.timer.pomodoroState == TaskType.Pomodoro)
      index = this.service.processor.tasks.indexOf(this.pomodoroTask);

    if (this.service.timer.pomodoroState == TaskType.Break)
      index = this.service.processor.tasks.indexOf(this.breakTask);

    if (this.service.timer.pomodoroState == TaskType.LongBreak)
      index = this.service.processor.tasks.indexOf(this.longBreakTask);

    if (index >= 0)
      this.service.publish({
        type: EventType.TaskCompleted,
        date: new Date(),
        args: index
      });
  }
}
