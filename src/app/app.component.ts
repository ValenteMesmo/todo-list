import { Component } from '@angular/core';
import { Navigation } from './shared/route-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  Navigation = Navigation;
}
