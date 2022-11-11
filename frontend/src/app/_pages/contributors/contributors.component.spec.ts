import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsComponent } from './contributors.component';

describe('ContributorsComponent', () => {
  let component: ContributorsComponent;
  let fixture: ComponentFixture<ContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContributorsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('header.page-title .hero-container .description .title');
    const pageTitleHeader = fixture.nativeElement.querySelector('header.page-title .hero-container .description .title-header');

    expect(pageTitle.textContent).toContain('Contributors');
    expect(pageTitleHeader.textContent).toContain('Community');
  });
});
