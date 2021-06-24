import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { throttle } from "../../_shared/decorators/throttle.decorator";
import { ItemReorderEventDetail } from '@ionic/core';
import { EventService } from "../../_shared/services/event-service";
import { EventType, Task } from "../../_shared/services/event-processor";

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

  @throttle()
  orderChanged(event: CustomEvent<ItemReorderEventDetail>) {
    this.service.publish({
      date: new Date(),
      type: EventType.TaskOrderChanged,
      args: {
        from: event.detail.from
        , to: event.detail.to
      }
    });

    event.detail.complete();
  }
}
