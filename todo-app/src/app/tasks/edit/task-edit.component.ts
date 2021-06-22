import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonInput } from "@ionic/angular";
import { EventService, EventType, Task, TaskType } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  templateUrl: './task-edit.component.html'
  , styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

  @ViewChild('taskNameInput', { static: true })
  ionInput: IonInput;

  editId: string;
  model = { name: '', type: '0', repeats: false};

  constructor(
    protected readonly router: Router
    , protected readonly service: EventService
    , readonly activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(f => {
      this.editId = f["id"];

      const task = this.service.processor.tasks[this.editId] as Task;
      if (!task) {
        this.editId = null;
        return;
      }

      this.model.name = task.name;
      this.model.type = task.type.toString();
      this.model.repeats = task.repeat;
    });
  }

  ngOnInit(): void {

    setTimeout(() =>
      this.ionInput.setFocus(), 150);

  }

  @throttle()
  save() {

    const task : Task = {
      created: new Date(),
      name: this.model.name,
      repeat: this.model.repeats,
      type: Number(this.model.type)
    };
        
    this.service.publish({
      date: new Date(),
      type: !this.editId ? EventType.taskCreated : EventType.taskEdited,
      args: !this.editId ? task : { ...task, index: Number(this.editId) }
    });

    this.router.navigate(['tasks']);
  }
}
