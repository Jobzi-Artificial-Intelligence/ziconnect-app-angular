import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceReferenceComponent } from './data-source-reference.component';

describe('DataSourceReferenceComponent', () => {
  let component: DataSourceReferenceComponent;
  let fixture: ComponentFixture<DataSourceReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSourceReferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
