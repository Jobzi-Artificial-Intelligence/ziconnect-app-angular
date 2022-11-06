import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  selectedMenuItem: string = '';
  submenuOpened = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSubmenuContainer(menuItem: string | null, opened: boolean | null) {
    if (this.selectedMenuItem === menuItem) {
      this.submenuOpened = !this.submenuOpened;
    } else if (menuItem !== null) {
      this.selectedMenuItem = menuItem;
      this.submenuOpened = true;
    } else {
      this.selectedMenuItem = menuItem ?? '';
      this.submenuOpened = opened !== null ? opened : !this.submenuOpened;
    }
  }
}
