import { TestBed, inject } from '@angular/core/testing';

import { AgeService } from './age.service';

describe('AgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgeService]
    });
  });

  it('should be created', inject([AgeService], (service: AgeService) => {
    expect(service).toBeTruthy();
  }));
});
