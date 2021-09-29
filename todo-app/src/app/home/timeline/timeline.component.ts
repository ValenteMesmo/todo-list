import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { throttle } from "../../_shared/decorators/throttle.decorator";
import { EventType } from "../../_shared/services/event-processor";
import { EventService } from "../../_shared/services/event-service";

interface TimelineEvent {
  title: string;
  detail: string;
  time: string;
  type: EventType;
  date: Date;
  bonus: string;
  icon: string;
  color: string;
  firstAndStopped?: boolean;
  firstAndRunning?: boolean;
}

@Component({
  selector: 'app-timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.component.scss'],
})
export class TimelineComponent {
  events: TimelineEvent[];

  constructor(
    public readonly service: EventService
    , public alertController: AlertController) {

    service.processor.onEventsChanged.subscribe(() => {
      console.log('eventos mudaram');
      //console.log(events);
      this.events = [];

      const dates = service.processor.times.sort().reverse();
      //service.processor.timer.clicks.sort().reverse();
      //console.log(service.processor.times);
      dates.forEach((date, index, dates) => {

        //se não for o ultimo click...        
        if (index < dates.length - 1) {

          //se for par, registar intervalo de trabalho
          if ((dates.length % 2 == 0 && index % 2 == 0) || (dates.length % 2 != 0 && index % 2 != 0)) {
            this.events.push({
              title: `tive que relaxar`,
              detail: `total: ${this.service.timer.currentTime} | saldo: ${this.service.timer.goal}`,
              date: date,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              icon: "pause-outline",
              color: "danger",
              type: EventType.chronometerButtonClick,
              bonus: `- ${this.calcularBonus(dates, index - 1)}`,
              firstAndStopped: index == 0
            });
          }//se for impar, registrar intervalo de lazer
          else {
            this.events.push({
              title: `trabalhando!`,
              detail: "aaaaaaaa",
              date: date,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              icon: "play-outline",
              color: "success",
              type: EventType.chronometerButtonClick,
              bonus: `+ ${this.calcularBonus(dates, index - 1)}`,
              firstAndRunning: index == 0
            });
          }

        }//se for o ultimo click
        else {
          this.events.push({
            title: "Começamos! vamos que vamos!",
            detail: "bbbbbbbbb",
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: "play-outline",
            color: "success",
            type: EventType.chronometerButtonClick,
            bonus: `+ ${this.calcularBonus(dates, index - 1)}`,
            firstAndRunning: index == 0
          });
        }
      });

      this.service.processor.completedTasks.forEach(task =>

        this.events.push({
          title: `${task.name}`,
          time: task.completed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bonus: '',
          color: 'primary',
          date: task.completed,
          detail: '',
          type: EventType.TaskCompleted,
          icon: 'checkbox-outline'
        })
      );

      this.events = this.events.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();
    });
  }

  private calcularBonus(dates: Date[], index: number) {

    const begin = index
      +
      0;
    const end = index
      +
      1;

    if (begin >= dates.length
      || end >= dates.length
      || begin < 0
      || end < 0)
      return '';

    return this.formatInterval(dates[begin], dates[end]);
  }

  private removeConfirm(item: TimelineEvent) {

    let type: EventType = null;
    if (item.type == EventType.chronometerButtonClick)
      type = EventType.undoChronometerButtonClick;
    else if (item.type == EventType.TaskCompleted)
      type = EventType.undoTaskCompletion;

    if (type != null)
      this.service.publish({
        type: type,
        date: new Date(),
        args: item.date
      });
  }

  @throttle()
  async remove(item: TimelineEvent) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Cuidado!',
      message: 'Vai <strong>excluir</strong> mesmo esse registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Excluir',
          cssClass: 'color-danger',
          handler: () => this.removeConfirm(item)
        }
      ]
    });

    await alert.present();
  }

  formatInterval(a: Date, b: Date) {
    const date = new Date(1989, 4, 8, 0, 0, 0, 0);
    date.setMilliseconds(a.getTime() - b.getTime());
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
