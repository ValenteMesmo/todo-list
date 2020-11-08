import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundService } from 'src/app/services/sound-service';
@Component({
    selector: 'achievement-animation',
    templateUrl: './achievement-animation.html',
    styleUrls: ['./achievement-animation.scss']
})
export class AchievementAnimationComponent {

    private _achieved: boolean;
    @Output() pressedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    get achieved(): boolean {
        return this._achieved;
    }

    @Input() set achieved(value: boolean) {
        this._achieved = value;
        if (this._achieved) {
            setTimeout(() => {
                SoundService.play2();
                // this._achieved = false;
            }, 900);
        }
    }
}

