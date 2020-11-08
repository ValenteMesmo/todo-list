import { Component } from '@angular/core';
import { SoundService } from 'src/app/services/sound-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';

  todoList = [
    { name: 'teste 1', done: false }
    , { name: 'lavar a louça' }
    , { name: 'tirar o lixo' }
    , { name: 'teste 2' }
    , { name: 'teste 3' }
  ];
  textInput = '';
  achieved = false;
  percentage: number;
  add() {
    if (!this.textInput.trim())
      return;

    this.todoList.push({ name: this.textInput.trim() });
    this.textInput = '';

  }

  todoClicked() {
    setTimeout(() => {
      const doneTasks = this.todoList.filter(f => f.done).length;
      const allTasks = this.todoList.length;

      this.percentage = (doneTasks * 100 / allTasks);
      if (doneTasks < allTasks)
        return;

      this.achieved = true;
    }, 0);

  }
}
