import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AppStateService } from "./app-state.service";

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
  public onEventsChanged = new Subject();
  public timeAdded = new Subject<Date>();
  public timeRemoved = new Subject<Date>();
  public goal1Reached = new Subject();
  public goal2Reached = new Subject();
  public goal3Reached = new Subject();

  //state
  public times: Date[] = [];
  public tasks: Task[] = [];
  public completedTasks: Task[] = [];
  public progress = 0;
  public currentGoal = 1;
  //state

  constructor(private readonly appState: AppStateService) { }

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

    this.appState.addEvent(e);

    this.onEventsChanged.next();
  }

  public processAll(events: TodoEvent[]) {
    events.forEach(e => this.processSingleEvent(e, false));
    setTimeout(() =>
      this.onEventsChanged.next()
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
    this.tasks.splice(e.args, 1)[0];
  }

  private handleTaskCompleted(e: TodoEvent) {

    const removed = this.tasks.splice(e.args, 1)[0];
    if (removed) {
      removed.completed = e.date;
      this.completedTasks.push(removed);
    }

    this.updateProgress();
  }

  private updateProgress() {
    const completeCount = this.completedTasks.length;
    const goal1 = 3;
    const goal2 = 9;
    const goal3 = 18;

    const calculateProgress = (goal: number) =>
      this.progress = (100 * completeCount) / goal;

    if (completeCount < goal1) {
      this.currentGoal = 1;
      calculateProgress(goal1);
    }
    else if (completeCount < goal2) {
      if (this.currentGoal != 2)
        this.goal1Reached.next();

      this.currentGoal = 2;
      calculateProgress(goal2);
    }
    else if (completeCount < goal3) {
      if (this.currentGoal != 3)
        this.goal2Reached.next();

      this.currentGoal = 3;
      calculateProgress(goal3);
    }
    else if (this.currentGoal == 3) {
      this.goal3Reached.next();

      this.currentGoal = 4;
      this.progress = 100;
    }
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

    this.updateProgress();
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

