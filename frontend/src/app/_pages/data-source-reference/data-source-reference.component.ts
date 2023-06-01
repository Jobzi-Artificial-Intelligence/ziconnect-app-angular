import { Component, OnInit } from '@angular/core';

interface ISourceReferenceItem {
  color: string;
  name: string;
  description: string;
  fullName: string;
  image: string;
  references: Array<any>;
  url: string;

  opacity: number;
  degrees: number;
}

@Component({
  selector: 'app-data-source-reference',
  templateUrl: './data-source-reference.component.html',
  styleUrls: ['./data-source-reference.component.scss']
})
export class DataSourceReferenceComponent implements OnInit {
  private _maxDegrees = 180;

  public sourceItems = [{
    color: '#4c67aa',
    description: 'We use geographic data from regions, states and municipalities provided by the institute and also Geo Json files generated in intermediate quality to include geographic elements in the map view. In addition to data from CEMPRE (CENTRAL REGISTER OF COMPANIES in loose translation), an electronic form filled out annually by Legal Entities in Brazil. Among other information, companies are required to declare all people employed in any time period of that year. This report is later grouped in different ways such as by sector and/or location and made publicly available.',
    name: 'IBGE',
    fullName: 'Instituto Brasileiro de Geografia e Estatística',
    image: 'assets/img/sources/logo_ibge.png',
    url: 'https://www.ibge.gov.br/',
    references: [{
      description: 'Geographic API',
      url: 'https://servicodados.ibge.gov.br/api/docs/malhas?versao=3'
    }, {
      description: 'CEMPRE',
      url: 'https://www.ibge.gov.br/estatisticas/economicas/comercio/9016-estatisticas-do-cadastro-central-de-empresas.html?=&t=downloads'
    }],
    opacity: 0,
    degrees: 0
  }, {
    color: '#8dc03f',
    description: 'We used school performance data from basic education in addition to microdata from the school census of basic education.',
    name: 'INEP',
    fullName: 'Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira',
    image: 'assets/img/sources/logo_inep.png',
    url: 'https://www.gov.br/inep',
    references: [{
      description: 'Basic education performance',
      url: 'https://basedosdados.org/dataset/br-inep-ideb?bdm_table=escola'
    }, {
      description: 'School census microdata',
      url: 'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar'
    }],
    opacity: 0,
    degrees: 0
  }, {
    color: '#fabb2a',
    description: 'INEP data source website',
    name: 'gov.br',
    fullName: 'Serviços e Informações do Brasil',
    image: 'assets/img/sources/logo_govbr.png',
    url: 'https://www.gov.br',
    opacity: 0,
    degrees: 0
  }, {
    color: '#277AFF',
    description: 'Provided connectivity data for schools in Brazil.',
    name: 'Giga - Unicef',
    fullName: 'Giga - Unicef',
    image: 'assets/img/sources/logo_giga.png',
    url: 'https://giga.global',
    opacity: 0,
    degrees: 0
  }] as ISourceReferenceItem[];

  constructor() { }

  ngOnInit(): void {
    this._initInfographicAnimation();
  }

  private _initInfographicAnimation() {
    const bubbleCount = this.sourceItems.length;
    const degreeStep = this._maxDegrees / (bubbleCount - 1);

    setTimeout(() => {
      this.sourceItems.forEach((sourceItem, index) => {
        const degrees = degreeStep * index;

        sourceItem.degrees = degrees;
        sourceItem.opacity = 1;
      });
    }, 100);
  }
}
