import { Injectable } from "@angular/core";
import { throttle } from "../decorators/throttle.decorator";
import { AppStateService } from "./app-state.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  get permissionGranted(): boolean {
    return this.state.notificationsEnabled;
  }

  set permissionGranted(value: boolean) {
    this.requestPermission(value);
  }

  constructor(private readonly state: AppStateService) {
  }

  @throttle()
  public send(
    title: string
    , body: string
    , iconUrl: string = 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png') {

    if (this.permissionGranted == false)
      return;

    const notification = new Notification(title, {
      icon: iconUrl,
      body: body,
      //silent: true
    });

    //window.navigator.vibrate(pattern)
    setTimeout(() => notification.close(), 1000 * 60 * 3);

    notification.onclick = () => {
      window.open(window.location.href);
    };
  }

  public requestPermission(value: boolean) {
    if (!value) {
      this.state.notificationsEnabled = false;
      return;
    }

    if (Notification.permission == "granted") {
      this.state.notificationsEnabled = true;
      return;
    }

    Notification.requestPermission().then(f => {
      this.state.notificationsEnabled = f == "granted";
    });
  }
}
