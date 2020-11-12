
export enum AchievementState {
  locked,
  unlocking,
  unlocked
}

export class TodoCollection {
  firstTier: Todo[] = [];
  secondTier: Todo[] = [];
  thirdTier: Todo[] = [];
  extraTier: Todo[] = [];

  percentage1: number;
  percentage2: number;
  percentage3: number;

  achieved1 = AchievementState.locked;
  achieved2 = AchievementState.locked;
  achieved3 = AchievementState.locked;

  push(todo: Todo) {
    if (this.firstTier.length <= 3)
      this.firstTier.push(todo);
    else if (this.secondTier.length <= 5)
      this.secondTier.push(todo);
    else if (this.thirdTier.length <= 7)
      this.thirdTier.push(todo);
    else
      this.extraTier.push(todo);
  }

  remove(todo: Todo) {
    this.firstTier = this.firstTier.filter(f => f !== todo);
    this.secondTier = this.secondTier.filter(f => f !== todo);
    this.thirdTier = this.thirdTier.filter(f => f !== todo);
    this.extraTier = this.extraTier.filter(f => f !== todo);
  }

  updatePercentage() {
    const doneTasks1 = this.firstTier.filter(f => f.done).length;
    const doneTasks2 = this.secondTier.filter(f => f.done).length;
    const doneTasks3 = this.thirdTier.filter(f => f.done).length;
    const allTasks1 = this.firstTier.length;
    const allTasks2 = this.secondTier.length;
    const allTasks3 = this.thirdTier.length;

    this.percentage1 = (doneTasks1 * 100 / allTasks1);
    this.percentage2 = (doneTasks2 * 100 / allTasks2);
    this.percentage3 = (doneTasks3 * 100 / allTasks3);

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

export class StoreService {
  static readonly key = 'todo list id v0.0.4';


  static save(data) {
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }


  static load(): TodoCollection {
    const value = window.localStorage.getItem(this.key);
    if (!value)
      return new TodoCollection();

    let parsed = JSON.parse(value);
    parsed = Object.assign(new TodoCollection, parsed)
    parsed = Object.setPrototypeOf(parsed, TodoCollection.prototype)
    return parsed;
  }
}
