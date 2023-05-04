import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AnalysisToolComponent,
  CodeConductComponent,
  ContributorsComponent,
  DataSourceReferenceComponent,
  HomeComponent,
  InteractiveOsmMapComponent,
  LicenseComponent,
  PageNotFoundComponent
} from './_pages';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  data: {
    seo: {
      title: 'ZiConnect | AI for education towards employability',
      metaTags: [
        { name: 'description', content: 'With Unicef Innovation Fund and Giga Project our objective is to leverage the inclusion of young people to better education and more opportunities through internet connectivity, as the world is facing a learning crisis' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'ZiConnect | AI for education towards employability' },
        { property: 'og:description', content: 'With Unicef Innovation Fund and Giga Project our objective is to leverage the inclusion of young people to better education and more opportunities through internet connectivity, as the world is facing a learning crisis' }
      ]
    }
  }
}, {
  path: 'analysis-tool',
  component: AnalysisToolComponent,
  data: {
    seo: {
      title: 'ZiConnect | Analysis Tool',
      metaTags: [
        { name: 'description', content: 'Make your own analysis, use our models, visualize the results and also download them.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'ZiConnect | Analysis Tool' },
        { property: 'og:description', content: 'Make your own analysis, use our models, visualize the results and also download them.' }
      ]
    }
  }
}, {
  path: 'interactive-map',
  component: InteractiveOsmMapComponent,
  data: {
    seo: {
      title: 'ZiConnect | Connectivity Map',
      metaTags: [
        { name: 'description', content: 'Search and filter locations to view connectivity statistics, internet availability prediction and its impact on employability' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'ZiConnect | Connectivity Map' },
        { property: 'og:description', content: 'Search and filter locations to view connectivity statistics, internet availability prediction and its impact on employability' }
      ]
    }
  }
}, {
  path: 'data-source-reference',
  component: DataSourceReferenceComponent,
  data: {
    seo: {
      title: 'ZiConnect | Data Source',
      metaTags: [
        { name: 'description', content: 'How We Got the Map Data' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI, data source' },
        { property: 'og:title', content: 'ZiConnect | Data Source' },
        { property: 'og:description', content: 'How We Got the Map Data' }
      ]
    }
  }
}, {
  path: 'code-of-conduct',
  component: CodeConductComponent,
  data: {
    seo: {
      title: 'ZiConnect | Code of Conduct',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - Connectivity tools code of conduct.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI, conduct, code, tools' },
        { property: 'og:title', content: 'ZiConnect | Code of Conduct' },
        { property: 'og:description', content: 'Jobzi | Unicef - Connectivity tools code of conduct.' }
      ]
    }
  }
}, {
  path: 'contributors',
  component: ContributorsComponent,
  data: {
    seo: {
      title: 'ZiConnect | Contributors',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - Contribution Guidelines.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI, contribution, code, tools' },
        { property: 'og:title', content: 'ZiConnect | Contributiors' },
        { property: 'og:description', content: 'Jobzi | Unicef - Contribution Guidelines.' }
      ]
    }
  }
}, {
  path: 'license',
  component: LicenseComponent,
  data: {
    seo: {
      title: 'ZiConnect | License',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - License.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI, license, code, tools' },
        { property: 'og:title', content: 'ZiConnect | License' },
        { property: 'og:description', content: 'Jobzi | Unicef - License.' }
      ]
    }
  }
}, {
  path: 'page-not-found',
  component: PageNotFoundComponent,
  data: {
    seo: {
      title: 'ZiConnect | Page Not Found',
      metaTags: [
        { name: 'description', content: 'Sorry, the page you are looking for could not be found.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'ZiConnect | Page Not Found' },
        { property: 'og:description', content: 'Sorry, the page you are looking for could not be found.' }
      ]
    }
  }
}, {
  //Wild Card Route for 404 request
  path: '**',
  component: PageNotFoundComponent,
  data: {
    seo: {
      title: 'ZiConnect | Page Not Found',
      metaTags: [
        { name: 'description', content: 'Sorry, the page you are looking for could not be found.' },
        { name: 'keywords', content: 'Jobzi, Unicef, ZiConnect, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'ZiConnect | Page Not Found' },
        { property: 'og:description', content: 'Sorry, the page you are looking for could not be found.' }
      ]
    }
  }
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    scrollOffset: [0, 0],
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
