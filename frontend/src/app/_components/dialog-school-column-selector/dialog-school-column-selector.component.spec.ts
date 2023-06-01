import { APP_BASE_HREF, PlatformLocation } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "src/app/material.module";
import { DialogSchoolColumnSelectorComponent, IColumnCheckItem, IDialogSchoolColumnSelectorData, IDialogSchoolColumnSelectorResult } from "./dialog-school-column-selector.component";

describe('Component: DialogSchoolColumnSelector', () => {
  let component: DialogSchoolColumnSelectorComponent;
  let fixture: ComponentFixture<DialogSchoolColumnSelectorComponent>;

  const mockDialogData = {
    columnsDisplayed: []
  } as IDialogSchoolColumnSelectorData;

  const mockDialogRef = {
    close: jasmine.createSpy()
  };

  let groupColumn = {} as IColumnCheckItem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSchoolColumnSelectorComponent],
      imports: [AngularMaterialModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: APP_BASE_HREF,
          useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
          deps: [PlatformLocation]
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogSchoolColumnSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('#onButtonCancelClick', () => {

    it('should exists', () => {
      expect(component.onButtonCancelClick).toBeTruthy();
      expect(component.onButtonCancelClick).toEqual(jasmine.any(Function));
    })

    it('should works', () => {
      component.onButtonCancelClick();

      expect(component.dialogRef.close).toHaveBeenCalledWith(<IDialogSchoolColumnSelectorResult>{
        status: 'DISMISS'
      });
    })
  });

  describe('#onButtonConfirmClick', () => {

    it('should exists', () => {
      expect(component.onButtonConfirmClick).toBeTruthy();
      expect(component.onButtonConfirmClick).toEqual(jasmine.any(Function));
    })

    it('should works with empty columns selected', () => {
      component.onButtonConfirmClick();

      expect(component.dialogRef.close).toHaveBeenCalledWith(<IDialogSchoolColumnSelectorResult>{
        status: 'CONFIRM',
        selectedColumns: []
      });
    });

    it('should works with columns selected', () => {
      let selectedColumns = new Array<string>();
      if (component.columnCheckItemList[0].items) {
        component.columnCheckItemList[0].items[0].completed = true;
        selectedColumns.push(component.columnCheckItemList[0].items[0].columnDef);
      }

      component.onButtonConfirmClick();

      expect(component.dialogRef.close).toHaveBeenCalledWith(<IDialogSchoolColumnSelectorResult>{
        status: 'CONFIRM',
        selectedColumns: selectedColumns
      });
    })
  });

  describe('#onColumnCheckedChange', () => {

    it('should exists', () => {
      expect(component.onColumnCheckedChange).toBeTruthy();
      expect(component.onColumnCheckedChange).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(component, '_updateAllComplete' as never);
      component.initColumnCheckItemList();

      if (component.columnCheckItemList[0].items) {
        component.onColumnCheckedChange(true, component.columnCheckItemList[0].items[0], component.columnCheckItemList[0]);

        expect(component.columnCheckItemList[0].items[0].completed).toEqual(true);
        expect(component.columnCheckItemList[0].completed).toEqual(component.columnCheckItemList[0].items.length > 1 ? false : true);
        //@ts-ignore
        expect(component._updateAllComplete).toHaveBeenCalledWith(component.columnCheckItemList[0]);
      }
    });
  });

  describe('#setAll', () => {

    beforeEach(() => {
      groupColumn = <IColumnCheckItem>{
        name: 'Group Name',
        description: 'Group description',
        completed: false,
        incomplete: false,
        items: new Array<IColumnCheckItem>(),
        columnDef: 'Group Def'
      };

      groupColumn.items?.push(<IColumnCheckItem>{
        name: 'Item Name I',
        description: 'Item description',
        completed: false,
        incomplete: false,
        columnDef: 'Group Def'
      })
      groupColumn.items?.push(<IColumnCheckItem>{
        name: 'Item Name II',
        description: 'Item II description',
        completed: false,
        incomplete: false,
        columnDef: 'Group Def II'
      })
    });

    it('should exists', () => {
      expect(component.setAll).toBeTruthy();
      expect(component.setAll).toEqual(jasmine.any(Function));
    });

    it('should works for true', () => {
      component.setAll(true, groupColumn);

      expect(groupColumn.completed).toBeTrue();
      expect(groupColumn.incomplete).toBeFalse();
      expect(groupColumn.items?.every(item => item.completed)).toBeTrue();
    });

    it('should works for false', () => {
      component.setAll(false, groupColumn);

      expect(groupColumn.completed).toBeFalse();
      expect(groupColumn.incomplete).toBeFalse();
      expect(groupColumn.items?.every(item => !item.completed)).toBeTrue();
    });

    it('should works without items', () => {
      const groupColumnWithoutItems = <IColumnCheckItem>{
        name: 'Without items name',
        description: 'Without items description',
        completed: false,
        incomplete: false,
        columnDef: 'Without items Def'
      }
      component.setAll(true, groupColumnWithoutItems);

      expect(groupColumnWithoutItems.completed).toBeTrue();
      expect(groupColumnWithoutItems.incomplete).toBeFalse();
    });
  });

  describe('#_updateAllComplete', () => {

    it('should exists', () => {
      //@ts-ignore
      expect(component._updateAllComplete).toBeTruthy();
      //@ts-ignore
      expect(component._updateAllComplete).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      groupColumn = <IColumnCheckItem>{
        name: 'Group Name',
        description: 'Group description',
        completed: false,
        incomplete: false,
        items: new Array<IColumnCheckItem>(),
        columnDef: 'Group Def'
      };

      groupColumn.items?.push(<IColumnCheckItem>{
        name: 'Item Name I',
        description: 'Item description',
        completed: false,
        incomplete: false,
        columnDef: 'Group Def'
      })
      groupColumn.items?.push(<IColumnCheckItem>{
        name: 'Item Name II',
        description: 'Item II description',
        completed: false,
        incomplete: false,
        columnDef: 'Group Def II'
      });

      // All items unchecked
      //@ts-ignore
      component._updateAllComplete(groupColumn);
      expect(groupColumn.completed).toBeFalse();
      expect(groupColumn.incomplete).toBeFalse();

      // One item checked
      if (groupColumn.items) {
        groupColumn.items[0].completed = true;

        //@ts-ignore
        component._updateAllComplete(groupColumn);
        expect(groupColumn.completed).toBeFalse();
        expect(groupColumn.incomplete).toBeTrue();
      }

      //All items checked
      if (groupColumn.items) {
        groupColumn.items.forEach(item => item.completed = true);

        //@ts-ignore
        component._updateAllComplete(groupColumn);
        expect(groupColumn.completed).toBeTrue();
        expect(groupColumn.incomplete).toBeFalse();
      }
    })
  });
});