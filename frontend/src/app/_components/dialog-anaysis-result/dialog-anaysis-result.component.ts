import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSliderChange } from '@angular/material/slider';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { AnalysisType, UtilHelper } from 'src/app/_helpers';
import { MathHelper } from 'src/app/_helpers/util/math.helper';
import { IDialogAnalysisResultData } from 'src/app/_interfaces';
import { LocalityStatistics } from 'src/app/_models';
import { AnalysisResult } from 'src/app/_models/analysis-result/analysis-result.model';
import { AlertService, AnalysisToolService } from 'src/app/_services';

@Component({
  selector: 'app-dialog-anaysis-result',
  templateUrl: './dialog-anaysis-result.component.html',
  styleUrls: ['./dialog-anaysis-result.component.scss']
})
export class DialogAnaysisResultComponent implements OnInit, AfterViewInit {
  public analysisTypeEnum: typeof AnalysisType = AnalysisType;

  analysisResult: AnalysisResult = new AnalysisResult();
  loading: boolean = true;
  distributionDiffChartResults: Array<any> = new Array<any>();
  distributionChartResultsA: Array<any> = new Array<any>();
  distributionChartResultsB: Array<any> = new Array<any>();
  metricsChartResults: Array<any> = new Array<any>();

  bestScenarioEmployabilityPlotResult: Array<any> = new Array<any>();
  bestScenarioHdiPlotResult: Array<any> = new Array<any>();
  bestScenarioPopulationPlotResult: Array<any> = new Array<any>();

  //#region CHART CONFIGURATION
  ////////////////////////////////////////////////
  bestScenarioBoxChartConfig = {
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Scenario',
    yAxisLabel: 'Value'
  }

  distributionChartTypes = ['Frequency distribution', 'Distribution differences'];
  distributionChartType: string = this.distributionChartTypes[0];

  distributionBarChartColorSchemeA: Color = {
    name: 'DistributionBarChartColorSchemeB',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#03a0d7']
  };

  distributionBarChartColorSchemeB: Color = {
    name: 'DistributionBarChartColorSchemeB',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#555555']
  };

  distributionDiffBarChartColorScheme: Color = {
    name: 'DistributionDiffBarChartColorSchemeB',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#03a0d7', '#555555']
  };

  distributionBarChartConfig = {
    showLegend: false,
    legendPosition: LegendPosition.Right,
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Value (%)',
    yAxisLabel: 'Frequency',
    yScaleMax: 150,
    roundEdges: false
  };

  distributionBarSliderConfig = {
    min: 5,
    max: 50,
    step: 5,
    value: 20
  }

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
    xAxisLabel: 'Partition',
    yAxisLabel: 'Accuracy'
  }
  //#endregion
  ////////////////////////////////////////////////

  //#region MAT-TABLE CONFIG
  ////////////////////////////////////////////////
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('frequencyDistributionPaginator') frequencyDistributionPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public groupColumnsDisplayed: string[] = ['country', 'state', 'municipality', 'counts', 'withoutData', 'prediction'];
  public columnsToDisplay: string[] = [
    'countryCode',
    'countryName',
    'stateCode',
    'stateName',
    'municipalityCode',
    'municipalityName',
    'statesCount',
    'municipalitiesCount',
    'schoolCount',
    'schoolWithoutInternetAvailabilityCount',
    'schoolWithoutInternetAvailabilityPercentage',
    'schoolInternetAvailabilityPredicitionCount',
    'schoolInternetAvailabilityPredicitionPercentage'];
  public tableDataSource: MatTableDataSource<LocalityStatistics>;

  public columnsFrequencyDistributionToDisplay: string[] = ['bin', 'count'];
  public columnsDistributionMetricsToDisplay: string[] = ['metric', 'value'];
  public tableDistributionMetricsA: MatTableDataSource<any>;
  public tableDistributionMetricsB: MatTableDataSource<any>;
  public tableFrequencyDistributionA: MatTableDataSource<any>;
  public tableFrequencyDistributionB: MatTableDataSource<any>;
  //#endregion
  ////////////////////////////////////////////////

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogAnalysisResultData, private ref: ChangeDetectorRef, private _alertService: AlertService, private _analysisToolService: AnalysisToolService) {
    this.tableDataSource = new MatTableDataSource(new Array<LocalityStatistics>());
    this.tableFrequencyDistributionA = new MatTableDataSource(new Array<any>());
    this.tableFrequencyDistributionB = new MatTableDataSource(new Array<any>());
    this.tableDistributionMetricsA = new MatTableDataSource(new Array<any>());
    this.tableDistributionMetricsB = new MatTableDataSource(new Array<any>());
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.filterPredicate = this.tableFilterPredicate;
    this.tableDataSource.sort = this.sort;

    this.tableFrequencyDistributionA.paginator = this.frequencyDistributionPaginator;
    this.tableFrequencyDistributionB.paginator = this.frequencyDistributionPaginator;
  }

  ngOnInit(): void {
    this.loadAnalysisResult();
  }

  buildResultsData() {
    if (this.data.analysisType === AnalysisType.ConnectivityPrediction && this.analysisResult && (this.analysisResult.modelMetrics || this.analysisResult.resultSummary)) {
      this.buildMetricsLineChart();

      if (this.analysisResult.resultSummary) {
        this.tableDataSource = new MatTableDataSource(this.analysisResult.resultSummary);
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.filterPredicate = this.tableFilterPredicate;
        this.tableDataSource.sort = this.sort;
      }
    }

    if (this.data.analysisType === AnalysisType.EmployabilityImpact && this.analysisResult) {
      this.buildBestScenarioDistributionData();
      this.buildScenarioDistributionData();
    }
  }

  loadAnalysisResult() {
    this.loading = true;

    const taskResult = this._analysisToolService.getTaskResultFromStorage(this.data.analysisType);
    if (taskResult) {
      this.analysisResult = taskResult;
      this.buildResultsData();

      this.loading = false;
    } else {
      this._analysisToolService
        .getTaskResult(this.data.analysisTask.id.toString())
        .subscribe(data => {
          this.analysisResult = data;

          this.buildResultsData();

          this._analysisToolService.putTaskResultOnStorage(this.data.analysisType, this.analysisResult);

          this.loading = false;
        }, error => {
          this._alertService.showError('Something went wrong getting result: ' + error.message);
          this.loading = false;
        });
    }
  }

  //#region CONNECTIVITY PREDICTION
  ////////////////////////////////////////////
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  buildMetricsLineChart() {
    if (this.analysisResult.modelMetrics) {
      const trainAccuracySeries = {
        name: 'Training',
        series: this.analysisResult.modelMetrics.trainAccuracies.map((value, index) => {
          return {
            name: `${index + 1}`,
            value: parseFloat((value * 100).toFixed(2))
          }
        })
      };

      const validAccuracySeries = {
        name: 'Validation',
        series: this.analysisResult.modelMetrics.validAccuracies.map((value, index) => {
          return {
            name: `${index + 1}`,
            value: parseFloat((value * 100).toFixed(2))
          }
        })
      };

      this.metricsChartResults.push(trainAccuracySeries);
      this.metricsChartResults.push(validAccuracySeries);
    }
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
  //#endregion
  ////////////////////////////////////////////

  //#region EMPLOYABILITY IMPACT
  ////////////////////////////////////////////
  buildScenarioDistributionData() {
    if (this.analysisResult.allScenarios) {
      // GET EMPLOYABILITY RATE
      const employabilityRateA = this.analysisResult.allScenarios['employability_rate']['mean_by_valid_scenario']['A'] as number[];
      const employabilityRateB = this.analysisResult.allScenarios['employability_rate']['mean_by_valid_scenario']['B'] as number[];

      // CONCAT ARRAY
      const values = [
        ...employabilityRateA,
        ...employabilityRateB,
      ];

      // GET UNIQUE VALUES
      const uniqueValues = [...new Set(values)];

      // GENERATE BOXES
      const boxes = this.getDistributionValueRange(uniqueValues, this.distributionBarSliderConfig.value);

      let chartResultsA: Array<any> = new Array<any>();
      let chartResultsB: Array<any> = new Array<any>();

      let frequencyDistributionA: Array<any> = new Array<any>();
      let frequencyDistributionB: Array<any> = new Array<any>();

      let distributionMetricsA = this.getDistributionMetrics(employabilityRateA);
      let distributionMetricsB = this.getDistributionMetrics(employabilityRateB);

      let frequencyMaxValue: number = Number.MIN_VALUE;

      // GENERATE CHART DATA
      boxes.forEach((box) => {
        if (this.analysisResult.allScenarios) {
          const itemName = `[${box.min}, ${box.max}]`;

          const frequencyA = employabilityRateA.filter((x) => x >= box.min && x <= box.max).length;
          const frequencyB = employabilityRateB.filter((x) => x >= box.min && x <= box.max).length;

          // SET MAX FREQUENCY VALUE
          if (frequencyA > frequencyMaxValue) {
            frequencyMaxValue = frequencyA;
          }

          if (frequencyB > frequencyMaxValue) {
            frequencyMaxValue = frequencyB;
          }

          let chartResultItemA = {
            name: itemName,
            series: [
              {
                name: 'Employability A',
                value: frequencyA,
              }
            ],
          };

          let chartResultItemB = {
            name: itemName,
            series: [
              {
                name: 'Employability B',
                value: frequencyB,
              },
            ],
          };

          chartResultsA.push(chartResultItemA);
          chartResultsB.push(chartResultItemB);

          frequencyDistributionA.push({
            bin: itemName,
            count: frequencyA,
            isGreater: frequencyA > frequencyB
          });

          frequencyDistributionB.push({
            bin: itemName,
            count: frequencyB,
            isGreater: frequencyB > frequencyA
          });
        }
      });

      this.distributionBarChartConfig.yScaleMax = frequencyMaxValue;

      this.distributionChartResultsA = chartResultsA;
      this.distributionChartResultsB = chartResultsB;

      this.tableDistributionMetricsA = new MatTableDataSource(distributionMetricsA);
      this.tableDistributionMetricsB = new MatTableDataSource(distributionMetricsB);

      this.tableFrequencyDistributionA = new MatTableDataSource(frequencyDistributionA);
      this.tableFrequencyDistributionA.paginator = this.frequencyDistributionPaginator;
      this.tableFrequencyDistributionB = new MatTableDataSource(frequencyDistributionB);
      this.tableFrequencyDistributionB.paginator = this.frequencyDistributionPaginator;

      // GENERATE DIFF DISTRIBUTION CHART
      let diffChartResults: Array<any> = new Array<any>();

      const diffValues = employabilityRateA.map((value, index) => {
        return value - employabilityRateB[index];
      });

      const diffUniqueValues = [...new Set(diffValues)];

      const diffBoxes = this.getDistributionValueRange(diffUniqueValues, this.distributionBarSliderConfig.value);

      diffBoxes.forEach((box) => {
        const itemName = `[${box.min}, ${box.max}]`;

        let frequencyGreaterThanZero = 0;
        let frequencyLessThanEqualZero = 0;

        if (box.min > 0 || box.max > 0) {
          frequencyGreaterThanZero = diffValues.filter(x => x >= box.min && x <= box.max && x > 0).length;
        }

        if (box.min <= 0 || box.max <= 0) {
          frequencyLessThanEqualZero = diffValues.filter(x => x >= box.min && x <= box.max && x <= 0).length;
        }

        let diffChartResultItem = {
          name: itemName,
          series: [
            {
              name: 'A is better',
              value: frequencyGreaterThanZero,
            },
            {
              name: 'B is better',
              value: frequencyLessThanEqualZero,
            }
          ],
        };

        diffChartResults.push(diffChartResultItem);
      });

      this.distributionDiffChartResults = diffChartResults;
    }
  }

  buildBestScenarioDistributionData() {
    if (this.analysisResult.bestScenario) {
      let employabilityPlotResult: any[] = [];
      let hdiPlotResult: any[] = [];
      let populationPlotResult: any[] = [];

      ['A', 'B'].forEach(scenario => {
        // EMPLOYABILITY RATE BOX PLOT
        employabilityPlotResult.push({
          name: `Employability ${scenario}`,
          series: this.analysisResult.bestScenario[scenario]['employability_rate'].map((x: any, index: number) => {
            return {
              name: index,
              value: x
            };
          })
        });

        // HDI RATE BOX PLOT
        hdiPlotResult.push({
          name: `Hdi ${scenario}`,
          series: this.analysisResult.bestScenario[scenario]['hdi'].map((x: any, index: number) => {
            return {
              name: index,
              value: x
            };
          })
        });

        // POPULATION RATE BOX PLOT
        populationPlotResult.push({
          name: `Population ${scenario}`,
          series: this.analysisResult.bestScenario[scenario]['population_size'].map((x: any, index: number) => {
            return {
              name: index,
              value: x
            };
          })
        });
      });

      this.bestScenarioEmployabilityPlotResult = employabilityPlotResult;
      this.bestScenarioHdiPlotResult = hdiPlotResult;
      this.bestScenarioPopulationPlotResult = populationPlotResult;
    }
  }

  getDistributionMetrics(arr: Array<number>) {
    let metrics = new Array<any>();

    const arraySorted = arr.sort((a, b) => a - b);
    const uniqueValues = [...new Set(arr)];
    const min = arraySorted[0];
    const max = arraySorted[arraySorted.length - 1];

    // Mean
    metrics.push({ metric: 'Mean', value: MathHelper.mean(arraySorted)?.toFixed(2) ?? '-' });
    // Median
    metrics.push({ metric: 'Median', value: MathHelper.median(arraySorted)?.toFixed(2) ?? '-' });
    // Std. Dev.
    // Min
    metrics.push({ metric: 'Min', value: min });
    // Max
    metrics.push({ metric: 'Max', value: max });
    // Range
    metrics.push({ metric: 'Range', value: max - min });
    // # of Scores
    metrics.push({ metric: '# of Values', value: arr.length });
    // # of Unique Scores
    metrics.push({ metric: '# of Unique Values', value: uniqueValues.length });

    return metrics;
  }

  getDistributionValueRange(arr: Array<number>, numberOfRange: number) {
    const rangeList: any[] = [];
    const arraySorted = arr.sort((a, b) => a - b);

    const arrayRounded = arraySorted.map(x => x > 0 ? Math.ceil(x) : Math.floor(x));

    const minValue = arrayRounded[0];
    const maxValue = arrayRounded[arrayRounded.length - 1];

    const breadth = maxValue - minValue;
    const intervalSize = parseFloat((breadth / numberOfRange).toFixed(2));

    if (intervalSize > 0) {
      for (let i = arrayRounded[0]; parseFloat(i.toFixed(2)) < arrayRounded[arrayRounded.length - 1]; i += intervalSize) {
        const nextValue = parseFloat((i + intervalSize).toFixed(2));

        rangeList.push({
          min: parseFloat(i.toFixed(2)),
          max: nextValue >= maxValue ? maxValue : nextValue,
        });
      }
    }

    return rangeList;
  }

  onIntervalSliderValueChange(event: MatSliderChange) {
    this.buildScenarioDistributionData();
  }
  //#endregion
  ////////////////////////////////////////////
}
