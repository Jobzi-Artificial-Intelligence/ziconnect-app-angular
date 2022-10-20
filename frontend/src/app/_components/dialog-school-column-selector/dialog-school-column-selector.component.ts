import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchoolService } from 'src/app/_services';

interface IColumnCheckItem {
  name: string;
  description: string;
  completed: boolean;
  incomplete: boolean;
  items?: IColumnCheckItem[];
  columnDef: string;
}

export interface IDialogSchoolColumnSelectorData {
  columnsDisplayed: string[]
}

export interface IDialogSchoolColumnSelectorResult {
  status: "CONFIRM" | "DISMISS",
  selectedColumns: string[]
}

@Component({
  selector: 'app-dialog-school-column-selector',
  templateUrl: './dialog-school-column-selector.component.html',
  styleUrls: ['./dialog-school-column-selector.component.scss']
})
export class DialogSchoolColumnSelectorComponent implements OnInit {
  public columnCheckItemList: IColumnCheckItem[];

  private _schoolService: SchoolService;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogSchoolColumnSelectorData, @Inject(APP_BASE_HREF) public baseHref: string,
    public dialogRef: MatDialogRef<DialogSchoolColumnSelectorComponent>, private _httpClient: HttpClient) {

    this._schoolService = new SchoolService(this._httpClient, this.baseHref);
    this.columnCheckItemList = new Array<IColumnCheckItem>();
  }

  ngOnInit(): void {
    this.initColumnCheckItemList();
  }

  initColumnCheckItemList() {
    this._schoolService.schoolColumnGroups.forEach(columnGroup => {
      let columnCheckItem = {
        columnDef: columnGroup.id,
        name: columnGroup.name,
        description: columnGroup.description,
        completed: false,
        incomplete: false,
        items: columnGroup.columns.map(column => {
          return {
            columnDef: column.columnDef,
            name: column.header,
            description: column.description,
            completed: this.data.columnsDisplayed.includes(column.columnDef),
            incomplete: false,
            items: []
          } as IColumnCheckItem
        })
      } as IColumnCheckItem;

      this._updateAllComplete(columnCheckItem);

      this.columnCheckItemList.push(columnCheckItem);
    });
  }

  onButtonCancelClick() {
    this.dialogRef.close(<IDialogSchoolColumnSelectorResult>{
      status: 'DISMISS'
    });
  }

  onButtonConfirmClick() {
    let selectedColumns = new Array<string>();

    this.columnCheckItemList.forEach(x => {
      if (x.items && x.items.length > 0) {
        const groupSelectedColumns = x.items?.filter(y => y.completed)
        if (groupSelectedColumns.length > 0) {
          selectedColumns = selectedColumns.concat(groupSelectedColumns.map(x => x.columnDef));
        }
      }
    });

    this.dialogRef.close(<IDialogSchoolColumnSelectorResult>{
      status: 'CONFIRM',
      selectedColumns: selectedColumns
    })
  }

  /**
   * Update completed of column checked/unchecke and the completed and incomplete fields of the column wrapper related
   * @param completed boolean 
   * @param columnCheckItem IColumnCheckItem column item checked/unchecked
   * @param groupColumnCheckItem IColumnCheckItem group item from column checked/unchecked
   */
  onColumnCheckedChange(completed: boolean, columnCheckItem: IColumnCheckItem, groupColumnCheckItem: IColumnCheckItem) {
    columnCheckItem.completed = completed;

    this._updateAllComplete(groupColumnCheckItem);
  }

  /**
   * Check or uncheck all columns of the clicked group item
   * @param completed boolean 
   * @param columnCheckItem IColumnCheckItem group item checked/unchecked
   * @returns 
   */
  setAll(completed: boolean, columnCheckItem: IColumnCheckItem) {
    columnCheckItem.completed = completed;
    columnCheckItem.incomplete = false;

    if (columnCheckItem.items == null) {
      return;
    }
    columnCheckItem.items.forEach(t => (t.completed = completed));
  }

  /**
   * Updates the completed and incomplete fields of the column wrapper
   * @param groupColumnCheckItem IColumnCheckItem group item from column checked/unchecked
   */
  private _updateAllComplete(groupColumnCheckItem: IColumnCheckItem) {
    groupColumnCheckItem.completed = groupColumnCheckItem.items != null && groupColumnCheckItem.items.every(t => t.completed);
    groupColumnCheckItem.incomplete = !groupColumnCheckItem.completed && groupColumnCheckItem.items != null && groupColumnCheckItem.items.some(t => t.completed);
  }
}
