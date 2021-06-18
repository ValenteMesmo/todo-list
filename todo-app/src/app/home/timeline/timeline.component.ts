import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { EventService, EventType } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

interface TimelineEvent {
  title: string;
  detail: string;
  time: string;
  date: Date;
  bonus: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.component.scss'],
})
export class TimelineComponent {
  events: TimelineEvent[];

  constructor(
    protected readonly service: EventService
    , public alertController: AlertController) {

    service.processor.onEventsChanged.subscribe(events => {
      this.events = [];

      const dates = service.processor.timer.clicks.sort().reverse();

      dates.forEach((date, index, dates) => {

        //se não for o ultimo click...        
        if (index < dates.length - 1) {

          //se for par, registar intervalo de trabalho
          if ((dates.length % 2 == 0 && index % 2 == 0) || (dates.length % 2 != 0 && index % 2 != 0)) {
            this.events.push({
              title: `tive que relaxar`,
              detail: `total: ${this.service.processor.timer.currentTime} | saldo: ${this.service.processor.timer.goal}`,
              date: date,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              icon: "stop-circle-outline",
              color: "danger",
              bonus: `- ${this.calcularBonus( dates, index-1)}`
            });
          }//se for impar, registrar intervalo de lazer
          else {
            this.events.push({
              title: `trabalhando!`,
              detail: "aaaaaaaa",
              date: date,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              icon: "play-circle-outline",
              color: "success",
              bonus: `+ ${this.calcularBonus(dates, index - 1)}`
            });
          }

        }//se for o ultimo click
        else {
          this.events.push({
            title: "Começamos! vamos que vamos!",
            detail: "bbbbbbbbb",
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: "play-circle-outline",
            color: "success",
            bonus: `+ ${this.calcularBonus(dates, index - 1)}`
          });
        }
      });

      //this.events = this.events.sort().reverse();
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
      || end < 0    )
      return '';

    return this.formatInterval(dates[begin], dates[end]);
  }

  private removeConfirm(item: TimelineEvent) {
    this.service.publish({
      type: EventType.timeclicked,
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
          handler: () => {}
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
