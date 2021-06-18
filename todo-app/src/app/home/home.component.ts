import { Component } from "@angular/core";
import { EventService, NotificationService } from "../asdasdasasd";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  notification = NotificationService;

  constructor(
    protected readonly service: EventService
  ) { }
}
