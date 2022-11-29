import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { AngularMaterialModule } from "src/app/material.module";
import { School } from "src/app/_models";
import { DialogSchoolColumnSelectorComponent, IDialogSchoolColumnSelectorData, IDialogSchoolColumnSelectorResult } from "../dialog-school-column-selector/dialog-school-column-selector.component";
import { ISchoolTableParam, SchoolTableBottomSheetComponent } from "./school-table-bottom-sheet.component";

import { schoolFromServer } from "../../../test/school-mock";
import { UtilHelper } from "src/app/_helpers";

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

  describe('#initData', () => {
    it('should exists', () => {
      expect(component.initData).toBeTruthy();
      expect(component.initData).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      spyOn(component, 'loadSchools');
      spyOn(component, 'initMatTable');

      await component.initData();

      expect(component.loadSchools).toHaveBeenCalledWith();
      expect(component.initMatTable).toHaveBeenCalledWith();
    });
  });

  describe('#initMatTable', () => {
    it('should exists', () => {
      expect(component.initMatTable).toBeTruthy();
      expect(component.initMatTable).toEqual(jasmine.any(Function));
    });

    it('should works', async () => {
      component.schools = [new School().deserialize(schoolFromServer)];

      await component.initMatTable();

      expect(component.tableDataSource).toBeDefined();
      expect(component.tableDataSource.paginator).toBeDefined();
      expect(component.tableDataSource.paginator).toEqual(component.paginator);
      expect(component.tableDataSource.sort).toBeDefined();
      expect(component.tableDataSource.sort).toEqual(component.sort);
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
        schools: new Array<School>()
      };

      component.data.schools.push(new School());

      component.loadSchools();

      expect(component.schools).toBeTruthy();
      expect(component.schools.length).toEqual(1);
    });

    it('should works with state code', () => {
      spyOn(component, 'loadSchoolsFromCodes');

      component.data = <ISchoolTableParam>{
        stateCode: '1',
        schools: new Array<School>()
      };

      component.loadSchools();

      expect(component.loadSchoolsFromCodes).toHaveBeenCalledTimes(1);
      expect(component.loadSchoolsFromCodes).toHaveBeenCalledWith();
    });
  });

  describe('#loadSchoolsFromCodes', () => {
    it('should exists', () => {
      expect(component.loadSchoolsFromCodes).toBeTruthy();
      expect(component.loadSchoolsFromCodes).toEqual(jasmine.any(Function));
    });

    it('should works when service throw error', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._schoolService, 'getSchoolsByLocalityMapCodes').and.throwError('Error message');
      await component.loadSchoolsFromCodes().catch((error) => {
        expect(error.toString()).toEqual('Error: Error message');
      });

      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalled();
    });

    it('should works when service return error', async () => {
      //@ts-ignore
      spyOn(component._alertService, 'showError');

      //@ts-ignore
      spyOn(component._schoolService, 'getSchoolsByLocalityMapCodes').and.returnValue(throwError({ message: 'http error' }));
      await component.loadSchoolsFromCodes().catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toEqual('http error');
      });

      //@ts-ignore
      expect(component._alertService.showError).toHaveBeenCalledWith('Something went wrong retrieving schools data: http error');
    });

    it('should works when service return success', async () => {
      const schoolsResponse = [new School().deserialize(schoolFromServer)];

      //@ts-ignore
      spyOn(component._schoolService, 'getSchoolsByLocalityMapCodes').and.returnValue(of(schoolsResponse));
      await component.loadSchoolsFromCodes();

      expect(component.schools.length).toEqual(1);
    });
  });

  describe('#sortingDataAccessor', () => {
    it('should exists', () => {
      expect(component.sortingDataAccessor).toBeTruthy();
      expect(component.sortingDataAccessor).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const obj = {
        property1: {
          nestedProperty1: 'value01'
        }
      };

      const result = component.sortingDataAccessor(obj, 'property1.nestedProperty1');
      expect(result).toEqual(UtilHelper.getPropertyValueByPath(obj, 'property1.nestedProperty1'));
    });
  });
});