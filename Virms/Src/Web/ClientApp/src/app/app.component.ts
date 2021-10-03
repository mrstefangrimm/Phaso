// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  sideNavOpen: boolean
  markerPhantomActive: boolean = true
  liverPhantomActive: boolean
  lungPhantomActive: boolean

  onMarkerPhantomClicked() {
    console.info(AppComponent.name, "onMarkerPhantomClicked")
    this.markerPhantomActive = true
    this.liverPhantomActive = false
    this.lungPhantomActive = false
    this.sideNavOpen = false
  }

  onLiverPhantomClicked() {
    console.info(AppComponent.name, "onLiverPhantomClicked")
    this.markerPhantomActive = false
    this.liverPhantomActive = true
    this.lungPhantomActive = false
    this.sideNavOpen = false
  }

  onLungPhantomClicked() {
    console.info(AppComponent.name, "onLungPhantomClicked")
    this.markerPhantomActive = false
    this.liverPhantomActive = false
    this.lungPhantomActive = true
    this.sideNavOpen = false
  }

}
