import { Component } from '@angular/core';
import { StoreService, TodoCollection } from "src/app/services/StoreService";
import { Navigation } from '../../shared/route-constants';

@Component({
  selector: 'app-doing-page',
  templateUrl: './doing-page.html'
})
export class DoingPageComponent {
  title = 'Doing';

  Navigation = Navigation;
  
  todoList: TodoCollection;
  textInput = '';

  constructor() {
    this.todoList = StoreService.load(new Date());
    this.todoList.updatePercentage();
  }

  todoClicked() {
      StoreService.save(this.todoList);
      this.todoList.updatePercentage();
  }

  onAchievedChange() {
    StoreService.save(this.todoList);

  }
}
