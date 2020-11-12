import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundService } from 'src/app/services/sound-service';
import { AchievementState } from '../../services/StoreService';
@Component({
  selector: 'achievement-animation',
  templateUrl: './achievement-animation.html',
  styleUrls: ['./achievement-animation.scss']
})
export class AchievementAnimationComponent {
  AchievementState = AchievementState;
  private _achieved: AchievementState;
  @Output() achievedChange: EventEmitter<AchievementState> = new EventEmitter<AchievementState>();

  get achieved(): AchievementState {
    return this._achieved;
  }

  @Input() set achieved(value: AchievementState) {
    this._achieved = value;
    if (this._achieved) {
      setTimeout(() => {
        SoundService.play2();
        setTimeout(() => {
          this._achieved = AchievementState.unlocked;
          this.achievedChange.emit(this._achieved);
        }, 9000);        
      }, 900);
    }
  }
}

