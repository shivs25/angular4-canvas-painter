import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPainterComponent } from './canvas-painter.component';

describe('CanvasPainterComponent', () => {
  let component: CanvasPainterComponent;
  let fixture: ComponentFixture<CanvasPainterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasPainterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasPainterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
