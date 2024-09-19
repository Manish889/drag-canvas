import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-dragable-element',
  standalone: true,
  imports: [],
  templateUrl: './dragable-element.component.html',
  styleUrl: './dragable-element.component.scss'
})
export class DragableElementComponent {
  @ViewChild("draggable") draggable!:ElementRef;
  @Input() text: string = '';
  @Output() dragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Input() x: number = 0;
  @Input() y: number = 0;
  width: number = 0;
  height: number = 0;
  isDragging: boolean = false;
  offsetX: number = 0;
  offsetY: number = 0;
  elRef = inject(ElementRef);

  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
    document.addEventListener('mousemove', this.drag.bind(this));
  }

  drag(event: MouseEvent) {
    if (this.isDragging) {
      this.x = event.clientX - this.offsetX;
      this.y = event.clientY - this.offsetY;
    }
  }

  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.drag.bind(this));
      this.width = this.draggable.nativeElement.offsetWidth;
      this.height = this.draggable.nativeElement.offsetHeight;
      this.dragEnd.emit({ x: this.x, y: this.y, width:  this.width, height: this.height});
    }
  }
}
