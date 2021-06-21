import { Component } from "@angular/core";
import { EventService } from "../../asdasdasasd";

@Component({
  selector: 'app-current-task',
  templateUrl: 'current-task.component.html',
  styleUrls: ['current-task.component.scss'],
})
export class CurrentTaskComponent {
  constructor(
    protected readonly service: EventService) { }
}
