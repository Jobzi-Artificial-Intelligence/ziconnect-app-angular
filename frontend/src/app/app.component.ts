import { Component, Inject, OnInit } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from './_services';
import { filter, map } from 'rxjs/operators';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Jobzi - Schools Connectivity';

  constructor(@Inject(APP_BASE_HREF) public baseHref: string, private router: Router, private activatedRoute: ActivatedRoute, private seoService: SeoService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.registerCustomSvgIcons();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.activatedRoute)
    ).subscribe(route => {
      route.firstChild?.data.subscribe(data => {
        if (data && data['seo']) {
          let seoData = data['seo'];
          this.seoService.updateTitle(seoData['title']);
          this.seoService.updateMetaTags(seoData['metaTags']);
        }
      });
    });
  }

  registerCustomSvgIcons() {
    this.matIconRegistry.addSvgIcon('bitbucket', this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.baseHref}assets/icons/bitbucket.svg`));
    this.matIconRegistry.addSvgIcon('coding', this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.baseHref}assets/icons/coding.svg`));
    this.matIconRegistry.addSvgIcon('code-fork', this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.baseHref}assets/icons/code-fork.svg`));
  }
}
