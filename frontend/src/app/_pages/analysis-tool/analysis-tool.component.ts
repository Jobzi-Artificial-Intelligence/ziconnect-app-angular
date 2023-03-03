import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { interval, Subscription } from 'rxjs';
import { AnalysisTaskStatus } from 'src/app/_helpers/enums/analysis-task-status';
import { AnalysisType } from 'src/app/_helpers/enums/analysis-type';
import { AnalysisTask } from 'src/app/_models';
import { AlertService, AnalysisToolService } from 'src/app/_services';

@Component({
  selector: 'app-analysis-tool',
  templateUrl: './analysis-tool.component.html',
  styleUrls: ['./analysis-tool.component.scss']
})
export class AnalysisToolComponent implements OnInit, OnDestroy {
  @ViewChild('sectionTypeSelection') sectionTypeSelection: ElementRef | undefined;
  @ViewChild('sectionAnalysisSteps') sectionAnalysisSteps: ElementRef | undefined;
  @ViewChild('analysisStepper') analysisStepper: MatStepper | undefined;

  public loadingPoolTask: boolean = false;
  public loadingStartTask: boolean = false;

  public selectedAnalysisType: AnalysisType | undefined = undefined;
  public selectedFile: File | undefined;
  public responseBody: any;
  public progress: number = 0;
  public storageTask?: AnalysisTask | null = null;
  public poolTaskSubscription!: Subscription;

  //#region FILES
  ////////////////////////////////////////////
  @ViewChild('schoolFileDropRef') schoolFileDropRef: ElementRef | undefined;
  public schoolFile: File | undefined;

  @ViewChild('localityFileDropRef') localityFileDropRef: ElementRef | undefined;
  public localityFile: File | undefined;

  @ViewChild('schoolHistoryFileDropRef') schoolHistoryFileDropRef: ElementRef | undefined;
  public schoolHistoryFile: File | undefined;
  ////////////////////////////////////////////
  //#endregion

  constructor(private _alertService: AlertService, private _analysisToolService: AnalysisToolService, private ref: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    if (this.poolTaskSubscription) {
      this.poolTaskSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.selectedFile = undefined;
  }

  loadStorageTask() {
    if (this.selectedAnalysisType) {
      this.storageTask = null;
      const analysisTypeStr = AnalysisType[this.selectedAnalysisType];

      const storageTask = localStorage.getItem(`${analysisTypeStr}_task`);

      if (storageTask) {
        let analysisTask = new AnalysisTask().fromLocalStorage(JSON.parse(storageTask));
        this.storageTask = analysisTask;
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

  onButtonNextClick() {
    if (this.analysisStepper) {
      if (this.analysisStepper.selected) {
        this.analysisStepper.selected.completed = true;
      }

      this.analysisStepper.next();
    }
  }

  onButtonRemoveFileClick(filePropertyName: string) {
    (this as any)[filePropertyName] = undefined;
    if ((this as any)[`${filePropertyName}DropRef`]) {
      (this as any)[`${filePropertyName}DropRef`].nativeElement.value = '';
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
    let schoolFile: any;
    if (this.selectedAnalysisType === AnalysisType.ConnectivityPrediction) {
      if (!this.schoolFile || !this.localityFile) {
        this._alertService.showWarning('One or more input file were not provided!');
        return;
      }

      schoolFile = this.schoolFile;
    }

    if (this.selectedAnalysisType === AnalysisType.EmployabilityImpact) {
      if (!this.schoolHistoryFile || !this.localityFile) {
        this._alertService.showWarning('One or more input file were not provided!');
        return;
      }
    }

    this.loadingStartTask = true;
    this.progress = 0;

    this._analysisToolService
      .postNewPredictionAnalysis(schoolFile)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          if (event.body && event.body.task_id) {
            let analysisTask = new AnalysisTask();
            analysisTask.id = event.body.task_id;

            if (this.selectedAnalysisType) {
              this.putAnalysisTaskOnStorage(analysisTask);
              this.poolStorageTask();
            }

            this.loadingStartTask = false;
          }
        }
      }, (error: any) => {
        this.loadingStartTask = false;
        this._alertService.showError('Something went wrong: ' + error.message);
      });
  }

  onSelectAnalysisTypeClick(type: AnalysisType) {
    this.selectedAnalysisType = type;
    this.initNewAnalysis();

    this.loadStorageTask();

    if (!this.storageTask) {
      this.ref.detectChanges();

      this.scrollToSection('sectionAnalysisSteps');
    } else if (![AnalysisTaskStatus.Success, AnalysisTaskStatus.Failure].includes(this.storageTask.status)) {
      this.poolStorageTask();
    }
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
    this.localityFile = undefined;
    this.schoolHistoryFile = undefined;
    this.schoolFile = undefined;
    this.storageTask = null;
    this.progress = 0;

    if (this.poolTaskSubscription) {
      this.poolTaskSubscription.unsubscribe();
    }

    if (this.schoolFileDropRef) {
      this.schoolFileDropRef.nativeElement.value = '';
    }

    if (this.localityFileDropRef) {
      this.localityFileDropRef.nativeElement.value = '';
    }

    if (this.schoolHistoryFileDropRef) {
      this.schoolHistoryFileDropRef.nativeElement.value = '';
    }
  }

  poolStorageTask() {
    if (this.storageTask) {
      const timer = interval(10000);

      this.poolTaskSubscription = timer.subscribe(() => {
        this.loadingPoolTask = true;

        this._analysisToolService
          .getTaskResult(this.storageTask ? this.storageTask.id.toString() : '')
          .subscribe(data => {
            this.loadingPoolTask = false;
            this.storageTask = data;

            this.putAnalysisTaskOnStorage(this.storageTask);

            if (this.storageTask.status === AnalysisTaskStatus.Failure || this.storageTask.status === AnalysisTaskStatus.Success) {
              this.poolTaskSubscription.unsubscribe();
            }
          }, error => {
            this.loadingPoolTask = false;
            this._alertService.showError(error);
          });
      });
    }
  }

  putAnalysisTaskOnStorage(analysisTask: AnalysisTask) {
    if (this.selectedAnalysisType) {
      const analysisTypeStr = AnalysisType[this.selectedAnalysisType];

      localStorage.setItem(`${analysisTypeStr}_task`, analysisTask.toLocalStorageString());

      this.storageTask = analysisTask;
    }
  }
}
