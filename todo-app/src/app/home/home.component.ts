import { Component } from "@angular/core";
import { EventService } from "../_shared/services/event-service";
import { NotificationService } from "../_shared/services/notification.service";

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
