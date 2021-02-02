import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundService } from 'src/app/services/sound-service';

@Component({
  selector: 'stacked-check-button',
  templateUrl: './stacked-check-button.html',
  styleUrls: ['./stacked-check-button.scss']
})
export class StackedCheckButtonComponent {
  @Input() size: number;
  @Input() count: number;
  @Output() countChange: EventEmitter<number> = new EventEmitter<number>();
  Number = Number;

  onClick() {
    if (this.count === this.size)
      this.count = 0;
    else
      this.count++;
    
      SoundService.play();
        
    this.countChange.emit(this.count);
  }
}

