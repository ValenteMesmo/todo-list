import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { throttle } from "../../_shared/decorators/throttle.decorator";
import { ItemReorderEventDetail } from '@ionic/core';
import { EventService } from "../../_shared/services/event-service";
import { EventType, Task } from "../../_shared/services/event-processor";

@Component({
  selector: 'task-list'
  , templateUrl: './task-list.component.html'
  , styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  constructor(
    protected readonly service: EventService) {
  }

  @throttle()
  complete(index: number) {
    this.service.publish({
      type: EventType.TaskCompleted,
      date: new Date(),
      args: index
    });
  }

  @throttle()
  remove(index: Number) {
    this.service.publish({
      date: new Date(),
      type: EventType.taskDeleted,
      args: index
    });
  }
}
