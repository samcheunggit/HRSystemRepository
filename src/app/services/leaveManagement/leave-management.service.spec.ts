import { TestBed, inject } from '@angular/core/testing';

import { LeaveManagementService } from './leave-management.service';

describe('LeaveManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveManagementService]
    });
  });

  it('should be created', inject([LeaveManagementService], (service: LeaveManagementService) => {
    expect(service).toBeTruthy();
  }));
});
