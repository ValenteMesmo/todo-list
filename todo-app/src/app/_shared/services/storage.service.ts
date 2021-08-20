import { Injectable } from "@angular/core";
import { TodoEvent } from "./event-processor";
import * as moment from "moment";

@Injectable({ providedIn: 'root' })
export class StorageService {

  readonly store_key = 'todo.2.0.1';

  save(current: TodoEvent[]): void {
    const date = new Date();

    localStorage.setItem(
      `${this.store_key}-${date.toLocaleDateString()}`
      , JSON.stringify(current)
    );

    localStorage.setItem(
      `${this.store_key}-lastdate`
      , date.toLocaleDateString()
    );
  }

  getCurrent(): TodoEvent[] {
    return this.getByDate(new Date());
  }

  isFirstAccessOfTheDay(): boolean {
    return new Date().toLocaleDateString() != localStorage.getItem(`${this.store_key}-lastdate`);
  }

  getByDate(date: Date): TodoEvent[] {
    return (
      JSON.parse(
        localStorage.getItem(
          `${this.store_key}-${date.toLocaleDateString()}`
        )
      ) || []
    ) as TodoEvent[];
  }

  getLastDay(): TodoEvent[] {
    const dateString = localStorage.getItem(`${this.store_key}-lastdate`);
    if (!dateString)
      return [];

    return this.getByDate(moment(dateString, "DD/MM/YYYY").toDate());
  }

  saveNotification(value: boolean): void {
    localStorage.setItem(`${this.store_key}-notifications`, value ? '1' : '0');
  }

  loadNotification(): boolean {
    if (localStorage.getItem(`${this.store_key}-notifications`) == '1')
      return true;

    return false;
  }
}
