import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingSpaceComponent } from './drawing-space.component';

describe('DrawingSpaceComponent', () => {
  let component: DrawingSpaceComponent;
  let fixture: ComponentFixture<DrawingSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingSpaceComponent]
    });
    fixture = TestBed.createComponent(DrawingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
