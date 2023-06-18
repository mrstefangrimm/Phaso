// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ViewChild } from '@angular/core'
import { ElementRef } from '@angular/core'
import { Vector3 } from 'three'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { IsocalService } from './isocal.service'
import { IsocalEngine3dService } from './isocalengine3d.service'

@Component({
  selector: 'app-isocal',
  templateUrl: './isocal.component.html',
  styleUrls: ['./isocal.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class IsocalComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  rendererWidth: number
  rendererHeight: number

  private shownAsXray = false

  constructor(
    public context: IsocalService,
    private readonly engine3d: IsocalEngine3dService) {
    console.info(IsocalComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(IsocalComponent.name, "ngOnInit")

    console.debug(IsocalComponent.name, window.innerWidth, window.innerHeight)
    const sideNavSpace = this.context.sideNavOpen ? 220 : 150
    const w = Math.max(250, window.innerWidth - sideNavSpace)
    const h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h

    this.engine3d.createScene(this.rendererCanvas, w, h)
    this.engine3d.animate()

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(IsocalComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
  }

  onResize(event) {
    console.debug(IsocalComponent.name, "onResize", event.target.innerWidth, event.target.innerHeight)
    event.target.innerWidth

    const sideNavSpace = this.context.sideNavOpen ? 220 : 150
    const w = Math.max(250, window.innerWidth - sideNavSpace)
    const h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h
  }

  onSideNavChanged() {
    console.info(IsocalComponent.name, "onSideNavChanged")

    this.context.sideNavOpen = !this.context.sideNavOpen

    const sideNavSpace = this.context.sideNavOpen ? 220 : 150
    const w = Math.max(250, window.innerWidth - sideNavSpace)
    const h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h

    this.engine3d.setSize(w, h)
  }

  onX1Changed(event) {
    console.debug(event.value)

    const pos = event.value * 110 / 37
    this.engine3d.x1.setPosZ(pos)
  }

  onX2Changed(event) {
    console.debug(event.value)

    const pos = event.value * 110 / 37
    this.engine3d.x2.setPosZ(-pos)
  }

  onY1Changed(event) {
    console.debug(event.value)

    const pos = event.value * 110 / 37
    this.engine3d.y1.setPosX(pos)
  }

  onY2Changed(event) {
    console.debug(event.value)

    const pos = event.value * 110 / 37
    this.engine3d.y2.setPosX(-pos)
  }

  onCollRtnChanged(event) {
    console.debug(event.value)

    const rtn = event.value / 180 * Math.PI
    this.engine3d.x1.setRtnY(rtn)
    this.engine3d.x2.setRtnY(rtn)
    this.engine3d.y1.setRtnY(rtn)
    this.engine3d.y2.setRtnY(rtn)
  }

  onGantryRtnChanged(event) {
    console.debug(event.value)

    if (this.shownAsXray) {
      const rotation = event.value / 18.5 / Math.PI
      const axis = new Vector3(0, 1, 0)

      this.engine3d.drum.rotate(rotation, axis)
      this.engine3d.markers.rotate(rotation, axis)
      this.engine3d.couch.rotate(rotation, axis)
    }
    else {
      const rtn = event.value / 180 * Math.PI
      this.engine3d.detector.setRtnZ(rtn)
      this.engine3d.x1.setRtnZ(rtn)
      this.engine3d.x2.setRtnZ(rtn)
      this.engine3d.y1.setRtnZ(rtn)
      this.engine3d.y2.setRtnZ(rtn)
    }
  }

  onCouchLngChanged(event) {
    console.debug(event.value)

    const translation = event.value * 5

    this.engine3d.couch.setLng(-translation)
    this.engine3d.drum.setLng(-translation)
    this.engine3d.markers.setLng(-translation)
  }

  onXrayChecked(checked: boolean) {
    this.shownAsXray = checked

    this.engine3d.setXray(checked)
    this.context.showAsXray = checked
  }

  private setVisibilies() {
    this.engine3d.setXray(this.context.showAsXray)
  }

}
