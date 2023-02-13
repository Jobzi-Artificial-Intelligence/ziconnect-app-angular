import { Component, Input, OnInit } from '@angular/core';
import { IMapInfoWindowContent } from 'src/app/_interfaces';

@Component({
  selector: 'app-locality-layer-popup',
  templateUrl: './locality-layer-popup.component.html',
  styleUrls: ['./locality-layer-popup.component.scss']
})
export class LocalityLayerPopupComponent {
  @Input() content: IMapInfoWindowContent = <IMapInfoWindowContent>{};

  constructor() { }
}
