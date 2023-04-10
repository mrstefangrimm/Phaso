// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core'
import { Vector3 } from 'three'
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service'
import { MotionPatternResponse, MotionSystemData, MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service'
import { LungService } from './lung.service'
import { LungEngine3dService } from './lungengine3d.service'
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model'

@Component({
  selector: 'app-lung',
  templateUrl: './lung.component.html',
  styleUrls: ['./lung.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class LungComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  rendererWidth: number
  rendererHeight: number

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>

  selectedPatternId: number
  executingPatternId: number

  upperLng: number = 127
  upperRtn: number = 127
  lowerLng: number = 127
  lowerRtn: number = 127
  gatingLng: number = 127
  gatingRtn: number = 127

  constructor(
    public context: LungService,
    public remoteService: MotionSystemsService,
    private readonly engine3d: LungEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService) {
    super(remoteService, 'NO3')
    console.info(LungComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(LungComponent.name, "ngOnInit")

    console.debug(LungComponent.name, window.innerWidth, window.innerHeight)
    var dim = Math.max(250, Math.min(window.innerWidth - 235, window.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim

    this.engine3d.createScene(this.rendererCanvas, dim, dim)
    this.engine3d.animate()

    this.gatingEngine3d.createScene(this.gatingRendererCanvas)
    this.gatingEngine3d.animate()

    this.onInit("third-live.jpg")
    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(LungComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.onDestroy()
  }

  onResize(event) {
    console.info(LungComponent.name, "onResize", event.target.innerWidth, event.target.innerHeight)
    event.target.innerWidth;

    var dim = Math.max(250, Math.min(event.target.innerWidth - 235, event.target.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim
  }

  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  WindowBeforeUnoad($event: any) {
    //$event.preventDefault()
    this.onDestroy()
  }

  override updateUI(data: MotionSystemData) {
    if (this.synced && (this.inUseByMe || this.inUseByOther)) {
      {
        this.upperLng = data.axes[ServoNumber.UPLNG].position
        let lng = (this.upperLng - 127) / 10
        this.engine3d.upperCylinder.setLng(lng)
        this.engine3d.target.setLng(lng)

        this.upperRtn = data.axes[ServoNumber.UPRTN].position
        let rtn = (this.upperRtn - 127) / 100
        this.engine3d.upperCylinder.setRtn(rtn)
        this.engine3d.target.setRtn(rtn)
      }
      {
        this.lowerLng = data.axes[ServoNumber.LOLNG].position
        let lng = (this.lowerLng - 127) / 10
        this.engine3d.lowerCylinder.setLng(lng)
        this.engine3d.secondTarget.setLng(lng)

        this.lowerRtn = data.axes[ServoNumber.LORTN].position
        let rtn = (this.lowerRtn - 127) / 100
        this.engine3d.lowerCylinder.setRtn(rtn)
        this.engine3d.secondTarget.setRtn(rtn)
      }
      {
        this.gatingLng = data.axes[ServoNumber.GALNG].position
        let lng = (this.gatingLng - 127) / 10
        this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng * 2, 0))

        this.gatingRtn = data.axes[ServoNumber.GARTN].position
        let rtn = (this.gatingRtn - 127) / 100
        this.gatingEngine3d.gatingPlatform.rotate(rtn, new Vector3(0, 0, 1))
      }
    }
  }

  onStartPattern() {
    console.info(LungComponent.name, "onStartPattern", "selected pattern:", this.selectedPatternId)
    if (this.inUseByMe) {
      let mp: MotionPatternResponse = this.patterns.find(x => x.id = this.selectedPatternId)
      if (mp != undefined) {
        mp.data.executing = true
        this.remoteService.patchMotionPattern(this.motionSystemId, this.selectedPatternId, mp.data).subscribe(
          result => {
            console.debug(result)
            this.executingPatternId = this.selectedPatternId
          }, err => console.error(err))
      }
    }
  }

  onStopPattern() {
    console.info(LungComponent.name, "onStopPattern", "executing pattern:", this.executingPatternId)
    let temp = this.executingPatternId
    this.executingPatternId = undefined
    if (this.inUseByMe) {
      let mp: MotionPatternResponse = this.patterns.find(x => x.id = temp)
      if (mp != undefined) {
        mp.data.executing = false
        this.remoteService.patchMotionPattern(this.motionSystemId, this.selectedPatternId, mp.data).subscribe(
          result => {
            console.debug(result)
          }, err => console.error(err))
      }
    }
  }

  onUpperLngChanged(event) {
    let lng = (event.value - 127) / 10
    this.engine3d.upperCylinder.setLng(lng)
    this.engine3d.target.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.UPLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onUpperRtnChanged(event) {
    let rtn = (event.value - 127) / 100
    this.engine3d.upperCylinder.setRtn(rtn)
    this.engine3d.target.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.UPRTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLowerLngChanged(event) {
    let lng = (event.value - 127) / 10
    this.engine3d.lowerCylinder.setLng(lng)
    this.engine3d.secondTarget.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LOLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLowerRtnChanged(event) {
    let rtn = (event.value - 127) / 100
    this.engine3d.lowerCylinder.setRtn(rtn)
    this.engine3d.secondTarget.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LORTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingLngChanged(event) {
    let lng = (event.value - 127) / 10
    this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng * 2, 0))

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GALNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingRtnChanged(event) {
    let rtn = (event.value - 127) / 100
    this.gatingEngine3d.gatingPlatform.rotate(rtn, new Vector3(0, 0, 1))

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GARTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onXrayChecked(checked: boolean) {
    this.engine3d.setXray(checked)
    this.context.showAsXray = checked
  }

  onChestChecked(checked: boolean) {
    this.engine3d.chest.setVisible(checked)
    this.engine3d.lungLeftInsert.setVisible(checked)
    this.engine3d.skeleton.setVisible(checked)
    this.context.showChest = checked
  }

  onRightLungChecked(checked: boolean) {
    this.engine3d.lungRight.setVisible(checked)
    this.context.showRightLung = checked
  }

  onLeftLungChecked(checked: boolean) {
    this.engine3d.lungLeft.setVisible(checked)
    this.engine3d.upperCylinder.setVisible(checked)
    this.engine3d.lowerCylinder.setVisible(checked)
    this.context.showLeftLung = checked
  }

  onTargetsChecked(checked: boolean) {
    this.engine3d.target.setVisible(checked)
    this.engine3d.secondTarget.setVisible(checked)
    this.context.showTargets = checked
  }

  private setVisibilies() {
    this.engine3d.setXray(this.context.showAsXray)
    this.engine3d.chest.setVisible(this.context.showChest)
    this.engine3d.lungLeftInsert.setVisible(this.context.showChest)
    this.engine3d.skeleton.setVisible(this.context.showChest)
    this.engine3d.lungRight.setVisible(this.context.showRightLung)
    this.engine3d.lungLeft.setVisible(this.context.showLeftLung)
    this.engine3d.upperCylinder.setVisible(this.context.showLeftLung)
    this.engine3d.lowerCylinder.setVisible(this.context.showLeftLung)
    this.engine3d.target.setVisible(this.context.showTargets)
    this.engine3d.secondTarget.setVisible(this.context.showTargets)
  }

}

const enum ServoNumber {
  LORTN = 0,
  UPRTN,
  GARTN,
  LOLNG,
  UPLNG,
  GALNG
}
