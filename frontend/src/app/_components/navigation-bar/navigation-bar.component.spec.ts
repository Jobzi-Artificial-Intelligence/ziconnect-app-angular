import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { By, DomSanitizer } from "@angular/platform-browser";
import { AngularMaterialModule } from "src/app/material.module";
import { NavigationBarComponent } from "./navigation-bar.component";

describe('Component: NavigationBar', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationBarComponent],
      imports: [AngularMaterialModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(inject([MatIconRegistry, DomSanitizer], (matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) => {
    // The `MatIconRegistry` will make GET requests to fetch any SVG icons that are in the registry. More on this below...
    const codeForkUrl = sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/github.svg');
    matIconRegistry.addSvgIcon("github", codeForkUrl);

    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.selectedMenuItem).toEqual('');
    expect(component.submenuOpened).toBeFalse();
  });

  it('should display menu items', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.inner-container .menu .menu-item'));
    expect(menuItems.length).toEqual(6);

    //single menu items
    const singleMenuItems = fixture.debugElement.queryAll(By.css('.inner-container .menu .menu-item>a'));
    expect(singleMenuItems.length).toEqual(4);

    const singleMenuText = singleMenuItems.map((x) => x.nativeElement.textContent) as Array<string>;
    expect(singleMenuText.includes('Data Sources')).toBeTrue();
    expect(singleMenuText.includes('Contact')).toBeTrue();

    //single menu with sub items
    const menuWithSubMenu = fixture.debugElement.queryAll(By.css('.inner-container .menu .menu-item>span'));
    expect(menuWithSubMenu.length).toEqual(2);

    const menuWithSubMenuText = menuWithSubMenu.map((x) => x.nativeElement.textContent) as Array<string>;
    expect(menuWithSubMenuText.includes('Tools')).toBeTrue();
    expect(menuWithSubMenuText.includes('Community')).toBeTrue();
  });

  describe('#toggleSubmenuContainer', () => {
    it('should exists', () => {
      expect(component.toggleSubmenuContainer).toBeTruthy();
      expect(component.toggleSubmenuContainer).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      // First toggle
      component.toggleSubmenuContainer('community', null);
      expect(component.selectedMenuItem).toEqual('community');
      expect(component.submenuOpened).toBeTrue();

      // Toggle same menu item
      component.toggleSubmenuContainer('community', null);
      expect(component.selectedMenuItem).toEqual('community');
      expect(component.submenuOpened).toBeFalse();

      // Toggle other menu item
      component.toggleSubmenuContainer('tools', null);
      expect(component.selectedMenuItem).toEqual('tools');
      expect(component.submenuOpened).toBeTrue();

      // Force close submenu
      component.toggleSubmenuContainer(null, false);
      expect(component.selectedMenuItem).toEqual('');
      expect(component.submenuOpened).toBeFalse();

      // Toggle without params
      component.submenuOpened = false;
      component.toggleSubmenuContainer(null, null);
      expect(component.selectedMenuItem).toEqual('');
      expect(component.submenuOpened).toEqual(true);
    });
  });
})