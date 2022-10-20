import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSourceReferenceComponent } from './_pages/data-source-reference/data-source-reference.component';
import { HomeComponent } from './_pages/home/home.component';
import { InteractiveMapComponent } from './_pages/interactive-map/interactive-map.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent,
  data: {
    seo: {
      title: 'Jobzi | Schools Connectivity',
      metaTags: [
        { name: 'description', content: 'Our solution implements a data-driven model based on machine learning techniques to predict connectivity in schools' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, conectivity, machine learning' },
        { property: 'og:title', content: 'Jobzi | Schools Connectivity' },
        { property: 'og:description', content: 'Our solution implements a data-driven model based on machine learning techniques to predict connectivity in schools' }
      ]
    }
  }
}, {
  path: '',
  component: InteractiveMapComponent,
  data: {
    seo: {
      title: 'Jobzi | Connectivity Map',
      metaTags: [
        { name: 'description', content: 'Search and filter locations to view connectivity statistics, internet availability prediction and its impact on employability' },
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, conectivity, machine learning' },
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
        { name: 'keywords', content: 'Jobzi, Unicef, schools, employability, conectivity, machine learning, data source' },
        { property: 'og:title', content: 'Jobzi | Data Source' },
        { property: 'og:description', content: 'How We Got the Map Data' }
      ]
    }
  }
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
