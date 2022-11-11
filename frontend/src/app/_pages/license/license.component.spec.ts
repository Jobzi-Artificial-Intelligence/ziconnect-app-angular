import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComponent } from './license.component';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicenseComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('header.page-title .hero-container .description .title');
    const pageTitleHeader = fixture.nativeElement.querySelector('header.page-title .hero-container .description .title-header');

    expect(pageTitle.textContent).toContain('License');
    expect(pageTitleHeader.textContent).toContain('Community');
  });
});
