import { Component } from '@angular/core';
import { StoreService, TodoCollection, TIER1_LENGTH, TIER2_LENGTH, TIER3_LENGTH, Todo } from "src/app/services/StoreService";
import { Navigation } from '../../services/Navigation';

@Component({
  selector: 'app-doing-page',
  templateUrl: './doing-page.html',
  styleUrls: ['./doing-page.scss']
})
export class DoingPageComponent {
  title = 'Doing';

  TIER1_LENGTH = TIER1_LENGTH;
  TIER2_LENGTH = TIER2_LENGTH;
  TIER3_LENGTH = TIER3_LENGTH;

  Navigation = Navigation;

  todoList: TodoCollection;
  textInput = '';

  constructor() {
    StoreService.getCurrent().subscribe(f => this.todoList = f);
  }

  todoClicked() {
    StoreService.save(this.todoList);
    this.todoList.updatePercentage();
  }

  onAchievedChange() {
    StoreService.save(this.todoList);
  }

  shoudRenderTodoItem(i) {

    if (i < TIER1_LENGTH)
      return true;

    if (i >= TIER1_LENGTH && i < TIER2_LENGTH && this.todoList?.achieved1)
      return true;

    if (i >= TIER2_LENGTH && i < TIER3_LENGTH && this.todoList?.achieved2)
      return true;   

    return false;
  }
}
