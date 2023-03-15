import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AnalysisInputType } from 'src/app/_helpers';
import { AnalysisInputDefinition } from 'src/app/_models';
import { AlertService, AnalysisInputDefinitionService } from 'src/app/_services';

@Component({
  selector: 'app-dialog-analysis-file-requirements',
  templateUrl: './dialog-analysis-file-requirements.component.html',
  styleUrls: ['./dialog-analysis-file-requirements.component.scss']
})
export class DialogAnalysisFileRequirementsComponent implements OnInit {

  public analysisTypeEnum: typeof AnalysisInputType = AnalysisInputType;
  public loading: boolean = false;

  //#region MAT-TABLE CONFIG
  ////////////////////////////////////////////////
  public columnsToDisplay: string[] = ['column', 'dataType', 'required', 'primaryKey', 'description', 'example'];
  public tableDataSource: MatTableDataSource<AnalysisInputDefinition>;
  //#endregion
  ////////////////////////////////////////////////

  constructor(@Inject(MAT_DIALOG_DATA) public analysisInputType: AnalysisInputType, private _analysisInputDefinitionService: AnalysisInputDefinitionService, private _alertService: AlertService) {
    this.tableDataSource = new MatTableDataSource(new Array<AnalysisInputDefinition>());
  }

  ngOnInit(): void {
    this.loadAnalysisInputDefinition();
  }

  loadAnalysisInputDefinition() {
    this.loading = true;
    this._analysisInputDefinitionService
      .getAnalysisInputDefinition(this.analysisInputType)
      .subscribe((data) => {
        this.tableDataSource = new MatTableDataSource(data);
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this._alertService.showError('Something went wrong: ' + error.message);
      });
  }
}
