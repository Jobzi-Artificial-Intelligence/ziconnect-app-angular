import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularMaterialModule } from 'src/app/material.module';

import { InteractiveOsmMapComponent } from './interactive-osm-map.component';

describe('InteractiveOsmMapComponent', () => {
  let component: InteractiveOsmMapComponent;
  let fixture: ComponentFixture<InteractiveOsmMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveOsmMapComponent],
      imports: [
        AngularMaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        LeafletModule,
        NgxChartsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveOsmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
