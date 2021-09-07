import { Injectable } from "@angular/core";
import { empty, forkJoin, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AuthenticationService } from "../../authentication/authentication.service";
import { throttle } from "../decorators/throttle.decorator";
import { Task, TodoEvent } from "./event-processor";

class AppInfo {
  lastDate: Date;
  notificationsEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {

  private readonly STORE_KEY = 'todo.2.0.2';
  private readonly APP_INFO = `${this.STORE_KEY}-appinfo`;
  private DATE_EVENTS =
    (date: Date) => `${this.STORE_KEY}-${this.formatDate(date)}`;

  private currentDate = new Date();

  private _appInfo: AppInfo;

  public get notificationsEnabled(): boolean {
    return this._appInfo.notificationsEnabled;
  }
  public set notificationsEnabled(value: boolean) {
    this._appInfo.notificationsEnabled = value;
  }

  public get lastDate(): Date {
    return this._appInfo.lastDate;
  }
  public set lastDate(value: Date) {
    this._appInfo.lastDate = value;
    this.save();
  }

  //todo: separar o save appinfo do save event...
  //salvar appInfo só quando ele mudar
  private _events: TodoEvent[] = [];
  public addEvent(event: TodoEvent) {
    this._events.push(event);
    this._appInfo.lastDate =new Date();
    this.save();
  }
  public forEachEvent(handler: (event: TodoEvent) => void) {
    this._events.forEach(handler);
  }

  constructor(
    private readonly azure: AuthenticationService
  ) {
    this._appInfo = new AppInfo();
    this._appInfo.lastDate = new Date();
  }

  public load(): Observable<void> {
    const tasks = [
      this.azure.load<AppInfo>(this.APP_INFO)
        .pipe(
          map(f => {
            this._appInfo = f;
            this._appInfo.lastDate = new Date(this._appInfo.lastDate);
          })
          , catchError(() => of(null))
        )
      , this.azure.load<TodoEvent[]>(this.DATE_EVENTS(this.currentDate))
        .pipe(
          map(f => { this._events = f })
          , catchError(() => of(null))
        )
    ];

    return forkJoin(tasks).pipe(map(() => { }));
  }

  @throttle(300)
  public save() {
    const tasks = [
      this.azure.save(this.APP_INFO, this._appInfo)
      , this.azure.save(this.DATE_EVENTS(this.currentDate), this._events)
    ];

    forkJoin(tasks).subscribe();
  }

  public getByDate(date: Date): Observable<TodoEvent[]> {
    return this.azure.load<TodoEvent[]>(
      this.DATE_EVENTS(date));
  }

  private formatDate(date: Date): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}
