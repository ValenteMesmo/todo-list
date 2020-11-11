import { Component } from '@angular/core';
import { StoreService } from "src/app/services/StoreService";

@Component({
  selector: 'app-doing-page',
  templateUrl: './doing-page.html'
})
export class DoingPageComponent {
  title = 'Doing';

  todoList = [];
  textInput = '';
  achieved = false;
  percentage: number;

  constructor() {
    this.todoList = StoreService.load();
    this.updatePercentage();
  }

  todoClicked() {
    setTimeout(() => {
      StoreService.save(this.todoList);

      this.updatePercentage();

      if (this.percentage < 100)
        return;

      this.achieved = true;

    }, 0);

  }

  updatePercentage() {
    const doneTasks = this.todoList.filter(f => f.done).length;
    const allTasks = this.todoList.length;

    this.percentage = (doneTasks * 100 / allTasks);
  }
}
