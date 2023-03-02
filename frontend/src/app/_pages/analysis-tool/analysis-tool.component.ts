import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AnalysisType } from 'src/app/_helpers/enums/analysis-type';
import { AnalysisTask } from 'src/app/_models';
import { AlertService, AnalysisToolService } from 'src/app/_services';

@Component({
  selector: 'app-analysis-tool',
  templateUrl: './analysis-tool.component.html',
  styleUrls: ['./analysis-tool.component.scss']
})
export class AnalysisToolComponent implements OnInit {
  @ViewChild('sectionTypeSelection') sectionTypeSelection: ElementRef | undefined;
  @ViewChild('sectionAnalysisSteps') sectionAnalysisSteps: ElementRef | undefined;
  @ViewChild('analysisStepper') analysisStepper: MatStepper | undefined;

  public selectedAnalysisType: AnalysisType | undefined = undefined;
  public selectedFile: File | undefined;
  public responseBody: any;
  public progress: number = 0;
  public storageTask?: AnalysisTask | null = null;

  //#region FILES
  ////////////////////////////////////////////
  @ViewChild('schoolFileDropRef') schoolFileDropRef: ElementRef | undefined;
  public schoolFile!: File;

  @ViewChild('localityFileDropRef') localityFileDropRef: ElementRef | undefined;
  public localityFile!: File;

  @ViewChild('jobsFileDropRef') jobsFileDropRef: ElementRef | undefined;
  public jobsFile!: File;
  ////////////////////////////////////////////
  //#endregion

  constructor(private _alertService: AlertService, private _analysisToolService: AnalysisToolService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.selectedFile = undefined;
  }

  loadStorageTask() {
    if (this.selectedAnalysisType) {
      this.storageTask = null;
      const analysisTypeStr = AnalysisType[this.selectedAnalysisType];

      const storageTask = localStorage.getItem(`${analysisTypeStr}_task`);

      if (storageTask) {
        this.storageTask = JSON.parse(storageTask);
      }
    }
  }

  //#region Upload Files Handlers
  ////////////////////////////////////////////
  onFileBrowserHandler($event: any, filePropertyName: string) {
    if ($event && $event.target && $event.target.files && $event.target.files.length > 0) {
      (this as any)[filePropertyName] = $event.target.files[0];
    }
  }

  onFileDropped(files: FileList, filePropertyName: string) {
    if (files.length === 0) {
      this._alertService.showWarning('Upload file not provided');
    } else if (files.length > 1) {
      this._alertService.showWarning('Only one file is allowed');
      return;
    }

    (this as any)[filePropertyName] = files[0];
  }
  ////////////////////////////////////////////
  //#endregion

  onButtonRemoveFileClick(filePropertyName: string) {
    (this as any)[filePropertyName] = undefined;
    if ((this as any)[`${filePropertyName}DropRef`]) {
      (this as any)[`${filePropertyName}DropRef`].nativeElement.value = '';
    }
  }

  setStorageValueClick() {
    if (this.selectedAnalysisType) {
      const newValue = Math.random().toString(36).substring(2, 12);
      const analysisTypeStr = AnalysisType[this.selectedAnalysisType];

      const task = new AnalysisTask();
      task.taskId = newValue;

      localStorage.setItem(`${analysisTypeStr}_task`, JSON.stringify(task));

      this.storageTask = task;
    }

  }

  onButtonRemoveStorageValueClick() {
    if (this.selectedAnalysisType) {
      const analysisTypeStr = AnalysisType[this.selectedAnalysisType];


      localStorage.removeItem(`${analysisTypeStr}_task`);

      this.onSelectAnalysisTypeClick(this.selectedAnalysisType);
    }
  }

  onButtonStartAnalysisClick() {
    if (!this.schoolFile) {
      this._alertService.showWarning('One or more input file were not provided!');
      return;
    }

    this.progress = 0;

    this.setStorageValueClick();

    this._analysisToolService
      .postNewPredictionAnalysis(this.schoolFile)
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

  onSelectAnalysisTypeClick(type: AnalysisType) {
    this.selectedAnalysisType = type;
    this.initNewAnalysis();

    this.loadStorageTask();

    this.ref.detectChanges();

    this.scrollToSection('sectionAnalysisSteps');
  }

  scrollToSection(sectionElementName: string): void {
    const elementRef = (this as any)[sectionElementName] as ElementRef;

    if (elementRef) {
      const yOffset = -60; // ajuste o valor para a posição desejada
      const element = elementRef.nativeElement;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  initNewAnalysis() {
    this.selectedFile = undefined;
    this.storageTask = null;

    if (this.schoolFileDropRef) {
      this.schoolFileDropRef.nativeElement.value = '';
    }

    if (this.localityFileDropRef) {
      this.localityFileDropRef.nativeElement.value = '';
    }

    if (this.jobsFileDropRef) {
      this.jobsFileDropRef.nativeElement.value = '';
    }
  }

  onButtonNextClick() {
    if (this.analysisStepper) {
      if (this.analysisStepper.selected) {
        this.analysisStepper.selected.completed = true;
      }

      this.analysisStepper.next();
    }
  }
}
