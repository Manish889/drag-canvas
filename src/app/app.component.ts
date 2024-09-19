import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragableElementComponent } from './dragable-element/dragable-element.component';
import { NestedComponent } from './nested/nested.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NestedComponent, NgFor, DragableElementComponent, DragDropModule, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit{
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
  @ViewChild('canvas') canvas!: ElementRef;

  canvasWidth: number = 800;
  canvasHeight: number = 600;
  cellSize: number = 10;
  canvasMatrix!: boolean[][];

  elements = [
    { id: 1, name: 'Element 1', x: 0, y: 0, width: 20, height: 10 }, // Width and height in cell units
    { id: 2, name: 'Element 2', x: 30, y: 0, width: 10, height: 20 },
    // { id: 3, name: 'Element 3', x: 0, y: 20, width: 20, height: 10 }
  ];

  constructor() {
    this.updateCanvasMatrix();
  }

  updateCanvasMatrix() {
    const numCols = Math.floor(this.canvasWidth / this.cellSize);
    const numRows = Math.floor(this.canvasHeight / this.cellSize);

    this.canvasMatrix = Array(numRows).fill(null).map(() => Array(numCols).fill(false));

    this.elements.forEach(element => {
      for (let i = element.y; i < element.y + element.height; i++) {
        for (let j = element.x; j < element.x + element.width; j++) {
          this.canvasMatrix[i][j] = true;
        }
      }
    });
  }

  addElement() {
    const newElement = {
      id: this.elements.length + 1,
      name: 'New Element',
      width: 10, // Width and height in cell units
      height: 10,
      x: 0,
      y: 0
    };

    let added = false;
    for (let i = 0; i < this.canvasMatrix.length; i++) {
      for (let j = 0; j < this.canvasMatrix[0].length; j++) {
        if (!this.isOverlap(newElement, i, j)) {
          newElement.x = j;
          newElement.y = i;
          added = true;
          break;
        }
      }
      if (added) break;
    }

    if (added) {
      for (let i = newElement.y; i < newElement.y + newElement.height; i++) {
        for (let j = newElement.x; j < newElement.x + newElement.width; j++) {
          this.canvasMatrix[i][j] = true;
        }
      }
      this.elements.push(newElement);
      this.updateCanvasMatrix();
    } else {
      console.log("No available space to add the new element.");
    }
  }

  isOverlap(element: any, row: number, col: number): boolean {
    for (let i = row; i < row + element.height; i++) {
      for (let j = col; j < col + element.width; j++) {
        if (this.canvasMatrix[i] && this.canvasMatrix[i][j]) {
          return true;
        }
      }
    }
    return false;
  }

  alignElement(element: any) {
    let nearestElement: any = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    this.elements.forEach(otherElement => {
      if (otherElement.id !== element.id) {
        const distance = this.calculateDistance(element, otherElement);
        if (distance < minDistance) {
          minDistance = distance;
          nearestElement = otherElement;
        }
      }
    });

    if (nearestElement) {
      let alignX = nearestElement.x + nearestElement.width;
      let alignY = nearestElement.y;

      // Check if aligning horizontally from above is possible
      let alignHorizontally = true;
      for (let i = nearestElement.y - 1; i >= Math.max(0, nearestElement.y - element.height + 1); i--) {
        let spaceAvailable = true;
        for (let j = alignX; j < alignX + element.width; j++) {
          if (this.canvasMatrix[i] && this.canvasMatrix[i][j]) {
            spaceAvailable = false;
            break;
          }
        }
        if (spaceAvailable) {
          alignY = i;
          alignHorizontally = true;
          break;
        }
      }

      if (!alignHorizontally) {
        // Fall back to aligning vertically
        for (let i = alignY; i < alignY + element.height; i++) {
          let spaceAvailable = true;
          for (let j = alignX; j < alignX + element.width; j++) {
            if (this.canvasMatrix[i] && this.canvasMatrix[i][j]) {
              spaceAvailable = false;
              break;
            }
          }
          if (spaceAvailable) {
            alignHorizontally = false;
            break;
          }
        }
      }

      // If alignHorizontally is still true, align horizontally from above
      if (alignHorizontally) {
        element.x = alignX;
        element.y = alignY;
      } else {
        // Otherwise, align vertically
        for (let i = alignY; i < alignY + element.height; i++) {
          let spaceAvailable = true;
          for (let j = alignX; j < alignX + element.width; j++) {
            if (this.canvasMatrix[i] && this.canvasMatrix[i][j]) {
              spaceAvailable = false;
              break;
            }
          }
          if (spaceAvailable) {
            element.x = alignX;
            element.y = i;
            break;
          }
        }
      }

      this.updateCanvasMatrix();
    }
  }



  calculateDistance(element1: any, element2: any): number {
    const center1X = element1.x + (element1.width / 2);
    const center1Y = element1.y + (element1.height / 2);
    const center2X = element2.x + (element2.width / 2);
    const center2Y = element2.y + (element2.height / 2);
    return Math.sqrt(Math.pow(center2X - center1X, 2) + Math.pow(center2Y - center1Y, 2));
  }

  onDragEnd(event: CdkDragEnd, element: any) {
    const gridX = Math.round(event.source.getFreeDragPosition().x / this.cellSize);
    const gridY = Math.round(event.source.getFreeDragPosition().y / this.cellSize);

    element.x = gridX;
    element.y = gridY;

    this.updateCanvasMatrix();
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  getCanvasStyles() {
    return {
      'background-image': `linear-gradient(90deg, transparent 0px, transparent calc(${this.cellSize}px - 1px), #ccc calc(${this.cellSize}px - 1px), #ccc ${this.cellSize}px),
                          linear-gradient(transparent 0px, transparent calc(${this.cellSize}px - 1px), #ccc calc(${this.cellSize}px - 1px), #ccc ${this.cellSize}px)`,
      'background-size': `${this.cellSize}px ${this.cellSize}px`
    };
  }
  getCellStyle(row: number, col: number) {
    return {
      'background-color': this.canvasMatrix[row][col] ? 'rgba(0, 0, 255, 0.2)' : 'transparent'
    };
  }
}
