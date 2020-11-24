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

  constructor() {

    const today = moment(new Date());
    const currentDay = 365 - 7 + today.isoWeekday();

    for (let i = 1; i <= currentDay; i++) {
      const todos = StoreService.load(today.clone().add(i - currentDay, "days").toDate());
        (today.clone().add(i - currentDay, "days").toDate());
        const square = {
          //level: this.getFakeLevel(i),
          level: this.getLevel(todos),
          color: ''
        };
        if (square.level === 1)
          square.color = 'white';//'#e17f50';
        if (square.level === 2)
          square.color = 'white';//'#fff8e7';
        if (square.level === 3)
          square.color = 'white';//'#ffe598';
       this.data.push(square);
    }
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

  getFakeLevel(i) {
    if (i > 90)
      return Math.round(Math.random() * 3);

    return 0;
  }
}

