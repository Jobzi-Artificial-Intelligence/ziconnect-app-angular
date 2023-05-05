import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { AnalysisType } from 'src/app/_helpers';
import { IAnalysisEventTrackParams } from 'src/app/_interfaces/analysis-event-track-params';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  gaAnalysisEventTrack(params: IAnalysisEventTrackParams) {
    this.gaEventTrack(params.eventName, {
      analysis_type: params.analysisType ? AnalysisType[params.analysisType] : null,
      analysis_task_id: params.analysisTaskId,
      analysis_connectivity_threshold_a: params.analysisConnectivityThresholdA,
      analysis_connectivity_threshold_b: params.analysisConnectivityThresholdB,
      analysis_municipality_threshold: params.analysisMunicipalitiesThreshold
    })
  }

  gaEventTrack(eventName: string, eventParams: any) {
    if ((<any>window).gtag) {
      (<any>window).gtag('event', eventName, eventParams ?? {});
    }
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTags(metaTags: MetaDefinition[]) {
    if (metaTags !== null && metaTags.length > 0) {
      metaTags.forEach(m => {
        this.meta.updateTag(m)
      });
    }
  }
}
