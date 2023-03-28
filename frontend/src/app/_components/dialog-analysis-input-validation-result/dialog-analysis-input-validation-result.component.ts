import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnalysisType } from 'src/app/_helpers';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { AnalysisInputValidationFailureCase } from 'src/app/_models/analysis-input-validation-failure-case/analysis-input-validation-failure-case.model';
import { AnalysisInputValidationResult } from 'src/app/_models/analysis-input-validation-result/analysis-input-validation-result.model';

@Component({
  selector: 'app-dialog-analysis-input-validation-result',
  templateUrl: './dialog-analysis-input-validation-result.component.html',
  styleUrls: ['./dialog-analysis-input-validation-result.component.scss']
})
export class DialogAnalysisInputValidationResultComponent implements OnInit, AfterViewInit {
  public loading: boolean = false;

  private _analysisInputValidationResultFromServer = {
    "is_ok": false,
    "failure_cases": [{
      "schema_context": "Column",
      "column": "municipality_code",
      "check": "isin",
      "check_number": 0,
      "failure_case": "1302603",
      "index": 268
    },
    {
      "schema_context": "Column",
      "column": "municipality_code",
      "check": "isin",
      "check_number": 0,
      "failure_case": "1302603",
      "index": 18026
    },
    {
      "schema_context": "Column",
      "column": "municipality_code",
      "check": "isin",
      "check_number": 0,
      "failure_case": "1302603",
      "index": 17860
    }],
    "failure_rows": [
      {
        "school_code": "13027620",
        "school_name": "ESCOLA ESTADUAL MARIA MADALENA SANTANA DE LIMA",
        "school_type": "Estadual",
        "school_region": "Urban",
        "student_count": 687,
        "municipality_code": "1302603",
        "latitude": -3.0893,
        "longitude": -59.9426,
        "internet_availability": false
      },
      {
        "school_code": "13029428",
        "school_name": "EM ANASTACIO ASSUNCAO",
        "school_type": "Municipal",
        "school_region": "Urban",
        "student_count": 591,
        "municipality_code": "1302603",
        "latitude": -3.1382,
        "longitude": -59.9944,
        "internet_availability": true
      },
      {
        "school_code": "13307231",
        "school_name": "EM DESEMBARGADOR OYAMA ITUASSU",
        "school_type": "Municipal",
        "school_region": "Urban",
        "student_count": 1373,
        "municipality_code": "1302603",
        "latitude": -2.9918,
        "longitude": -60.0032,
        "internet_availability": true
      }]
  };

  public localityEmployabilityFileAnalysisInputValidation = new AnalysisInputValidationResult().deserialize(this._analysisInputValidationResultFromServer);
  public localityFileAnalysisInputValidation = new AnalysisInputValidationResult().deserialize(this._analysisInputValidationResultFromServer);
  public schoolFileAnalysisInputValidation = new AnalysisInputValidationResult().deserialize(this._analysisInputValidationResultFromServer);
  public schoolHistoryFileAnalysisInputValidation = new AnalysisInputValidationResult().deserialize(this._analysisInputValidationResultFromServer);

  //#region MAT-TABLE CONFIG
  ////////////////////////////////////////////////
  @ViewChild('localityFilePaginator') localityFilePaginator!: MatPaginator;
  @ViewChild('localityFileSort') localityFileSort!: MatSort;

  @ViewChild('localityEmployabilityFilePaginator') localityEmployabilityFilePaginator!: MatPaginator;
  @ViewChild('localityEmployabilityFileSort') localityEmployabilityFileSort!: MatSort;

  @ViewChild('schoolFilePaginator') schoolFilePaginator!: MatPaginator;
  @ViewChild('schoolFileSort') schoolFileSort!: MatSort;

  @ViewChild('schoolHistoryFilePaginator') schoolHistoryFilePaginator!: MatPaginator;
  @ViewChild('schoolHistoryFileSort') schoolHistoryFileSort!: MatSort;

  public columnsToDisplay: string[] = ['schemaContext', 'column', 'check', 'checkNumber', 'failureCase', 'index'];
  public tableLocalityFileFailureCasesDataSource: MatTableDataSource<AnalysisInputValidationFailureCase>;
  public tableLocalityEmployabilityFileFailureCasesDataSource: MatTableDataSource<AnalysisInputValidationFailureCase>;
  public tableSchoolFileFailureCasesDataSource: MatTableDataSource<AnalysisInputValidationFailureCase>;
  public tableSchoolHistoryFileFailureCasesDataSource: MatTableDataSource<AnalysisInputValidationFailureCase>;
  //#endregion
  ////////////////////////////////////////////////

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogAnalysisResultData) {
    this.tableLocalityFileFailureCasesDataSource = new MatTableDataSource(new Array<AnalysisInputValidationFailureCase>());
    this.tableLocalityEmployabilityFileFailureCasesDataSource = new MatTableDataSource(new Array<AnalysisInputValidationFailureCase>());
    this.tableSchoolFileFailureCasesDataSource = new MatTableDataSource(new Array<AnalysisInputValidationFailureCase>());
    this.tableSchoolHistoryFileFailureCasesDataSource = new MatTableDataSource(new Array<AnalysisInputValidationFailureCase>());
  }

  ngAfterViewInit(): void {
    this.tableLocalityEmployabilityFileFailureCasesDataSource.paginator = this.localityEmployabilityFilePaginator;
    this.tableLocalityEmployabilityFileFailureCasesDataSource.sort = this.localityEmployabilityFileSort;

    this.tableLocalityFileFailureCasesDataSource.paginator = this.localityFilePaginator;
    this.tableLocalityFileFailureCasesDataSource.sort = this.localityFileSort;

    this.tableSchoolFileFailureCasesDataSource.paginator = this.schoolFilePaginator;
    this.tableSchoolFileFailureCasesDataSource.sort = this.schoolFileSort;

    this.tableSchoolHistoryFileFailureCasesDataSource.paginator = this.schoolHistoryFilePaginator;
    this.tableSchoolHistoryFileFailureCasesDataSource.sort = this.schoolHistoryFileSort;
  }

  ngOnInit(): void {
    if (this.data.analysisType === AnalysisType.ConnectivityPrediction) {
      this.loadLocalityFileFailureCases();
      this.loadSchoolFileFailureCases();
    }

    if (this.data.analysisType === AnalysisType.EmployabilityImpact) {
      this.loadLocalityEmployabilityFileFailureCases();
      this.loadSchoolHistoryFileFailureCases();
    }
  }

  loadLocalityEmployabilityFileFailureCases() {
    this.tableLocalityEmployabilityFileFailureCasesDataSource = new MatTableDataSource(this.localityEmployabilityFileAnalysisInputValidation.failureCases);
    this.tableLocalityEmployabilityFileFailureCasesDataSource.paginator = this.localityEmployabilityFilePaginator;
    this.tableLocalityEmployabilityFileFailureCasesDataSource.sort = this.localityEmployabilityFileSort;
  }

  loadLocalityFileFailureCases() {
    this.tableLocalityFileFailureCasesDataSource = new MatTableDataSource(this.localityFileAnalysisInputValidation.failureCases);
    this.tableLocalityFileFailureCasesDataSource.paginator = this.localityFilePaginator;
    this.tableLocalityFileFailureCasesDataSource.sort = this.localityFileSort;
  }

  loadSchoolFileFailureCases() {
    this.tableSchoolFileFailureCasesDataSource = new MatTableDataSource(this.schoolFileAnalysisInputValidation.failureCases);
    this.tableSchoolFileFailureCasesDataSource.paginator = this.schoolFilePaginator;
    this.tableSchoolFileFailureCasesDataSource.sort = this.schoolFileSort;
  }

  loadSchoolHistoryFileFailureCases() {
    this.tableSchoolHistoryFileFailureCasesDataSource = new MatTableDataSource(this.schoolHistoryFileAnalysisInputValidation.failureCases);
    this.tableSchoolHistoryFileFailureCasesDataSource.paginator = this.schoolHistoryFilePaginator;
    this.tableSchoolHistoryFileFailureCasesDataSource.sort = this.schoolHistoryFileSort;
  }
}
