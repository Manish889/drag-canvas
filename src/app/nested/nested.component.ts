import { NgFor } from '@angular/common';
import { Component, ComponentFactoryResolver, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-nested',
  standalone: true,
  imports: [NgFor],
  templateUrl: './nested.component.html',
  styleUrl: './nested.component.scss'
})
export class NestedComponent {
  @Input() data: any;
  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  ngOnInit() {
  }

  handleClick(text: string) {
    console.log(text);

    // You can emit the event when needed, for example, when the component is clicked
    this.customEvent.emit(text);
  }

  handleCustomEvent(event: any) {
    // You can handle the event here if needed
    // console.log('Custom event received in top-level component:', event);
  }



}
