import { Component } from "@angular/core";
import { EventService } from "../../asdasdasasd";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  selector: "app-chronometer",
  templateUrl: 'chronometer.component.html',
  styleUrls: ['chronometer.component.scss']
})
export class ChronometerComponent {

  constructor(protected readonly service: EventService) {

  }

  formatInterval(a: Date, b: Date) {
    const date = new Date(1989, 4, 8, 0, 0, 0, 0);
    date.setMilliseconds(a.getTime() - b.getTime());
    return date.toLocaleTimeString();
  }

  @throttle()
  toggle() {
    this.service.publish({ type: 0, date: new Date() });
  }

  @throttle()
  removeTime(time: Date) {
    this.service.publish({ type: 1, date: new Date(), args: time })
  }
}
