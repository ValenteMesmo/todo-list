import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundService } from 'src/app/services/sound-service';

@Component({
    selector: 'check-button',
    templateUrl: './check-button.html',
    styleUrls: ['./check-button.scss']
})
export class CheckButtonComponent {
    @Input() pressed: boolean;
    @Output() pressedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
    onClick() {
        if (!this.pressed)
            SoundService.play();

        this.pressed = !this.pressed;
        this.pressedChange.emit(this.pressed);
    }
}

