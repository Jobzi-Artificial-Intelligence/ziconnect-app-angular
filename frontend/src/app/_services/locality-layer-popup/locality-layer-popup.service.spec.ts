import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from 'src/app/material.module';
import { LocalityLayerPopupComponent } from 'src/app/_components';
import { IMapInfoWindowContent } from 'src/app/_interfaces';

import { LocalityLayerPopupService } from './locality-layer-popup.service';

describe('LocalityLayerPopupService', () => {
  let service: LocalityLayerPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LocalityLayerPopupComponent
      ],
      imports: [
        AngularMaterialModule,
        BrowserModule,
        CommonModule
      ]
    });
    service = TestBed.inject(LocalityLayerPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#compilePopup', () => {
    it('should exists', () => {
      expect(service.compilePopup).toBeDefined();
      expect(service.compilePopup).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const content = <IMapInfoWindowContent>{
        code: '01',
        name: 'Content 01',
        type: 'Type 01'
      };

      const result = service.compilePopup(content);

      const localityLayerPopup = result.querySelector('#locality-layer-popup');

      expect(localityLayerPopup).not.toBeNull(null);
    });
  });
});
