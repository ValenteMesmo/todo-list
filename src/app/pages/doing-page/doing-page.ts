import { Component } from '@angular/core';
import { StoreService, TodoCollection } from "src/app/services/StoreService";

@Component({
  selector: 'app-doing-page',
  templateUrl: './doing-page.html'
})
export class DoingPageComponent {
  title = 'Doing';

  todoList: TodoCollection;
  textInput = '';
  achieved = false;
  percentage: number;

  constructor() {
    this.todoList = StoreService.load();
    this.todoList.updatePercentage();
  }

  todoClicked() {
    setTimeout(() => {
      StoreService.save(this.todoList);

      this.todoList.updatePercentage();

      if (this.percentage < 100)
        return;

      this.achieved = true;

    }, 0);

  }
}
