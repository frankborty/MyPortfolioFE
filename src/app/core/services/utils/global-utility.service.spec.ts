import { TestBed } from '@angular/core/testing';

import { GlobalUtilityService } from './global-utility.service';

describe('GlobalUtilityService', () => {
  let service: GlobalUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
