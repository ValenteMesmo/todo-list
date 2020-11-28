import { Component } from '@angular/core';
import { StoreService, TodoCollection } from '../../services/StoreService';
import * as moment from 'moment';

@Component({
  selector: 'score-graph',
  templateUrl: './score-graph.html',
  styleUrls: ['./score-graph.scss']
})
export class ScoreGraphComponent {

  data = [];
  openModal: boolean;
  selectedSquare: any;

  constructor() {

    StoreService.getCurrent().subscribe(f => {

      const today = moment(new Date());
      const currentDay = 365 - 7 + today.isoWeekday();
      this.data = [];

      for (let i = 1; i <= currentDay; i++) {
        const squareMoment = today.clone().add(i - currentDay, "days");
        const todos = StoreService.getByDate(squareMoment.toDate());
        (today.clone().add(i - currentDay, "days").toDate());
        const square = {
          ...todos,
          timesAsString: todos.times.map(f => f.split(":").slice(0, 2).join(":")).join(" - "),
          level: this.getLevel(todos),
          color: '',
          date: squareMoment.format("DD/MM/YYYY")
        };
        if (square.level === 1)
          square.color = 'white';//'#e17f50';
        if (square.level === 2)
          square.color = 'white';//'#fff8e7';
        if (square.level === 3)
          square.color = 'white';//'#ffe598';
        this.data.push(square);
      }
    });
  }

  getLevel(todos: TodoCollection) {
    if (todos.achieved3)
      return 3;

    if (todos.achieved2)
      return 2;

    if (todos.achieved1)
      return 1;

    return 0;
  }
}

