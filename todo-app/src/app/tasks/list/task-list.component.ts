import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { EventService, EventType, Task } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  templateUrl: './task-list.component.html'
  , styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  gender = "0";

  constructor(
    protected readonly router: Router
    , protected readonly service: EventService) {
  }

  @throttle()
  add() {
    this.service.publish({ date: new Date(), type: EventType.taskCreated, args: 'testando 123...' });
  }

  @throttle()
  remove(task: Task) {
    this.service.publish({ date: new Date(), type: EventType.undoTaskCreated, args: task.created });
  }
}
