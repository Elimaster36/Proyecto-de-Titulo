import { TestBed } from '@angular/core/testing';

import { ButtonsconfigService } from './buttonsconfig.service';

describe('ButtonsconfigService', () => {
  let service: ButtonsconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonsconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
