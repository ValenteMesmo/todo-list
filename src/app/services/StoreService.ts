export class StoreService {
  static readonly key = 'todo-list-id-002';

  static save(data: TodoCollection) {
    window.localStorage.setItem(`${this.key}-${data.date.toLocaleDateString()}`, JSON.stringify(data));
    window.localStorage.setItem(`${this.key}-lastdate`, data.date.toLocaleDateString());
  }

  static load(date: Date): TodoCollection {
    const value = window.localStorage.getItem(`${this.key}-${date.toLocaleDateString()}`);
    if (!value) {
      const newValue = new TodoCollection();

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
        ].filter(f => !f.done);

        for (let i = 0; i < previousTodos.length; i++)
          newValue.push(previousTodos[i]);
      }

      return newValue;
    }

    let parsed = JSON.parse(value);
    parsed = Object.assign(new TodoCollection, parsed);
    parsed = Object.setPrototypeOf(parsed, TodoCollection.prototype);
    parsed.date = new Date(parsed.date);
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
    const doneTasks1 = this.tasks.slice(0, TIER1_LENGTH).filter(f => f.done).length;
    const doneTasks2 = this.tasks.slice(0, TIER2_LENGTH).filter(f => f.done).length;
    const doneTasks3 = this.tasks.slice(0, TIER3_LENGTH).filter(f => f.done).length;

    this.percentage1 = (doneTasks1 * 100 / TIER1_LENGTH );
    this.percentage2 = (doneTasks2 * 100 / TIER2_LENGTH );
    this.percentage3 = (doneTasks3 * 100 / TIER3_LENGTH );

    if (this.percentage1 === 100 && this.achieved1 === AchievementState.locked)
      this.achieved1 = AchievementState.unlocking;
    if (this.percentage2 === 100 && this.achieved2 === AchievementState.locked)
      this.achieved2 = AchievementState.unlocking;
    if (this.percentage3 === 100 && this.achieved3 === AchievementState.locked)
      this.achieved3 = AchievementState.unlocking;
  }
}


export class Todo {
  name: string;
  done: boolean;
}
