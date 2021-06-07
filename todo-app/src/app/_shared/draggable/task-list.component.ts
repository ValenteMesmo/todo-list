import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.scss'],
})
export class TaskListComponent {

  items = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  dragItem?: any;










  doReorder(ev: CustomEvent<any>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.items = ev.detail.complete(this.items);
    console.log(this.items);
  }










  dragStart(e: any) {

    let target = e.target;

     if (target.tagName === "ION-CARD-CONTENT")
     target = target.parentElement;

    if (target.tagName !== "ION-CARD" || this.dragItem)
      return;

    console.log(target);

    if (!target.xOffset)
      target.xOffset = 0;

    if (!target.yOffset)
      target.yOffset = 0;

    if (e.type === "touchstart") {
      target.initialX = e.touches[0].clientX - target.xOffset;
      target.initialY = e.touches[0].clientY - target.yOffset;
    } else {
      target.initialX = e.clientX - target.xOffset;
      target.initialY = e.clientY - target.yOffset;
    }

    // if (!this.dragItem) {
      this.dragItem = target;
    // }
  }

  dragEnd(e) {
     this.dragItem.initialX = e.target.currentX;
     this.dragItem.initialY = e.target.currentY;

    this.dragItem = null;
  }

  drag(e) {
    if (this.dragItem) {

      e.preventDefault();

      if (e.type === "touchmove") {
         this.dragItem.currentX = e.touches[0].clientX -  this.dragItem.initialX;
         this.dragItem.currentY = e.touches[0].clientY -  this.dragItem.initialY;
      } else {
         this.dragItem.currentX = e.clientX -  this.dragItem.initialX;
         this.dragItem.currentY = e.clientY -  this.dragItem.initialY;
      }

       this.dragItem.xOffset =  this.dragItem.currentX;
       this.dragItem.yOffset =  this.dragItem.currentY;

      this.setTranslate( this.dragItem.currentX,  this.dragItem.currentY,  this.dragItem);
      // this.setTranslate(e.clientX, e.clientY , e.target);
    }
  }

  setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}