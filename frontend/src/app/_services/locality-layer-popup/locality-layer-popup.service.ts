import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { LocalityLayerPopupComponent } from 'src/app/_components';
import { IMapInfoWindowContent } from 'src/app/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalityLayerPopupService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector) { }

  /**
   * Builds the referenced component so it can be injected into the 
   * leaflet map as popup.
   */
  public compilePopup(content: IMapInfoWindowContent): HTMLElement {
    // Create element
    const popup = document.createElement('app-locality-layer-popup');

    // Create the component and wire it up with the element
    const factory = this.componentFactoryResolver.resolveComponentFactory(LocalityLayerPopupComponent);
    const popupComponentRef = factory.create(this.injector, [], popup);

    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(popupComponentRef.hostView);

    // Set the message
    popupComponentRef.instance.content = content;

    // Return rendered Component
    return popup;
  }
}
