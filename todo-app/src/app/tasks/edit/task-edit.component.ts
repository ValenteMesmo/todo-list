import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { IonInput } from "@ionic/angular";
import { EventService, EventType, Task } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  templateUrl: './task-edit.component.html'
  , styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {

  @ViewChild('taskNameInput', { static: true }) ionInput: IonInput;

  constructor(
    protected readonly router: Router
    , protected readonly service: EventService) {
  }

  ngOnInit(): void {
    //this.ionInput.setFocus().finally();
    console.dir(this.ionInput);

    setTimeout(()=>
    this.ionInput.setFocus(),150);

    //this.ionInput.getInputElement().then(f => {
    //  console.dir(f);
    //  console.dir(f.focus);
    //  f.focus();
    //});
  }
}
