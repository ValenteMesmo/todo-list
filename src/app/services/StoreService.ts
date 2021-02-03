import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class StoreService {
  private static readonly key = 'todo-list-id-006';

  static save(current) {
    window.localStorage.setItem(`${this.key}-${current.date.toLocaleDateString()}`, JSON.stringify(current));
    window.localStorage.setItem(`${this.key}-lastdate`, current.date.toLocaleDateString());
    this.todosLoaded.emit(current);
  }

  private static todosLoaded: EventEmitter<TodoCollection> = new EventEmitter<TodoCollection>();

  static getCurrent(): Observable<TodoCollection> {
    setTimeout(() => StoreService.todosLoaded.emit(StoreService.getByDate(new Date(), true)), 1);
    return StoreService.todosLoaded;
  }

  static getByDate(date: Date, isCurrentDay: boolean): TodoCollection {
    const value = window.localStorage.getItem(`${this.key}-${date.toLocaleDateString()}`);
    if (!value) {
      const newValue = new TodoCollection();

      if (!isCurrentDay)
        return newValue;

      const lastDateString = window.localStorage.getItem(`${this.key}-lastdate`);
      if (!lastDateString)
        return newValue;

      const previousCollectionString = window.localStorage.getItem(`${this.key}-${lastDateString}`);
      if (!previousCollectionString)
        return newValue;

      const previousCollectionParsed = JSON.parse(previousCollectionString) as TodoCollection;
      if (previousCollectionParsed && previousCollectionParsed.tasks) {
        const previousTodos = [
          ...previousCollectionParsed.tasks
        ].filter(f => !f.done || f.stacks > f.done || f.recurring)
          .map(f => {
            if (f.recurring)
              f.done = 0;
            return f;
          });

        for (let i = 0; i < previousTodos.length; i++)
          newValue.push(previousTodos[i]);
      }

      return newValue;
    }

    let parsed = JSON.parse(value);
    parsed = Object.assign(new TodoCollection(), parsed);
    parsed = Object.setPrototypeOf(parsed, TodoCollection.prototype);
    parsed.date = new Date(parsed.date);
    parsed.updatePercentage();
    return parsed;
  }
}

export enum AchievementState {
  locked,
  unlocking,
  unlocked
}

export const TIER1_LENGTH = 4;
export const TIER2_LENGTH = TIER1_LENGTH + 6;
export const TIER3_LENGTH = TIER2_LENGTH + 8;

export class TodoCollection {
  tasks: Todo[] = [];

  times: string[] = [];

  date: Date = new Date();

  percentage1: number;
  percentage2: number;
  percentage3: number;

  achieved1 = AchievementState.locked;
  achieved2 = AchievementState.locked;
  achieved3 = AchievementState.locked;

  push(todo: Todo) {
    this.tasks.push(todo);
  }

  remove(todo: Todo) {
    const completeList = [
      ...this.tasks.filter(f => f !== todo)
    ];

    this.tasks = [];

    completeList.forEach(f => this.push(f));
  }

  updatePercentage() {
    const doneCount = this.tasks.map(f => Number(f.done)).reduce((sum, current) => sum + current, 0);

    this.percentage1 = (doneCount * 100 / TIER1_LENGTH);
    this.percentage2 = (doneCount * 100 / TIER2_LENGTH);
    this.percentage3 = (doneCount * 100 / TIER3_LENGTH);

    if (this.percentage1 >= 100) {
      if (this.achieved1 === AchievementState.locked)
        this.achieved1 = AchievementState.unlocking;
    }
    else
      this.achieved1 = AchievementState.locked;

    if (this.percentage2 >= 100) {
      if (this.achieved2 === AchievementState.locked)
        this.achieved2 = AchievementState.unlocking;
    }
    else
      this.achieved2 = AchievementState.locked;

    if (this.percentage3 >= 100) {
      if (this.achieved3 === AchievementState.locked)
        this.achieved3 = AchievementState.unlocking;
    }
    else
      this.achieved3 = AchievementState.locked;


  }
}


export class Todo {
  name: string;
  done: boolean | number;
  stacks: number;
  recurring: boolean;
}
