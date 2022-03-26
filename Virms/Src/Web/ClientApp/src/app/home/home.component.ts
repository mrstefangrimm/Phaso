// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sideNavOpen: boolean
  markerPhantomActive: boolean
  liverPhantomActive: boolean
  lungPhantomActive: boolean
  lnrActuatorActive: boolean

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
    console.info(HomeComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(HomeComponent.name, "ngOnInit")
    // Paths do not work on github.io
    //if (this.router.url == '/a') {
    //  this.onMarkerPhantomClicked()
    //}
    //else if (this.router.url == '/b') {
    //  this.onLiverPhantomClicked()
    //}
    //else if (this.router.url == '/c') {
    //  this.onLungPhantomClicked()
    //}
    //else if (this.router.url == '/d') {
    //  this.onLnrActuatorClicked()
    //}
    //this.route.params.subscribe(params => {
    //  console.info(HomeComponent.name, "Parameter", params.motionSystem)
    //  if (params.motionSystem == 'markerphantom') {
    //    this.onMarkerPhantomClicked()
    //  }
    //  else if (params.motionSystem == 'liverphantom') {
    //    this.onLiverPhantomClicked()
    //  }
    //  else if (params.motionSystem == 'lungphantom') {
    //    this.onLungPhantomClicked()
    //  }
    //  else if (params.motionSystem == 'lnractuatorrev4') {
    //    this.onLnrActuatorClicked()
    //  }
    //}, error => console.error(error))
  }

  showHome(): boolean {
    return !this.markerPhantomActive && !this.liverPhantomActive && !this.lungPhantomActive && !this.lnrActuatorActive
  }

  onMarkerPhantomClicked() {
    console.info(HomeComponent.name, "onMarkerPhantomClicked")
    this.markerPhantomActive = true
    this.liverPhantomActive = false
    this.lungPhantomActive = false
    this.lnrActuatorActive = false
    this.sideNavOpen = false
  }

  onLiverPhantomClicked() {
    console.info(HomeComponent.name, "onLiverPhantomClicked")
    this.markerPhantomActive = false
    this.liverPhantomActive = true
    this.lungPhantomActive = false
    this.lnrActuatorActive = false
    this.sideNavOpen = false
  }

  onLungPhantomClicked() {
    console.info(HomeComponent.name, "onLungPhantomClicked")
    this.markerPhantomActive = false
    this.liverPhantomActive = false
    this.lungPhantomActive = true
    this.lnrActuatorActive = false
    this.sideNavOpen = false
  }

  onLnrActuatorClicked() {
    console.info(HomeComponent.name, "onLnrActuatorClicked")
    this.markerPhantomActive = false
    this.liverPhantomActive = false
    this.lungPhantomActive = false
    this.lnrActuatorActive = true
    this.sideNavOpen = false
  }  
}
