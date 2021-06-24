import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './_shared/services/event-service';
import { NotificationService } from './_shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  newTitle: string;

  notification = NotificationService;

  constructor(protected readonly router: Router) {
  }

  addItem() {
  }

}
