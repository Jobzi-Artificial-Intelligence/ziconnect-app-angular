import { APP_BASE_HREF, PlatformLocation } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { AngularMaterialModule } from "src/app/material.module";
import { School } from "src/app/_models";
import { DialogSchoolColumnSelectorComponent, IDialogSchoolColumnSelectorData, IDialogSchoolColumnSelectorResult } from "../dialog-school-column-selector/dialog-school-column-selector.component";
import { ISchoolTableParam, SchoolTableBottomSheetComponent } from "./school-table-bottom-sheet.component";

describe('Component: SchoolTableBottomSheet', () => {
  let component: SchoolTableBottomSheetComponent;
  let fixture: ComponentFixture<SchoolTableBottomSheetComponent>;

  const mockMatBottomSheetRef = {
    dismiss: jasmine.createSpy()
  };

  const mockMatDialogConfirm = {
    open: jasmine.createSpy().and.returnValue({
      afterClosed: () => of(<IDialogSchoolColumnSelectorResult>{
        status: 'CONFIRM',
        selectedColumns: []
      })
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolTableBottomSheetComponent],
      imports: [AngularMaterialModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
        { provide: MatBottomSheetRef, useValue: mockMatBottomSheetRef },
        { provide: MatDialog, useValue: mockMatDialogConfirm },
        { provide: APP_BASE_HREF, useValue: '' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolTableBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('#applyFilter', () => {
    it('should exists', () => {
      expect(component.applyFilter).toBeTruthy();
      expect(component.applyFilter).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const event = { target: { value: 'Filter Value' } } as any;

      component.applyFilter(event);
      expect(component.tableDataSource.filter).toEqual(event.target.value.trim().toLowerCase());
    });
  });

  describe('#onButtonChooseColumnsClick', () => {
    it('should exists', () => {
      expect(component.onButtonChooseColumnsClick).toBeTruthy();
      expect(component.onButtonChooseColumnsClick).toEqual(jasmine.any(Function));
    });

    it('should works when confirm dialog', () => {
      const columnsToDisplay = component.columnsToDisplay;
      component.onButtonChooseColumnsClick();

      expect(component.dialog.open).toHaveBeenCalledWith(DialogSchoolColumnSelectorComponent, {
        disableClose: false,
        width: '600px',
        data: {
          columnsDisplayed: columnsToDisplay
        } as IDialogSchoolColumnSelectorData
      });
    });
  });

  describe('#onButtonCloseClick', () => {
    it('should exists', () => {
      expect(component.onButtonCloseClick).toBeTruthy();
      expect(component.onButtonCloseClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      component.onButtonCloseClick();

      //@ts-ignore
      expect(component._bottomSheetRef.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('#onButtonExportClick', () => {
    it('should exists', () => {
      expect(component.onButtonExportClick).toBeTruthy();
      expect(component.onButtonExportClick).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      //@ts-ignore
      spyOn(component._schoolService, 'exportToCsv');

      component.onButtonExportClick();

      //@ts-ignore
      expect(component._schoolService.exportToCsv).toHaveBeenCalledWith('schools.csv', component.tableDataSource.filteredData);
    });

    it('should works when throw error', () => {
      //@ts-ignore
      spyOn(component._schoolService, 'exportToCsv').and.throwError('Export error');
      //@ts-ignore
      spyOn(component._alertService, 'showError' as never);

      component.onButtonExportClick();

      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Error: Export error');
    });
  });

  describe('#loadSchools', () => {
    it('should exists', () => {
      expect(component.loadSchools).toBeTruthy();
      expect(component.loadSchools).toEqual(jasmine.any(Function));
    });

    it('should works with schools data', () => {
      component.data = <ISchoolTableParam>{
        stateCode: '',
        stateCodes: null,
        schools: new Array<School>()
      };

      component.data.schools.push(new School());

      component.loadSchools();

      expect(component.schools).toBeTruthy();
      expect(component.schools.length).toEqual(1);
    });

    it('should works with state code', () => {
      spyOn(component, 'loadSchoolsFromState');

      component.data = <ISchoolTableParam>{
        stateCode: '1',
        stateCodes: null,
        schools: new Array<School>()
      };

      component.loadSchools();

      expect(component.loadSchoolsFromState).toHaveBeenCalledTimes(1);
      expect(component.loadSchoolsFromState).toHaveBeenCalledWith('1');
    });

    it('should works with state code', async () => {
      spyOn(component, 'loadSchoolsFromState');

      component.data = <ISchoolTableParam>{
        stateCode: null,
        stateCodes: ['1', '2'],
        schools: new Array<School>()
      };

      await component.loadSchools();

      expect(component.loadSchoolsFromState).toHaveBeenCalledTimes(2);
      expect(component.loadSchoolsFromState).toHaveBeenCalledWith('1');
      expect(component.loadSchoolsFromState).toHaveBeenCalledWith('2');
    });
  });
});