// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core'
import { Vector3 } from 'three'
import { MotionPatternResponse, MotionSystemData, MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service'
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service'
import { LiverEngine3dService } from './liverengine3d.service'
import { LiverService } from './liver.service'
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model'

@Component({
  selector: 'app-liver',
  templateUrl: './liver.component.html',
  styleUrls: ['./liver.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class LiverComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  rendererWidth: number
  rendererHeight: number

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>

  selectedPatternId: number
  executingPatternId: number

  leftLng = 127
  leftRtn = 127
  rightLng = 127
  rightRtn = 127
  gatingLng = 127
  gatingRtn = 127

  constructor(
    public context: LiverService,
    public remoteService: MotionSystemsService,
    private readonly engine3d: LiverEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService) {
    super(remoteService, 'NO2')
    console.info(LiverComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(LiverComponent.name, "ngOnInit")

    console.debug(LiverComponent.name, window.innerWidth, window.innerHeight)
    const sideNavSpace = this.context.sideNavOpen ? 235 : 140
    const dim = Math.max(250, Math.min(window.innerWidth - sideNavSpace, window.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim

    this.engine3d.createScene(this.rendererCanvas, dim, dim)
    this.engine3d.animate()

    this.gatingEngine3d.createScene(this.gatingRendererCanvas)
    this.gatingEngine3d.animate()

    this.onInit("second-live.jpg")
    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(LiverComponent.name, "ngOnDestroy")
    if (this.executingPatternId != undefined) {
      this.onStopPattern()
    }
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.onDestroy()
  }

  onResize(event) {
    console.debug(LiverComponent.name, "onResize", event.target.innerWidth, event.target.innerHeight)
    event.target.innerWidth

    const sideNavSpace = this.context.sideNavOpen ? 235 : 140
    const dim = Math.max(250, Math.min(event.target.innerWidth - sideNavSpace, event.target.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim
  }

  onSideNavChanged() {
    console.info(LiverComponent.name, "onSideNavChanged")

    this.context.sideNavOpen = !this.context.sideNavOpen

    const sideNavSpace = this.context.sideNavOpen ? 235 : 140
    const dim = Math.max(250, Math.min(window.innerWidth - sideNavSpace, window.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim

    this.engine3d.setSize(dim, dim)
  }

  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  WindowBeforeUnoad($event) {
    //$event.preventDefault()
    this.onDestroy()
  }

  override updateUI(data: MotionSystemData) {
    if (this.synced && (this.inUseByMe || this.inUseByOther)) {
      {
        this.leftLng = data.axes[ServoNumber.LLNG].position
        const lng = (this.leftLng - 127) / 10
        this.engine3d.cylinderLeft.setLng(lng)
        this.engine3d.cylinderLeftCylinder.setLng(lng)
        this.engine3d.cylinderLeftInsertCenter.setLng(lng)
        this.engine3d.cylinderLeftInsertBack.setLng(lng)
        this.engine3d.cylinderLeftMarkers.setLng(lng)

        this.leftRtn = data.axes[ServoNumber.LRTN].position
        const rtn = (this.leftRtn - 127) / 100
        this.engine3d.cylinderLeft.setRtn(rtn)
        this.engine3d.cylinderLeftCylinder.setRtn(rtn)
        this.engine3d.cylinderLeftInsertCenter.setRtn(rtn)
        this.engine3d.cylinderLeftInsertBack.setRtn(rtn)
        this.engine3d.cylinderLeftMarkers.setRtn(rtn)
      }
      {
        this.rightLng = data.axes[ServoNumber.RLNG].position
        const lng = (this.rightLng - 127) / 10
        this.engine3d.cylinderRight.setLng(lng)
        this.engine3d.cylinderRightCylinderCenter.setLng(lng)
        this.engine3d.cylinderRightCylinderBack.setLng(lng)
        this.engine3d.cylinderRightInsertCenter.setLng(lng)
        this.engine3d.cylinderRightInsertBack.setLng(lng)

        this.rightRtn = data.axes[ServoNumber.RRTN].position
        const rtn = (this.rightRtn - 127) / 100
        this.engine3d.cylinderRight.setRtn(rtn)
        this.engine3d.cylinderRightCylinderCenter.setRtn(rtn)
        this.engine3d.cylinderRightCylinderBack.setRtn(rtn)
        this.engine3d.cylinderRightInsertCenter.setRtn(rtn)
        this.engine3d.cylinderRightInsertBack.setRtn(rtn)
      }
      {
        this.gatingLng = data.axes[ServoNumber.GALNG].position
        const lng = (this.gatingLng - 127) / 10
        this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng * 2, 0))

        this.gatingRtn = data.axes[ServoNumber.GARTN].position
        const rtn = (this.gatingRtn - 127) / 100
        this.gatingEngine3d.gatingPlatform.rotate(rtn, new Vector3(0, 0, 1))
      }
    }
  }

  onStartPattern() {
    console.info(LiverComponent.name, "onStartPattern", "selected pattern:", this.selectedPatternId)
    if (this.inUseByMe) {
      const mp: MotionPatternResponse = this.patterns.find(x => x.id = this.selectedPatternId)
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
    console.info(LiverComponent.name, "onStopPattern", "executing pattern:", this.executingPatternId)
    const temp = this.executingPatternId
    this.executingPatternId = undefined
    if (this.inUseByMe) {
      const mp: MotionPatternResponse = this.patterns.find(x => x.id = temp)
      if (mp != undefined) {
        mp.data.executing = false
        this.remoteService.patchMotionPattern(this.motionSystemId, this.selectedPatternId, mp.data).subscribe(
          result => {
            console.debug(result)
          }, err => console.error(err))
      }
    }
  }

  onLeftLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderLeft.setLng(lng)
    this.engine3d.cylinderLeftCylinder.setLng(lng)
    this.engine3d.cylinderLeftInsertCenter.setLng(lng)
    this.engine3d.cylinderLeftInsertBack.setLng(lng)
    this.engine3d.cylinderLeftMarkers.setLng(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftRtnChanged(event) {
    const rtn = (127 - event.value) / 100
    this.engine3d.cylinderLeft.setRtn(rtn)
    this.engine3d.cylinderLeftCylinder.setRtn(rtn)
    this.engine3d.cylinderLeftInsertCenter.setRtn(rtn)
    this.engine3d.cylinderLeftInsertBack.setRtn(rtn)
    this.engine3d.cylinderLeftMarkers.setRtn(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LRTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderRight.setLng(lng)
    this.engine3d.cylinderRightCylinderCenter.setLng(lng)
    this.engine3d.cylinderRightCylinderBack.setLng(lng)
    this.engine3d.cylinderRightInsertCenter.setLng(lng)
    this.engine3d.cylinderRightInsertBack.setLng(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightRtnChanged(event) {
    const rtn = (127 - event.value) / 100
    this.engine3d.cylinderRight.setRtn(rtn)
    this.engine3d.cylinderRightCylinderCenter.setRtn(rtn)
    this.engine3d.cylinderRightCylinderBack.setRtn(rtn)
    this.engine3d.cylinderRightInsertCenter.setRtn(rtn)
    this.engine3d.cylinderRightInsertBack.setRtn(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RRTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng*2, 0))

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GALNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingRtnChanged(event) {
    const rtn = (event.value -127) / 100
    this.gatingEngine3d.gatingPlatform.rotate(rtn, new Vector3(0, 0, 1))

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GARTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onXrayChecked(checked: boolean) {
    this.engine3d.setXray(checked)
    this.context.showAsXray = checked
  }

  onBodyChecked(checked: boolean) {
    this.engine3d.body.setVisible(checked)
    this.engine3d.bodyInsertCenter.setVisible(checked)
    this.engine3d.bodyInsertBack.setVisible(checked)
    this.context.showBody = checked
}

  onLeftCylinderChecked(checked: boolean) {
    this.engine3d.cylinderLeft.setVisible(checked)
    this.engine3d.cylinderLeftCylinder.setVisible(checked)
    this.engine3d.cylinderLeftInsertCenter.setVisible(checked)
    this.engine3d.cylinderLeftInsertBack.setVisible(checked)
    this.context.showLeftCylinder = checked
  }

  onRightCylinderChecked(checked: boolean) {
    this.engine3d.cylinderRight.setVisible(checked)
    this.engine3d.cylinderRightCylinderCenter.setVisible(checked)
    this.engine3d.cylinderRightCylinderBack.setVisible(checked)
    this.engine3d.cylinderRightInsertCenter.setVisible(checked)
    this.engine3d.cylinderRightInsertBack.setVisible(checked)
    this.context.showRightCylinder = checked
  }

  onMarkersChecked(checked: boolean) {
    this.engine3d.cylinderLeftMarkers.setVisible(checked)
    this.context.showMarkers = true
  }

  private setVisibilies() {
    this.engine3d.setXray(this.context.showAsXray)
    this.engine3d.body.setVisible(this.context.showBody)
    this.engine3d.bodyInsertCenter.setVisible(this.context.showBody)
    this.engine3d.bodyInsertBack.setVisible(this.context.showBody)
    this.engine3d.cylinderLeft.setVisible(this.context.showLeftCylinder)
    this.engine3d.cylinderLeftCylinder.setVisible(this.context.showLeftCylinder)
    this.engine3d.cylinderLeftInsertCenter.setVisible(this.context.showLeftCylinder)
    this.engine3d.cylinderLeftInsertBack.setVisible(this.context.showLeftCylinder)
    this.engine3d.cylinderRight.setVisible(this.context.showRightCylinder)
    this.engine3d.cylinderRightCylinderCenter.setVisible(this.context.showRightCylinder)
    this.engine3d.cylinderRightCylinderBack.setVisible(this.context.showRightCylinder)
    this.engine3d.cylinderRightInsertCenter.setVisible(this.context.showRightCylinder)
    this.engine3d.cylinderRightInsertBack.setVisible(this.context.showRightCylinder)
    this.engine3d.cylinderLeftMarkers.setVisible(this.context.showMarkers)
  }
}

const enum ServoNumber {
  LLNG = 0,
  RLNG,
  GALNG,
  LRTN,
  RRTN,
  GARTN
}
