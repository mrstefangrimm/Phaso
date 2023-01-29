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
  styleUrls: ['./isocal.component.css']
})
export class IsocalComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  private currentX1: number = 0
  private currentX2: number = 0
  private currentY1: number = 0
  private currentY2: number = 0
  private currrentCollRtn: number = 0
  private currrentGantryRtn: number = 0

  private shownAsXray: boolean = false

  constructor(
    public context: IsocalService,
    private readonly engine3d: IsocalEngine3dService) {
    console.info(IsocalComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(IsocalComponent.name, "ngOnInit")

    this.engine3d.createScene(this.rendererCanvas);
    this.engine3d.animate();

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(IsocalComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
  }

  onX1Changed(event) {
    console.debug(event.value)

    const traslation = (this.currentX1 - event.value) * 2.8
    this.engine3d.x1.translate(0, traslation, 0)

    this.currentX1 = event.value
  }

  onX2Changed(event) {
    console.debug(event.value)

    const traslation = (this.currentX2 - event.value) * -2.8
    this.engine3d.x2.translate(0, traslation, 0)

    this.currentX2 = event.value
  }

  onY1Changed(event) {
    console.debug(event.value)

    const traslation = (this.currentY1 - event.value) * -2.8
    this.engine3d.y1.translate(traslation, 0, 0)

    this.currentY1 = event.value
  }

  onY2Changed(event) {
    console.debug(event.value)

    const traslation = (this.currentY2 - event.value) * 2.8
    this.engine3d.y2.translate(traslation,0, 0)

    this.currentY2 = event.value
  }

  onCollRtnChanged(event) {
    console.debug(event.value)

    const rotation = (this.currrentCollRtn - event.value) / 18.5 / Math.PI

    this.engine3d.x1.rotateZ(rotation)
    this.engine3d.x2.rotateZ(rotation)
    this.engine3d.y1.rotateZ(rotation)
    this.engine3d.y2.rotateZ(rotation)

    this.currrentCollRtn = event.value
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
      const rotation = (this.currrentGantryRtn - event.value) / 18.5 / Math.PI

      this.engine3d.x1.rotateY(rotation)
      this.engine3d.x2.rotateY(rotation)
      this.engine3d.y1.rotateY(rotation)
      this.engine3d.y2.rotateY(rotation)
      this.engine3d.detector.rotateY(rotation)

      this.currrentGantryRtn = event.value
    }
  }

  onCouchLngChanged(event) {
    console.debug(event.value)

    const translation = event.value * 5

    this.engine3d.couch.translate(new Vector3(0, translation, 0))
    this.engine3d.drum.translate(new Vector3(0, translation, 0))
    this.engine3d.markers.translate(new Vector3(0, translation, 0))
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
