import { inject, TestBed } from "@angular/core/testing";
import { Meta, MetaDefinition, Title } from "@angular/platform-browser";
import { SeoService } from "./seo.service";

describe('SeoService', () => {
  let service: SeoService;

  const mockMeta = jasmine.createSpyObj(Meta, ['updateTag']);
  const mockTitle = jasmine.createSpyObj(Title, ['setTitle']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: Meta, useValue: mockMeta
      }, {
        provide: Title, useValue: mockTitle
      }]
    });

    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all function should exists', () => {
    expect(service.updateTitle).toBeDefined();
    expect(service.updateTitle).toEqual(jasmine.any(Function));
    expect(service.updateMetaTags).toBeDefined();
    expect(service.updateMetaTags).toEqual(jasmine.any(Function));
  });

  describe('Testing Functions', () => {

    it('updateTitle should works', () => {
      const title = 'Updated Title';

      service.updateTitle(title);

      //@ts-ignore
      expect(service.title.setTitle).toHaveBeenCalledWith(title);
    });

    it('updateMetaTags should works', (done: DoneFn) => {
      const metaTags = new Array<MetaDefinition>();

      metaTags.push({
        name: 'title',
        content: 'content'
      });

      service.updateMetaTags(metaTags);

      //@ts-ignore
      expect(service.meta.updateTag).toHaveBeenCalledWith(metaTags[0]);
      done();
    });
  });
});