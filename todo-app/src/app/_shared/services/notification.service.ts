import { Injectable } from "@angular/core";
import { throttle } from "../decorators/throttle.decorator";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _permissionGranted: boolean = false;

  get permissionGranted(): boolean {
    return this._permissionGranted;
  }

  set permissionGranted(value: boolean) {
    if (value)
      this.requestPermission();
    else {
      this._permissionGranted = false;
      this.StorageService.saveNotification(false);      
    }
  }

  constructor(private readonly StorageService: StorageService) {
    this._permissionGranted =
      Notification.permission == "granted"
      && this.StorageService.loadNotification();
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

  public requestPermission() {
    if (Notification.permission == "granted") {
      this._permissionGranted = true;
      this.StorageService.saveNotification(true);      
      return;
    }

    Notification.requestPermission().then(f => {
      this._permissionGranted = f == "granted";
      this.StorageService.saveNotification(this._permissionGranted);      
    });
  }
}
