import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolTableBottomSheetComponent } from './school-table-bottom-sheet.component';

describe('SchoolTableBottomSheetComponent', () => {
  let component: SchoolTableBottomSheetComponent;
  let fixture: ComponentFixture<SchoolTableBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolTableBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolTableBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
