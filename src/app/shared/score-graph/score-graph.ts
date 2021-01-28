import { Component } from '@angular/core';
import { StoreService, TodoCollection } from '../../services/StoreService';
import * as moment from 'moment';
import { throttle } from '../throttle.decorator';

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

        const square = {
          ...todos,
          //TODO: parei aqui! calculando total
          timesAsString: `${todos.times.map(f => f.split(":").slice(0, 2).join(":")).join(" - ")}`,
          times: todos.times,
          level: this.getLevel(todos, squareMoment.day() === 6 || squareMoment.day() === 0),
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

  getLevel(todos: TodoCollection, isWeekend: boolean) {
    if (todos.achieved3)
      return 3;

    if (todos.achieved2)
      return 2;

    if (todos.achieved1)
      return 1;

    return isWeekend ? -1 : 0;
  }

  @throttle()
  copyTime(time: string) {
    const formattedTime = time.split(":").slice(0, 2).join(":");
    if (formattedTime.length === 4)
      this.copy("0" + formattedTime);
    else
      this.copy(formattedTime);
  }
  
  copy(text) {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    const result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }
}

