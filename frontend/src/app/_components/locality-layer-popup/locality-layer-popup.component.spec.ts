import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalityLayerPopupComponent } from './locality-layer-popup.component';

describe('LocalityLayerPopupComponent', () => {
  let component: LocalityLayerPopupComponent;
  let fixture: ComponentFixture<LocalityLayerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalityLayerPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalityLayerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
