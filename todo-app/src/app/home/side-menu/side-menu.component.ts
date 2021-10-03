import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Event } from "@angular/router";
import { AuthenticationService } from "../../authentication/authentication.service";
import { throttle } from "../../_shared/decorators/throttle.decorator";
import { AppStateService } from "../../_shared/services/app-state.service";
import { NotificationService } from "../../_shared/services/notification.service";

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrls: ['side-menu.component.scss']
})
export class SideMenuComponent {

  private _open: boolean;
  public get open(): boolean {
    return this._open;
  }

  @Input()
  public set open(value: boolean) {
    this.updateValue(value);
  }

  @Output()
  public openChange = new EventEmitter<boolean>();

  @throttle()
  protected updateValue(value) {
    this._open = value;
    this.openChange.emit(value);
  }

  constructor(
    public readonly auth: AuthenticationService
    , public readonly notification: NotificationService
  ) { }


  public clickout() {
    if (this.open)
      this.open = false;
  }

  public set notificationToggle(value: boolean) {
    this.notification.requestPermission(value);
  }

  public get notificationToggle() {
    return this.notification.permissionGranted;
  }
}
