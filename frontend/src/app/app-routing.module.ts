import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CodeConductComponent,
  ContributorsComponent,
  DataSourceReferenceComponent,
  HomeComponent,
  InteractiveMapComponent,
  LicenseComponent,
  PageNotFoundComponent
} from './_pages';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  data: {
    seo: {
      title: 'Jobzi | Schools Connectivity',
      metaTags: [
        { name: 'description', content: 'With Unicef Innovation Fund and Giga Project our objective is to leverage the inclusion of young people to better education and more opportunities through internet connectivity, as the world is facing a learning crisis' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'Jobzi | Schools Connectivity' },
        { property: 'og:description', content: 'With Unicef Innovation Fund and Giga Project our objective is to leverage the inclusion of young people to better education and more opportunities through internet connectivity, as the world is facing a learning crisis' }
      ]
    }
  }
}, {
  path: 'interactive-map',
  component: InteractiveMapComponent,
  data: {
    seo: {
      title: 'Jobzi | Connectivity Map',
      metaTags: [
        { name: 'description', content: 'Search and filter locations to view connectivity statistics, internet availability prediction and its impact on employability' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'Jobzi | Connectivity Map' },
        { property: 'og:description', content: 'Search and filter locations to view connectivity statistics, internet availability prediction and its impact on employability' }
      ]
    }
  }
}, {
  path: 'data-source-reference',
  component: DataSourceReferenceComponent,
  data: {
    seo: {
      title: 'Jobzi | Data Source',
      metaTags: [
        { name: 'description', content: 'How We Got the Map Data' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI, data source' },
        { property: 'og:title', content: 'Jobzi | Data Source' },
        { property: 'og:description', content: 'How We Got the Map Data' }
      ]
    }
  }
}, {
  path: 'code-of-conduct',
  component: CodeConductComponent,
  data: {
    seo: {
      title: 'Jobzi | Code of Conduct',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - Connectivity tools code of conduct.' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI, conduct, code, tools' },
        { property: 'og:title', content: 'Jobzi | Code of Conduct' },
        { property: 'og:description', content: 'Jobzi | Unicef - Connectivity tools code of conduct.' }
      ]
    }
  }
}, {
  path: 'contributors',
  component: ContributorsComponent,
  data: {
    seo: {
      title: 'Jobzi | Contributors',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - Contribution Guidelines.' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI, contribution, code, tools' },
        { property: 'og:title', content: 'Jobzi | Contributiors' },
        { property: 'og:description', content: 'Jobzi | Unicef - Contribution Guidelines.' }
      ]
    }
  }
}, {
  path: 'license',
  component: LicenseComponent,
  data: {
    seo: {
      title: 'Jobzi | License',
      metaTags: [
        { name: 'description', content: 'Jobzi | Unicef - License.' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI, license, code, tools' },
        { property: 'og:title', content: 'Jobzi | License' },
        { property: 'og:description', content: 'Jobzi | Unicef - License.' }
      ]
    }
  }
}, {
  path: 'page-not-found',
  component: PageNotFoundComponent,
  data: {
    seo: {
      title: 'Jobzi | Page Not Found',
      metaTags: [
        { name: 'description', content: 'Sorry, the page you are looking for could not be found.' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'Jobzi | Page Not Found' },
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
      title: 'Jobzi | Page Not Found',
      metaTags: [
        { name: 'description', content: 'Sorry, the page you are looking for could not be found.' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, connectivity, machine learning, AI' },
        { property: 'og:title', content: 'Jobzi | Page Not Found' },
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
