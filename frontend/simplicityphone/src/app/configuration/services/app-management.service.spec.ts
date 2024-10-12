import { TestBed } from '@angular/core/testing';

import { AppManagementService } from './app-management.service';

describe('AppListService', () => {
  let service: AppManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
