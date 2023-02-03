import { TestBed } from '@angular/core/testing';

import { LocalityLayerPopupService } from './locality-layer-popup.service';

describe('LocalityLayerPopupService', () => {
  let service: LocalityLayerPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalityLayerPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
