import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor() {
    if (Notification.permission !== 'granted')
      Notification.requestPermission();
  }

  notify(title, body) {
    if (Notification.permission !== 'granted')
      return;

    const notification = new Notification(title, {
      //icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: body,
    });
    notification.onclick = function () {
      window.focus();
    };

  }
}
