import { LocalityMap } from '../locality-map/locality-map.model';
import { LocalityStatistics } from './locality-statistics.model';
import { localityStatisticsFromServer } from '../../../test/locality-statistics-mock';
import { analysisResultFromServer } from '../../../test/analysis-result';

describe('Model: LocalityStatistics', () => {
  it('should initialize all properties correctly', () => {
    const localityStatistics = new LocalityStatistics();

    expect(localityStatistics.id).toEqual(0);
    expect(localityStatistics.localityMap).toBeDefined();
    expect(localityStatistics.localityMap instanceof LocalityMap).toBeTrue();

    expect(localityStatistics.municipalitiesCount).toEqual(0);
    expect(localityStatistics.regionsCount).toEqual(0);
    expect(localityStatistics.statesCount).toEqual(0);
    expect(localityStatistics.schoolCount).toEqual(0);
    expect(localityStatistics.studentCount).toEqual(0);

    expect(localityStatistics.schoolInternetAvailabilityCount).toEqual(0);
    expect(localityStatistics.schoolInternetAvailabilityPercentage).toEqual(0);
    expect(localityStatistics.schoolInternetAvailabilityPredicitionCount).toEqual(0);
    expect(localityStatistics.schoolInternetAvailabilityPredicitionPercentage).toEqual(0);
    expect(localityStatistics.schoolWithoutInternetAvailabilityCount).toEqual(0);
    expect(localityStatistics.schoolWithoutInternetAvailabilityPercentage).toEqual(0);

    expect(localityStatistics.internetAvailabilityByValue).toBeDefined();
    expect(localityStatistics.internetAvailabilityBySchoolRegion).toBeDefined();
    expect(localityStatistics.internetAvailabilityBySchoolType).toBeDefined();

    expect(localityStatistics.internetAvailabilityPredictionByValue).toBeDefined();
    expect(localityStatistics.internetAvailabilityPredictionBySchoolRegion).toBeDefined();
    expect(localityStatistics.internetAvailabilityPredictionBySchoolType).toBeDefined();
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const localityStatistics = new LocalityStatistics();

      expect(localityStatistics.deserialize).toBeTruthy();
      expect(localityStatistics.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const localityStatisticsItemFromServer = localityStatisticsFromServer[0];
      const localityStatistics = new LocalityStatistics().deserialize(localityStatisticsItemFromServer);

      const localityMap = new LocalityMap().deserialize(localityStatisticsItemFromServer.locality_map);

      expect(localityStatistics.id).toEqual(localityStatisticsItemFromServer.id);
      expect(localityStatistics.localityMap).toBeDefined();
      expect(localityStatistics.localityMap).toEqual(localityMap);

      expect(localityStatistics.municipalitiesCount).toEqual(localityStatisticsItemFromServer.municipality_count);
      expect(localityStatistics.regionsCount).toEqual(localityStatisticsItemFromServer.region_count);
      expect(localityStatistics.statesCount).toEqual(localityStatisticsItemFromServer.state_count);
      expect(localityStatistics.schoolCount).toEqual(localityStatisticsItemFromServer.school_count);
      expect(localityStatistics.studentCount).toEqual(localityStatisticsItemFromServer.student_count);

      expect(localityStatistics.schoolInternetAvailabilityCount).toEqual(localityStatisticsItemFromServer.connected_count);
      expect(localityStatistics.schoolInternetAvailabilityPercentage).toEqual(Math.round(localityStatisticsItemFromServer.connected_percentage));
      expect(localityStatistics.schoolInternetAvailabilityPredicitionCount).toEqual(localityStatisticsItemFromServer.internet_availability_prediction_count);
      expect(localityStatistics.schoolInternetAvailabilityPredicitionPercentage).toEqual(Math.round(localityStatisticsItemFromServer.internet_availability_prediction_percentage));
      expect(localityStatistics.schoolWithoutInternetAvailabilityCount).toEqual(localityStatisticsItemFromServer.internet_availability_null_count);
      expect(localityStatistics.schoolWithoutInternetAvailabilityPercentage).toEqual(Math.round(localityStatisticsItemFromServer.internet_availability_null_percentage));

      expect(localityStatistics.internetAvailabilityByValue).toBeDefined();
      expect(localityStatistics.internetAvailabilityBySchoolRegion).toBeDefined();
      expect(localityStatistics.internetAvailabilityBySchoolType).toBeDefined();

      expect(localityStatistics.internetAvailabilityPredictionByValue).toBeDefined();
      expect(localityStatistics.internetAvailabilityPredictionBySchoolRegion).toBeDefined();
      expect(localityStatistics.internetAvailabilityPredictionBySchoolType).toBeDefined();
    });
  });

  describe('#deserializeFromAnalysisResult', () => {
    it('should exists', () => {
      const localityStatistics = new LocalityStatistics();

      expect(localityStatistics.deserializeFromAnalysisResult).toBeTruthy();
      expect(localityStatistics.deserializeFromAnalysisResult).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const result_summary = analysisResultFromServer.result_summary[0] as any;

      const localityStatistics = new LocalityStatistics().deserializeFromAnalysisResult(result_summary);

      expect(localityStatistics.id).toBeUndefined();
      expect(localityStatistics.localityMap).toBeDefined();

      expect(localityStatistics.municipalitiesCount).toEqual(result_summary.municipality_count);
      expect(localityStatistics.regionsCount).toBeUndefined();
      expect(localityStatistics.statesCount).toEqual(result_summary.state_count);
      expect(localityStatistics.schoolCount).toEqual(result_summary.school_count);
      expect(localityStatistics.studentCount).toEqual(result_summary.student_count);

      expect(localityStatistics.internetAvailabilityByValue).toBeDefined();
      expect(localityStatistics.internetAvailabilityBySchoolRegion).toBeDefined();
      expect(localityStatistics.internetAvailabilityBySchoolType).toBeDefined();

      expect(localityStatistics.internetAvailabilityPredictionByValue).toBeDefined();
      expect(localityStatistics.internetAvailabilityPredictionBySchoolRegion).toBeDefined();
      expect(localityStatistics.internetAvailabilityPredictionBySchoolType).toBeDefined();
    });
  });
});