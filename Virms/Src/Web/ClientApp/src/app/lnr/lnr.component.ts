// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ViewChild } from '@angular/core'
import { ElementRef } from '@angular/core'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Vector3 } from 'three'
import { LnrService } from './lnr.service'
import { LnrEngine3dService } from './lnrengine3d.service'

@Component({
  selector: 'app-lnr',
  templateUrl: './lnr.component.html',
  styleUrls: ['./lnr.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class LnrComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  rendererWidth: number
  rendererHeight: number

  constructor(
    public context: LnrService,
    private readonly engine3d: LnrEngine3dService) {
    console.info(LnrComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(LnrComponent.name, "ngOnInit")

    console.debug(LnrComponent.name, window.innerWidth, window.innerHeight)
    var sideNavSpace = this.context.sideNavOpen ? 220 : 150
    var w = Math.max(250, window.innerWidth - sideNavSpace)
    var h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h

    this.engine3d.createScene(this.rendererCanvas, w, h)
    this.engine3d.animate()

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(LnrComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
  }

  onResize(event) {
    console.debug(LnrComponent.name, "onResize", event.target.innerWidth, event.target.innerHeight)
    event.target.innerWidth;

    var sideNavSpace = this.context.sideNavOpen ? 220 : 150
    var w = Math.max(250, window.innerWidth - sideNavSpace)
    var h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h
  }

  onSideNavChanged() {
    console.info(LnrComponent.name, "onSideNavChanged")

    this.context.sideNavOpen = !this.context.sideNavOpen

    var sideNavSpace = this.context.sideNavOpen ? 220 : 150
    var w = Math.max(250, window.innerWidth - sideNavSpace)
    var h = Math.max(250, window.innerHeight - 100)
    this.rendererWidth = w
    this.rendererHeight = h

    this.engine3d.setSize(w, h)
  }

  onLngChanged(event) {
    console.debug(event.value)

    let alpha = event.value / 255 * Math.PI

    const magicNum = -49.2
    const magicAng = 0.307
    const c2 = 52 * 52
    let x = Math.sin(alpha) * 26
    let a = x - 10.13
    let b = Math.sqrt(c2 - a * a)
    let lng = magicNum + b + Math.cos(alpha) * -26
    let beta = magicAng - Math.asin(a / 52)

    this.engine3d.groupCarriageBlue.setLng(lng)
    this.engine3d.groupCarriageSilver.setLng(lng)
    this.engine3d.groupCarriageGold.setLng(lng)
    this.engine3d.groupCarriageAnthracite.setLng(lng)
    this.engine3d.groupRotationWhite.setLng(lng)
    this.engine3d.groupRotationWood.setLng(lng)
    this.engine3d.groupRotationBlue.setLng(lng)
    this.engine3d.groupRotationSilver.setLng(lng)
    this.engine3d.groupExtensionArm.setLng(lng)

    let rtnServoArm = (event.value - 127) / 80
    this.engine3d.groupServoArmGold.rotate(-rtnServoArm, new Vector3(0, 0, 1))
    this.engine3d.groupServoArmSilver.rotate(-rtnServoArm, new Vector3(0, 0, 1))
    this.engine3d.groupServoArmAnthracite.rotate(-rtnServoArm, new Vector3(0, 0, 1))
    this.engine3d.groupServoArmBlue.rotate(-rtnServoArm, new Vector3(0, 0, 1))

    this.engine3d.groupExtensionArm.rotate(beta, new Vector3(0, 0, 1))
  }

  onRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 80
    this.engine3d.groupRotationWhite.setRtn(rtn)
    this.engine3d.groupRotationWood.setRtn(rtn)
    this.engine3d.groupRotationBlue.setRtn(rtn)
    this.engine3d.groupRotationSilver.setRtn(rtn)
  }

  onTransparentChecked(checked: boolean) {
    this.engine3d.setTransparent(checked)
    this.context.showAsTransparent = checked
  }

  onCoverChecked(checked: boolean) {
    this.engine3d.groupStaticCoverBlue.setVisible(checked)
    this.engine3d.groupStaticCoverSilver.setVisible(checked)
    this.context.showCover = checked
  }

  private setVisibilies() {
    this.engine3d.setTransparent(this.context.showAsTransparent)
    this.engine3d.groupStaticCoverBlue.setVisible(this.context.showCover)
    this.engine3d.groupStaticCoverSilver.setVisible(this.context.showCover)
  }

}
