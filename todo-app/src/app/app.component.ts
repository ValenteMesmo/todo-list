import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { EventService, NotificationService } from './asdasdasasd';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  newTitle: string;

  notification = NotificationService;

  constructor(
    protected readonly service: EventService
    , protected readonly router: Router
  ) {    
  }

  addItem() {
  }

}
