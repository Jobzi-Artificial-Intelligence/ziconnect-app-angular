import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { InteractiveOsmMapComponent } from './interactive-osm-map.component';

describe('InteractiveOsmMapComponent', () => {
  let component: InteractiveOsmMapComponent;
  let fixture: ComponentFixture<InteractiveOsmMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveOsmMapComponent],
      imports: [LeafletModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InteractiveOsmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
