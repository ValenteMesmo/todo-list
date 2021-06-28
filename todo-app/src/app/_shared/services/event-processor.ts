import { Subject } from "rxjs";

export interface TodoEvent {
  type: EventType;
  date: Date;
  args?: any;
}

export enum EventType {
  chronometerButtonClick = 0,
  undoChronometerButtonClick = 1,
  taskCreated = 2,
  taskDeleted = 3,
  taskEdited = 4,
  TaskOrderChanged = 5,
  TaskCompleted = 6,
  undoTaskCompletion = 7
}

export enum TaskType {
  Pomodoro = 0,
  Break = 1,
  LongBreak = 2
}

export interface Task {
  completed?: Date;
  created: Date;
  name: string;
  repeat: boolean;
  type: TaskType;
}

export class EventProcessor {
  public onEventsChanged = new Subject<TodoEvent[]>();
  public timeAdded = new Subject<Date>();
  public timeRemoved = new Subject<Date>();

  private _events: TodoEvent[] = [];

  public times: Date[] = [];
  public tasks: Task[] = [];
  public completedTasks: Task[] = [];

  constructor() { }

  public process(e: TodoEvent) {
    this.processSingleEvent(e, true);
  }

  private processSingleEvent(e: TodoEvent, emitChanges: boolean) {
    e.date = new Date(e.date);

    if (e.type == EventType.chronometerButtonClick)
      this.addTime(e);

    if (e.type == EventType.undoChronometerButtonClick)
      this.removeTime(e);

    if (e.type == EventType.taskCreated)
      this.handleTaskCreated(e);

    if (e.type == EventType.taskEdited)
      this.handleTaskEdited(e);

    if (e.type == EventType.taskDeleted)
      this.handleUndoTaskDeleted(e);

    if (e.type == EventType.TaskCompleted)
      this.handleTaskCompleted(e);

    if (e.type == EventType.undoTaskCompletion)
      this.handleTaskUndo(e);

    if (e.type == EventType.TaskOrderChanged)
      this.handleTaskReorder(e);

    if (emitChanges == false)
      return;

    this._events.push(e);

    this.onEventsChanged.next(this._events)

  }

  public processAll(events: TodoEvent[]) {
    events.forEach(e => this.processSingleEvent(e, false));
    this._events = events;
    setTimeout(() =>
      this.onEventsChanged.next(this._events)
      , 0);
  }

  private addTime(e: TodoEvent) {
    this.times.push(e.date);
    this.timeAdded.next(e.date);
  }

  private removeTime(e: TodoEvent) {
    this.times = this.times.filter(f => f.getTime() != new Date(e.args).getTime());
    this.timeRemoved.next(new Date(e.args));
  }

  private handleTaskEdited(e: TodoEvent) {
    const index = e.args.index as number;
    const data = e.args as Task;

    if (data && this.tasks[index])
      this.tasks[index] = data;
  }

  private handleTaskCreated(e: TodoEvent) {

    const data = e.args as Task;

    if (data)
      this.tasks.push(data);
  }

  private handleUndoTaskDeleted(e: TodoEvent) {
    //Todo: remove by index?
    this.tasks = this.tasks
      .filter(f => f.created.getTime() != new Date(e.args).getTime());
  }

  private handleTaskCompleted(e: TodoEvent) {

    const removed = this.tasks.splice(e.args, 1)[0];
    if (removed) {
      removed.completed = e.date;
      this.completedTasks.push(removed);
    }
    //this.tasks = this.tasks
    //  .filter(f => f.created.getTime() != new Date(e.args).getTime());
  }

  private handleTaskUndo(e: TodoEvent) {
    e.args = new Date(e.args);

    const task = this.completedTasks
      .find(f =>
        new Date(f.completed).getTime() == e.args.getTime()
      );

    if (task) {
      task.completed = null;
      this.tasks = [task].concat(this.tasks);
      this.completedTasks = this.completedTasks.filter(f => f != task);
    }
    //this.tasks = this.tasks
    //  .filter(f => f.created.getTime() != new Date(e.args).getTime());
  }

  private handleTaskReorder(e: TodoEvent) {
    function array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    };

    this.tasks = array_move(this.tasks, e.args.from, e.args.to);
  }


}

