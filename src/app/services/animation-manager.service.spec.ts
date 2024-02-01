import { TestBed } from '@angular/core/testing';

import { AnimationManagerService } from './animation-manager.service';

describe('AnimationManagerService', () => {
  let service: AnimationManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
