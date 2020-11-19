import { Component } from '@angular/core';
import { StoreService, TodoCollection } from "src/app/services/StoreService";
import { Navigation } from '../../shared/route-constants';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.html'
})
export class TodoPageComponent {
  title = 'Todo';

  Navigation = Navigation;
  
  todoList: TodoCollection;
  textInput = '';
  achieved = false;

  constructor() {
    this.todoList = StoreService.load(new Date());
    this.todoList.updatePercentage();
  }

  add() {
    if (!this.textInput.trim())
      return;

    this.todoList.push({ name: this.textInput.trim(), done: false });
    this.textInput = '';
    StoreService.save(this.todoList);
  }

  remove(todo) {
    this.todoList.remove(todo);
    StoreService.save(this.todoList);
  }

  todoClicked() {
    setTimeout(() => {
      StoreService.save(this.todoList);

      this.todoList.updatePercentage();
    }, 0);

  }

  
}
