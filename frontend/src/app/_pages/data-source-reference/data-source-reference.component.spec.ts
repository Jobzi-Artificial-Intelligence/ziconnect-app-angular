import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick } from "@angular/core/testing";
import { AngularMaterialModule } from "src/app/material.module";
import { DataSourceReferenceComponent } from "..";

describe('Component: DataSourceReferenceComponent', () => {
  let component: DataSourceReferenceComponent;
  let fixture: ComponentFixture<DataSourceReferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataSourceReferenceComponent],
      imports: [AngularMaterialModule]
    });

    fixture = TestBed.createComponent(DataSourceReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const pageTitle = fixture.nativeElement.querySelector('header.page-title .title');

    expect(pageTitle.textContent).toContain('How We Got Data');
  });

  describe('#ngOnInit', () => {

    it('should exists', () => {
      expect(component.ngOnInit).toBeTruthy();
      expect(component.ngOnInit).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      //@ts-ignore
      component._initInfographicAnimation = jasmine.createSpy();

      component.ngOnInit();

      //@ts-ignore
      expect(component._initInfographicAnimation).toHaveBeenCalled();
    });
  });

  describe('#_initInfographicAnimation', () => {

    it('should exists', () => {
      //@ts-ignore
      expect(component._initInfographicAnimation).toBeTruthy();
      //@ts-ignore
      expect(component._initInfographicAnimation).toEqual(jasmine.any(Function));
    });

    it('should works', fakeAsync(() => {
      //@ts-ignore
      component._initInfographicAnimation();

      expect(component.sourceItems.every((item) => item.opacity === 0)).toEqual(true);
      expect(component.sourceItems.every((item) => item.degrees === 0)).toEqual(true);

      tick(500);
      fixture.detectChanges();

      expect(component.sourceItems.every((item) => item.opacity === 1)).toEqual(true);

      // testing degree calc
      const bubbleCount = component.sourceItems.length;
      //@ts-ignore
      const degreeStep = component._maxDegrees / (bubbleCount - 1);

      component.sourceItems.forEach((sourceItem, index) => {
        expect(sourceItem.degrees).toEqual(degreeStep * index);
      });
      discardPeriodicTasks();
    }));
  });
});