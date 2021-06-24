import { Component } from "@angular/core";
import { EventType } from "../../_shared/services/event-processor";
import { EventService } from "../../_shared/services/event-service";

@Component({
  selector: 'app-current-task',
  templateUrl: 'current-task.component.html',
  styleUrls: ['current-task.component.scss'],
})
export class CurrentTaskComponent {
  constructor(
    protected readonly service: EventService) { }

  completeTask() {
    this.service.publish({
      date: new Date(),
      type: EventType.TaskCompleted,
      args: 0
    });
  }
}
