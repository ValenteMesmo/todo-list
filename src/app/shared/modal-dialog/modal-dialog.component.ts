import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  title: string;

  @Input()
  subtitle: string;

  _open: boolean;
  get open(): boolean {
    return this._open;
  }

  @Input() set open(value: boolean) {
    this._open = value;
    this.openChange.emit(this.open);
  }
}
