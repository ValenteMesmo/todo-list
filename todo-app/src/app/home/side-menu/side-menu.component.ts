import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Event } from "@angular/router";
import { throttle } from "../../_shared/decorators/throttle.decorator";

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrls: ['side-menu.component.scss']
})
export class SideMenuComponent {

  _open: boolean;
  get open(): boolean {
    return this._open;
  }

  @Input() set open(value: boolean) {
    this.updateValue(value);
  }

  @Output()
  openChange = new EventEmitter<boolean>();

  @throttle()
  updateValue(value) {
    this._open = value;
    this.openChange.emit(value);
  }

  clickout() {
    if (this.open)
      this.open = false;
  }
}
