import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularSliderComponent } from './circular-slider.component';

describe('CircularSliderComponent', () => {
  let component: CircularSliderComponent;
  let fixture: ComponentFixture<CircularSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CircularSliderComponent]
    });
    fixture = TestBed.createComponent(CircularSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
