import { Constants } from "../constants";
import { throttle } from "../decorators/throttle.decorator";

class _NotificationService {
  private _permissionGranted: boolean = false;

  get permissionGranted(): boolean {
    return this._permissionGranted;
  }

  set permissionGranted(value: boolean) {
    if (value)
      this.requestPermission();
    else {
      this._permissionGranted = false;
      localStorage.setItem(`${Constants.store_key}-notifications`, '0');
    }
  }

  constructor() {
    this._permissionGranted =
      Notification.permission == "granted"
      && localStorage.getItem(`${Constants.store_key}-notifications`) == '1';
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
      localStorage.setItem(`${Constants.store_key}-notifications`, '1');
      return;
    }

    Notification.requestPermission().then(f => {
      this._permissionGranted = f == "granted";
      localStorage.setItem(`${Constants.store_key}-notifications`, this._permissionGranted ? '1' : '0');
    });
  }

}

export const NotificationService = new _NotificationService();
