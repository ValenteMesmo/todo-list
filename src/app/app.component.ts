import { Component } from '@angular/core';
import { StoreService } from "src/app/services/StoreService";
import { SoundService } from './services/sound-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';

  todoList = [];
  textInput = '';
  achieved = false;
  percentage: number;

  constructor() {
    SoundService.preLoad();

    this.todoList =  StoreService.load();
    this.updatePercentage();
  }

  add() {
    if (!this.textInput.trim())
      return;

    this.todoList.push({ name: this.textInput.trim() });
    this.textInput = '';
    StoreService.save(this.todoList);
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
