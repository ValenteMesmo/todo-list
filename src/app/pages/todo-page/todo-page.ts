import { Component } from '@angular/core';
import { StoreService, TodoCollection, TIER1_LENGTH, TIER2_LENGTH, TIER3_LENGTH } from "src/app/services/StoreService";
import { Navigation } from '../../services/Navigation';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.html'
})
export class TodoPageComponent {
  title = 'Todo';

  TIER1_LENGTH = TIER1_LENGTH;
  TIER2_LENGTH = TIER2_LENGTH;
  TIER3_LENGTH = TIER3_LENGTH;

  Navigation = Navigation;

  todoList: TodoCollection;
  textInput = '';
  achieved = false;

  constructor() {
    StoreService.getCurrent().subscribe(f => this.todoList = f);
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todoList.tasks, event.previousIndex, event.currentIndex);
    StoreService.save(this.todoList);
  }
}
