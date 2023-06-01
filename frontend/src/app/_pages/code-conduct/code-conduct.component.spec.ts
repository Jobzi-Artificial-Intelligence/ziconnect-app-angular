import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CodeConductComponent } from "..";

describe('Component: CodeConductComponent', () => {
  let component: CodeConductComponent;
  let fixture: ComponentFixture<CodeConductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeConductComponent],
    });

    fixture = TestBed.createComponent(CodeConductComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('header.page-title .title');

    expect(pageTitle.textContent).toContain('Code of Conduct');
  });
});