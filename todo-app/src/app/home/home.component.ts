import { Component } from "@angular/core";
import { of } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { AuthenticationService } from "../authentication/authentication.service";
import { EventService } from "../_shared/services/event-service";
import { NotificationService } from "../_shared/services/notification.service";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  notification = NotificationService;
  //progress = 0.0;
  openMenu = false;

  constructor(
    public readonly service: EventService,
    public readonly auth: AuthenticationService
  ) {
    //of(0.0).pipe(
    //  delay(1000)
    //  , tap(() => this.progress = 0.25)
    //  , delay(1000)
    //  , tap(() => this.progress = 0.5)
    //  , delay(1000)
    //  , tap(() => this.progress = 0.75)
    //  , delay(1000)
    //  , tap(() => this.progress = 1)
    //).subscribe(f => { });

  }

  save() {
    //this.auth.upload();
  }

  load() {
    //this.auth.download();
  }

  logout() {
    this.auth.logout();
  }
  
}
