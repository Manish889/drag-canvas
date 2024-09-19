import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragableElementComponent } from './dragable-element.component';

describe('DragableElementComponent', () => {
  let component: DragableElementComponent;
  let fixture: ComponentFixture<DragableElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragableElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
