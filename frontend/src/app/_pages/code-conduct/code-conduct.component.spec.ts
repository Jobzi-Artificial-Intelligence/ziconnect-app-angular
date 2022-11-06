import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeConductComponent } from './code-conduct.component';

describe('CodeConductComponent', () => {
  let component: CodeConductComponent;
  let fixture: ComponentFixture<CodeConductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeConductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeConductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
