import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilHelper } from 'src/app/_helpers';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { LocalityStatistics } from 'src/app/_models';
import { AlertService, LocalityStatisticsService } from 'src/app/_services';

@Component({
  selector: 'app-dialog-anaysis-result',
  templateUrl: './dialog-anaysis-result.component.html',
  styleUrls: ['./dialog-anaysis-result.component.scss']
})
export class DialogAnaysisResultComponent implements OnInit, AfterViewInit {
  loading: boolean = true;
  metricsChartResults: Array<any> = new Array<any>();

  //#region CHART CONFIGURATION
  ////////////////////////////////////////////////
  metricsLineChartConfig = {
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Fold',
    yAxisLabel: 'Accuracy'
  };

  metricsBoxChartConfig = {
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Metric',
    yAxisLabel: 'Accuracy'
  }
  //#endregion
  ////////////////////////////////////////////////

  //#region MAT-TABLE CONFIG
  ////////////////////////////////////////////////
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public groupColumnsDisplayed: string[] = ['country', 'state', 'municipality', 'counts', 'withoutData', 'prediction'];
  public columnsToDisplay: string[] = ['countryCode', 'countryName', 'stateCode', 'stateName', 'municipalityCode', 'municipalityName', 'stateCount', 'municipalityCount', 'schoolCount', 'withoutDataCount', 'withoutDataPercentage', 'predictionCount', 'predictionPercentage'];
  public tableDataSource: MatTableDataSource<LocalityStatistics>;
  //#endregion
  ////////////////////////////////////////////////

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogAnalysisResultData, private ref: ChangeDetectorRef, private _alertService: AlertService) {
    this.tableDataSource = new MatTableDataSource(new Array<LocalityStatistics>());
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.buildMetricsLineChart();
    this.loadAnalysisResult();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  buildMetricsLineChart() {
    const trainAccuracySeries = {
      name: 'Training',
      series: this.data.analysisResult.modelMetrics.trainAccuracies.map((value, index) => {
        return {
          name: `${index + 1}`,
          value: parseFloat((value * 100).toFixed(2))
        }
      })
    };

    const validAccuracySeries = {
      name: 'Validation',
      series: this.data.analysisResult.modelMetrics.validAccuracies.map((value, index) => {
        return {
          name: `${index + 1}`,
          value: parseFloat((value * 100).toFixed(2))
        }
      })
    };

    this.metricsChartResults.push(trainAccuracySeries);
    this.metricsChartResults.push(validAccuracySeries);
  }

  loadAnalysisResult() {
    this.loading = true;
    setTimeout(() => {
      this.tableDataSource = new MatTableDataSource(this.data.analysisResult.resultSummary);
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.filterPredicate = this.tableFilterPredicate;

      this.loading = false;
    }, 1000);
  }

  onButtonExportClick() {
    try {
      const dataToExport = this.tableDataSource.filteredData.map((item) => {
        return {
          'country_code': item.localityMap.countryCode,
          'country_name': item.localityMap.countryName,
          'state_code': item.localityMap.stateCode,
          'state_name': item.localityMap.stateName,
          'municipality_code': item.localityMap.municipalityCode,
          'municipality_name': item.localityMap.municipalityName,
          'state_count': item.statesCount,
          'municipality_count': item.municipalitiesCount,
          'school_count': item.schoolCount,
          'without_data_count': item.schoolWithoutInternetAvailabilityCount,
          'without_data_percentage': item.schoolWithoutInternetAvailabilityPercentage,
          'prediction_count': item.schoolInternetAvailabilityPredicitionCount,
          'prediction_percentage': item.schoolInternetAvailabilityPredicitionPercentage
        }
      })
      UtilHelper.exportFromObjectToCsv('result_summary.csv', dataToExport);
    } catch (error: any) {
      this._alertService.showError(error.toString());
    }
  }

  tableFilterPredicate(data: LocalityStatistics, filter: string) {

    return data.localityMap.countryCode.toString().toLowerCase().includes(filter) ||
      data.localityMap.countryName.toString().toLowerCase().includes(filter) ||
      data.localityMap.stateCode.toString().toLowerCase().includes(filter) ||
      data.localityMap.stateName.toString().toLowerCase().includes(filter) ||
      data.localityMap.municipalityCode.toString().toLowerCase().includes(filter) ||
      data.localityMap.municipalityName.toString().toLowerCase().includes(filter);
  };
}
