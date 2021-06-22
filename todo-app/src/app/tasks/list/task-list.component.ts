import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EventService, EventType, Task } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  templateUrl: './task-list.component.html'
  , styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  constructor(
    protected readonly router: Router
    , protected readonly service: EventService) {
  }

  @throttle()
  remove(task: Task) {
    this.service.publish({ date: new Date(), type: EventType.taskDeleted, args: task.created });
  }
}
