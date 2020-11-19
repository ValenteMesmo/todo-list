import { Component } from '@angular/core';
import { Navigation } from './services/Navigation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  Navigation = Navigation;
}
