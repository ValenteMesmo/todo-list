import { Component } from "@angular/core";
import { Timer } from "easytimer.js";
import { throttle } from "../decorators/throttle.decorator";
import { EventService } from "../../asdasdasasd";

@Component({
    selector: "app-chronometer",
    templateUrl: 'chronometer.component.html',
    styleUrls: ['chronometer.component.scss']
})
export class ChronometerComponent {

    // times = [];
    // currentTime = "00:00:00";
    // countdown = 10;
    // timer: Timer;
    // running: boolean;

    constructor(protected readonly service: EventService) {

        const a = new Date();
        const b = new Date();

        a.setMilliseconds(-1000 * 60 * 2);
        b.setMilliseconds(-1000 * 60);
        this.service.publish(0, a, '');
        this.service.publish(0, b, '');
        this.service.publish(0, new Date(), '');


        // this.timer = new Timer();

        // this.timer.addEventListener('secondsUpdated', e =>
        //     this.currentTime = this.timer.getTimeValues().toString()
        // );
    }

    @throttle()
    toggle() {

        this.service.publish(0, new Date(), '');
        // if (this.running) {
        //     this.timer.pause();
        //     this.running = false;
        // }
        // else {
        //     this.timer.start({
        //         precision: 'seconds'
        //         // , startValues: {
        //             //     seconds: now.getSeconds()
        //             //     , minutes: now.getMinutes()
        //             //     , hours: now.getHours()
        //             // }
        //         });
        //         this.running = true;
        //     }
        //     const now = new Date();
        //     this.times.push(now.toLocaleTimeString());
    }
}