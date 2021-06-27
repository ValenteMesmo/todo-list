import { Injectable } from "@angular/core";
import { TodoEvent } from "./event-processor";

@Injectable({ providedIn: 'root' })
export class StorageService {

  readonly store_key = 'todo.2.0.0';

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

    return this.getByDate(new Date(dateString));
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
