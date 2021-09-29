import { Component } from "@angular/core";
import { throttle } from "../../_shared/decorators/throttle.decorator";
import { EventType, Task, TaskType } from "../../_shared/services/event-processor";
import { EventService } from "../../_shared/services/event-service";

@Component({
  selector: 'new-task-form'
  , templateUrl: 'new-task-form.component.html'
})
export class NewTaskFormComponent {

  model: Task = {
    created: new Date(),
    name: '',
    repeat: false,
    type: TaskType.Pomodoro
  };

  constructor(
    public readonly service: EventService
  ) {
  }


  @throttle()
  save() {
    if (!this.model.name)
      return;

    this.service.publish({
      type: EventType.taskCreated,
      date: new Date(),
      args: { ...this.model }
    });

    this.model.name = '';
  }

}
