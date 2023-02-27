import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService, AnalysisToolService } from 'src/app/_services';

@Component({
  selector: 'app-analysis-tool',
  templateUrl: './analysis-tool.component.html',
  styleUrls: ['./analysis-tool.component.scss']
})
export class AnalysisToolComponent implements OnInit {
  @ViewChild('sectionTypeSelection') sectionTypeSelection: ElementRef | undefined;

  public selectedFile: File | undefined;
  public responseBody: any;
  public progress: number = 0;
  public predictionTaskId: string = '';

  constructor(private _alertService: AlertService, private _analysisToolService: AnalysisToolService) { }

  ngOnInit(): void {
    this.selectedFile = undefined;

    this.loadPredictionTaskId();
  }

  loadPredictionTaskId() {
    const storageTaskId = localStorage.getItem('prediction_task_id');

    this.predictionTaskId = storageTaskId ? storageTaskId : '';
  }

  //#region Upload Files Handlers
  ////////////////////////////////////////////
  onFileBrowserHandler($event: any) {
    if ($event && $event.target && $event.target.files && $event.target.files.length > 0) {
      this.selectedFile = $event.target.files[0];
    }
  }

  onFileDropped(files: FileList) {
    if (files.length === 0) {
      this._alertService.showWarning('Upload file not provided');
    } else if (files.length > 1) {
      this._alertService.showWarning('Only one file is allowed');
      return;
    }

    this.selectedFile = files[0];
  }
  ////////////////////////////////////////////
  //#endregion

  onButtonRemoveFileClick() {
    this.selectedFile = undefined;
  }

  onButtonSetStorageValueClick() {
    const newValue = Math.random().toString(36).substring(2, 12);
    localStorage.setItem('prediction_task_id', newValue);

    this.predictionTaskId = newValue;
  }

  onButtonRemoveStorageValueClick() {
    localStorage.removeItem('prediction_task_id');

    this.predictionTaskId = '';
  }

  onButtonStartAnalysisClick() {
    if (!this.selectedFile) {
      this._alertService.showWarning('One or more input file were not provided!');
      return;
    }

    this.progress = 0;

    this._analysisToolService
      .postNewPredictionAnalysis(this.selectedFile)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.responseBody = event.body;
        }
      }, (error: any) => {
        this._alertService.showError('Something went wrong: ' + error.message);
      });
  }

  scrollToStartAnalysisSection(): void {
    console.log(this.sectionTypeSelection);
    if (this.sectionTypeSelection) {
      const yOffset = -60; // ajuste o valor para a posição desejada
      const element = this.sectionTypeSelection.nativeElement;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
