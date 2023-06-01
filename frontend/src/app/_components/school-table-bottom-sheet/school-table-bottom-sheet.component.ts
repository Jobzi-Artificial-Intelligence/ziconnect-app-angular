import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilHelper } from 'src/app/_helpers';
import { School } from 'src/app/_models';
import { AlertService, ISchoolColumn, SchoolService } from 'src/app/_services';
import { DialogSchoolColumnSelectorComponent, IDialogSchoolColumnSelectorData, IDialogSchoolColumnSelectorResult } from '../dialog-school-column-selector/dialog-school-column-selector.component';

export interface ISchoolTableParam {
  countryCode: string | null;
  regionCode: string | null;
  stateCode: string | null;
  municipalityCode: string | null;
  schools: Array<School>
}

@Component({
  selector: 'app-school-table-bottom-sheet',
  templateUrl: './school-table-bottom-sheet.component.html',
  styleUrls: ['./school-table-bottom-sheet.component.scss']
})
export class SchoolTableBottomSheetComponent implements OnInit {
  private _schoolService: SchoolService;

  //#region MAT-TABLE CONFIG
  ////////////////////////////////////////////////

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public columns: ISchoolColumn[] = [];
  public columnsToDisplay: string[] = ['school_name', 'school_region', 'school_type', 'student_count', 'computer_availability_str', 'internet_availability_str', 'internet_availability_prediction_str', 'without_internet_availability_data'];
  public tableDataSource: MatTableDataSource<School>;

  //#endregion
  ////////////////////////////////////////////////

  public loading: Boolean;
  public schools: Array<School> = new Array<School>();

  constructor(private _bottomSheetRef: MatBottomSheetRef<SchoolTableBottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: ISchoolTableParam, private httpClient: HttpClient,
    private _alertService: AlertService, @Inject(APP_BASE_HREF) public baseHref: string, public dialog: MatDialog) {
    this.tableDataSource = new MatTableDataSource(new Array<School>());
    this.loading = false;

    this._schoolService = new SchoolService(this.httpClient, this.baseHref);
    this.initMatTableColumnsDefinition();
  }

  ngOnInit(): void {
    this.initData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  async initData() {
    await this.loadSchools();
    await this.initMatTable();
  }

  initMatTableColumnsDefinition() {
    this._schoolService.schoolColumnGroups.forEach(columnGroup => {
      this.columns = this.columns.concat(columnGroup.columns);
    });
  }

  async initMatTable() {
    this.tableDataSource = new MatTableDataSource(this.schools);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.tableDataSource.sort = this.sort;
  }

  async loadSchools() {
    if (this.data && this.data.schools && this.data.schools.length > 0) {
      this.schools = this.data.schools;
      return;
    }

    this.loading = true;

    await this.loadSchoolsFromCodes();

    this.loading = false;
  }

  async loadSchoolsFromCodes() {
    return new Promise((resolve, reject) => {
      try {
        this._schoolService
          .getSchoolsByLocalityMapCodes(this.data.countryCode, this.data.regionCode, this.data.stateCode, this.data.municipalityCode)
          .subscribe(
            (data) => {
              // GET ALL SCHOOLS FROM FILE
              this.schools = data;

              resolve(null);
            },
            (error) => {
              this._alertService.showError(`Something went wrong retrieving schools data: ${error.message}`);
              resolve(null);
            }
          );
      } catch (error: any) {
        this._alertService.showError(error);
        resolve(null);
      }
    })
  }

  /**
   * Choose table columns button click event
   */
  onButtonChooseColumnsClick() {
    const dialogRef = this.dialog.open(DialogSchoolColumnSelectorComponent, {
      disableClose: false,
      width: '600px',
      data: {
        columnsDisplayed: this.columnsToDisplay
      } as IDialogSchoolColumnSelectorData
    });

    dialogRef.afterClosed().subscribe((result: IDialogSchoolColumnSelectorResult) => {
      if (result && result.status === 'CONFIRM') {
        this.columnsToDisplay = result.selectedColumns;
      }
    });
  }

  /**
   * Close bottom sheet button click event
   */
  onButtonCloseClick() {
    this._bottomSheetRef.dismiss();
  }

  /**
   * Export to csv button click event
   */
  onButtonExportClick() {
    try {
      this._schoolService.exportToCsv('schools.csv', this.tableDataSource.filteredData);
    } catch (error: any) {
      this._alertService.showError(error.toString());
    }
  }

  sortingDataAccessor(obj: any, path: any) {
    return UtilHelper.getPropertyValueByPath(obj, path);
  }
}
