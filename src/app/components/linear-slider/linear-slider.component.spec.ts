import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearSliderComponent } from './linear-slider.component';

describe('LinearSliderComponent', () => {
  let component: LinearSliderComponent;
  let fixture: ComponentFixture<LinearSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinearSliderComponent]
    });
    fixture = TestBed.createComponent(LinearSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
