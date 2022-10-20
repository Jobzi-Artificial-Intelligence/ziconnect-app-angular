import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSchoolColumnSelectorComponent } from './dialog-school-column-selector.component';

describe('DialogSchoolColumnSelectorComponent', () => {
  let component: DialogSchoolColumnSelectorComponent;
  let fixture: ComponentFixture<DialogSchoolColumnSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSchoolColumnSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSchoolColumnSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
