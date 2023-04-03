import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnalysisType } from 'src/app/_helpers';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { AnalysisInputValidationFailureCase } from 'src/app/_models/analysis-input-validation-failure-case/analysis-input-validation-failure-case.model';
import { AnalysisInputValidationResult } from 'src/app/_models/analysis-input-validation-result/analysis-input-validation-result.model';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { AlertService, AnalysisToolService } from 'src/app/_services';

@Component({
  selector: 'app-dialog-analysis-input-validation-result',
  templateUrl: './dialog-analysis-input-validation-result.component.html',
  styleUrls: ['./dialog-analysis-input-validation-result.component.scss']
})
export class DialogAnalysisInputValidationResultComponent implements OnInit, AfterViewInit {
  public loading: boolean = false;

  analysisResult: AnalysisResult = new AnalysisResult();
  public localityEmployabilityFileAnalysisInputValidation: AnalysisInputValidationResult | null = null;
  public localityFileAnalysisInputValidation: AnalysisInputValidationResult | null = null;
  public schoolFileAnalysisInputValidation: AnalysisInputValidationResult | null = null;
  public schoolHistoryFileAnalysisInputValidation: AnalysisInputValidationResult | null = null;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogAnalysisResultData, private _alertService: AlertService, private _analysisToolService: AnalysisToolService) {
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
    this.loadAnalysisResult();
  }

  loadAnalysisResult() {
    this.loading = true;

    const taskResult = this._analysisToolService.getTaskResultFromStorage(this.data.analysisType);
    if (taskResult) {
      this.analysisResult = taskResult;

      if (this.data.analysisType === AnalysisType.ConnectivityPrediction) {
        this.loadLocalityFileFailureCases();
        this.loadSchoolFileFailureCases();
      }

      if (this.data.analysisType === AnalysisType.EmployabilityImpact) {
        this.loadLocalityEmployabilityFileFailureCases();
        this.loadSchoolHistoryFileFailureCases();
      }

      this.loading = false;
    } else {
      this._analysisToolService
        .getTaskResult(this.data.analysisTask.id.toString())
        .subscribe(data => {
          this.analysisResult = data;

          this._analysisToolService.putTaskResultOnStorage(this.data.analysisType, this.analysisResult);

          if (this.data.analysisType === AnalysisType.ConnectivityPrediction) {
            this.loadLocalityFileFailureCases();
            this.loadSchoolFileFailureCases();
          }

          if (this.data.analysisType === AnalysisType.EmployabilityImpact) {
            this.loadLocalityEmployabilityFileFailureCases();
            this.loadSchoolHistoryFileFailureCases();
          }

          this.loading = false;
        }, error => {
          this._alertService.showError('Something went wrong getting result: ' + error.message);
          this.loading = false;
        });
    }
  }

  loadLocalityEmployabilityFileFailureCases() {
    if (this.analysisResult && this.analysisResult.schemaError && this.analysisResult.schemaError['locality']) {
      this.localityEmployabilityFileAnalysisInputValidation = this.analysisResult.schemaError['locality'];
      if (!this.localityEmployabilityFileAnalysisInputValidation.isOk) {
        this.tableLocalityEmployabilityFileFailureCasesDataSource = new MatTableDataSource(this.analysisResult.schemaError['locality'].failureCases);
        this.tableLocalityEmployabilityFileFailureCasesDataSource.paginator = this.localityEmployabilityFilePaginator;
        this.tableLocalityEmployabilityFileFailureCasesDataSource.sort = this.localityEmployabilityFileSort;
      }
    }
  }

  loadLocalityFileFailureCases() {
    if (this.analysisResult && this.analysisResult.schemaError && this.analysisResult.schemaError['locality']) {
      this.localityFileAnalysisInputValidation = this.analysisResult.schemaError['locality'];
      if (!this.localityFileAnalysisInputValidation.isOk) {
        this.tableLocalityFileFailureCasesDataSource = new MatTableDataSource(this.analysisResult.schemaError['locality'].failureCases);
        this.tableLocalityFileFailureCasesDataSource.paginator = this.localityFilePaginator;
        this.tableLocalityFileFailureCasesDataSource.sort = this.localityFileSort;
      }
    }
  }

  loadSchoolFileFailureCases() {
    if (this.analysisResult && this.analysisResult.schemaError && this.analysisResult.schemaError['school']) {
      this.schoolFileAnalysisInputValidation = this.analysisResult.schemaError['school'];
      if (!this.schoolFileAnalysisInputValidation.isOk) {
        this.tableSchoolFileFailureCasesDataSource = new MatTableDataSource(this.analysisResult.schemaError['school'].failureCases);
        this.tableSchoolFileFailureCasesDataSource.paginator = this.schoolFilePaginator;
        this.tableSchoolFileFailureCasesDataSource.sort = this.schoolFileSort;
      }
    }
  }

  loadSchoolHistoryFileFailureCases() {
    if (this.analysisResult && this.analysisResult.schemaError && this.analysisResult.schemaError['school']) {
      this.schoolHistoryFileAnalysisInputValidation = this.analysisResult.schemaError['school'];
      if (!this.schoolHistoryFileAnalysisInputValidation.isOk) {
        this.tableSchoolHistoryFileFailureCasesDataSource = new MatTableDataSource(this.analysisResult.schemaError['school'].failureCases);
        this.tableSchoolHistoryFileFailureCasesDataSource.paginator = this.schoolHistoryFilePaginator;
        this.tableSchoolHistoryFileFailureCasesDataSource.sort = this.schoolHistoryFileSort;
      }
    }
  }
}
