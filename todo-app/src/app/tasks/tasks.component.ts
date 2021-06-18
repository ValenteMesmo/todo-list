import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  templateUrl: './tasks.component.html'
  , styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  constructor(protected readonly router: Router) {

  }
}
