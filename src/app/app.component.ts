import { Component } from '@angular/core';
import { Navigation } from './services/Navigation';
import { Cronometer } from './services/cronometer';
import { TodoCollection, StoreService } from './services/StoreService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  Navigation = Navigation;
  todos: TodoCollection;

  constructor(public readonly cronometer: Cronometer) {
    StoreService.getCurrent().subscribe(f => this.todos  = f);
  }
}
