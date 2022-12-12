import { APP_BASE_HREF, PlatformLocation } from "@angular/common";
import { Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from "@angular/router";
import { of, ReplaySubject } from "rxjs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SeoService } from "./_services";

@Component({
  selector: 'app-navigation-bar',
  template: '<p>Mock Navigation Bar Component</p>'
})
class MockNavigationBarComponent { }

describe('Component: AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routeMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  const mockSeoService = jasmine.createSpyObj('SeoService', ['updateTitle', 'updateMetaTags']);

  function createComponent(seoData?: any) {
    let seoDataParam = seoData ?? {
      firstChild: {
        data: of({
          seo: {
            title: 'Jobzi | Code of Conduct',
            metaTags: [
              { name: 'description', content: 'Jobzi | Unicef - Connectivity tools code of conduct.' }
            ]
          }
        })
      }
    };

    TestBed.configureTestingModule({
      declarations: [AppComponent, MockNavigationBarComponent],
      imports: [AppRoutingModule],
      providers: [
        { provide: Router, useValue: routeMock },
        { provide: ActivatedRoute, useValue: seoDataParam },
        { provide: SeoService, useValue: mockSeoService },
        {
          provide: APP_BASE_HREF,
          useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
          deps: [PlatformLocation]
        },
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance; // AppComponent test instance
    fixture.detectChanges();
  }

  it('create an instance', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should be works when activated route first child is defined', () => {
    createComponent();

    eventSubject.next(new NavigationEnd(1, 'initial', 'redirectUrl'));

    expect(mockSeoService.updateTitle).toHaveBeenCalled();
    expect(mockSeoService.updateMetaTags).toHaveBeenCalled();
  });


  it('should be works when activated route first child is undefined', () => {
    createComponent({
      firstChild: null
    });

    eventSubject.next(new NavigationEnd(1, 'current', 'redirectUrl'));

    expect(component).toBeTruthy();
  });
});