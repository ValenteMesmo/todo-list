import { Injectable } from "@angular/core";
import Timer from "easytimer.js";
import * as moment from "moment";

enum eventType {
    chronometerButtonClicked,
    TaskOrderChanged,
    TaskCreated
}

@Injectable({ providedIn: 'root' })
export class EventService {
    //TODO: separar tarefas em mainquests e sidequests... main feitas em pomodoro, side feitas no break
    times = [];
    running = false;
    timer: Timer;
    currentTime = "00:00:00";

    constructor() {

        this.timer = new Timer();

        this.timer.addEventListener('secondsUpdated', e =>
            this.currentTime = this.timer.getTimeValues().toString()
        );
    }

    publish(type: eventType, date: Date, arg: string) {
        if (type == eventType.chronometerButtonClicked)
            this.handleTimerStarted(date, arg);

    }

    private handleTimerStarted(date: Date, arg: string) {

        if(this.running){
            this.timer.pause();
            this.running = false;
            this.times.push(date.toLocaleTimeString());
            this.currentTime = this.timer.getTimeValues().toString();
            return;
        }

        const now = new Date();
        //now.setMilliseconds(moment().diff(date));
        const milliseconds = moment().diff(date);

        this.timer.start({
            precision: 'seconds'
            , startValues: {
                // seconds: now.getSeconds()
                // , minutes: now.getMinutes()
                // , hours: now.getHours()
                seconds: milliseconds
            }
        });
        this.running = true;

        this.currentTime = this.timer.getTimeValues().toString();
        this.times.push(date.toLocaleTimeString());
    }

}