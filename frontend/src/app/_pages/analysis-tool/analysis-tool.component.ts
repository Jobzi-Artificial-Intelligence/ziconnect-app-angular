import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_services';

@Component({
  selector: 'app-analysis-tool',
  templateUrl: './analysis-tool.component.html',
  styleUrls: ['./analysis-tool.component.scss']
})
export class AnalysisToolComponent implements OnInit {
  public selectedFile: any | null;

  constructor(private _alertService: AlertService) { }

  ngOnInit(): void {
    this.selectedFile = null;
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
}
