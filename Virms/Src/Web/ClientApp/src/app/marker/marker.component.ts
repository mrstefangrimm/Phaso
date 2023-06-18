// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core'
import { Vector3 } from 'three'
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service'
import { MotionPatternResponse, MotionSystemData, MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service'
import { MarkerService } from './marker.service'
import { MarkerEngine3dService } from './markerengine3d.service'
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model'

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MarkerComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  rendererWidth: number
  rendererHeight: number

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>

  selectedPatternId: number
  executingPatternId: number

  leftUpperLng = 127
  leftUpperRtn = 127
  leftLowerLng = 127
  leftLowerRtn = 127
  rightUpperLng = 127
  rightUpperRtn = 127
  rightLowerLng = 127
  rightLowerRtn = 127
  gatingLng = 127
  gatingRtn = 127

  constructor(
    public context: MarkerService,
    public remoteService: MotionSystemsService,
    private readonly engine3d: MarkerEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService) {
    super(remoteService, 'GRIS5A')
    console.info(MarkerComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(MarkerComponent.name, "ngOnInit")

    console.debug(MarkerComponent.name, window.innerWidth, window.innerHeight)
    const sideNavSpace = this.context.sideNavOpen ? 390 : 140
    const dim = Math.max(250, Math.min(window.innerWidth - sideNavSpace, window.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim

    this.engine3d.createScene(this.rendererCanvas, dim, dim)
    this.engine3d.animate()

    this.gatingEngine3d.createScene(this.gatingRendererCanvas)
    this.gatingEngine3d.animate()

    this.onInit("first-live.jpg")
    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(MarkerComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.onDestroy()
  }

  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  WindowBeforeUnoad($event: any) {
    //$event.preventDefault()
    this.onDestroy()
  }

  onResize(event) {
    console.debug(MarkerComponent.name, "onResize", event.target.innerWidth, event.target.innerHeight)
    event.target.innerWidth

    const sideNavSpace = this.context.sideNavOpen ? 390 : 140
    const dim = Math.max(250, Math.min(event.target.innerWidth - sideNavSpace, event.target.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim
  }

  onSideNavChanged() {
    console.info(MarkerComponent.name, "onSideNavChanged")

    this.context.sideNavOpen = !this.context.sideNavOpen

    const sideNavSpace = this.context.sideNavOpen ? 390 : 140
    const dim = Math.max(250, Math.min(window.innerWidth - sideNavSpace, window.innerHeight - 100))
    this.rendererWidth = dim
    this.rendererHeight = dim

    this.engine3d.setSize(dim, dim)
  }

  override updateUI(data: MotionSystemData) {
    if (this.synced && (this.inUseByMe || this.inUseByOther)) {
      {
        this.leftUpperLng = data.axes[ServoNumber.LULNG].position
        const lng = (this.leftUpperLng - 127) / 10
        this.engine3d.cylinderLeftUpper.setPosZ(lng)
        this.engine3d.markerLeftUpper.setPosZ(lng)

        this.leftUpperRtn = data.axes[ServoNumber.LURTN].position
        const rtn = (this.leftUpperRtn - 127) / 100
        this.engine3d.cylinderLeftUpper.setRtnZ(rtn)
        this.engine3d.markerLeftUpper.setRtnZ(rtn)
      }
      {
        this.leftLowerLng = data.axes[ServoNumber.LLLNG].position
        const lng = (this.leftLowerLng - 127) / 10
        this.engine3d.cylinderLeftLower.setPosZ(lng)
        this.engine3d.markerLeftLower.setPosZ(lng)

        this.leftLowerRtn = data.axes[ServoNumber.LLRTN].position
        const rtn = (this.leftLowerRtn - 127) / 100
        this.engine3d.cylinderLeftLower.setRtnZ(rtn)
        this.engine3d.markerLeftLower.setRtnZ(rtn)
      }
      {
        this.rightUpperLng = data.axes[ServoNumber.RULNG].position
        const lng = (this.rightUpperLng - 127) / 10
        this.engine3d.cylinderRightUpper.setPosZ(lng)
        this.engine3d.markerRightUpper.setPosZ(lng)

        this.rightUpperRtn = data.axes[ServoNumber.RURTN].position
        const rtn = (this.rightUpperRtn - 127) / 100
        this.engine3d.cylinderRightUpper.setRtnZ(rtn)
        this.engine3d.markerRightUpper.setRtnZ(rtn)
      }
      {
        this.rightLowerLng = data.axes[ServoNumber.RLLNG].position
        const lng = (this.rightLowerLng - 127) / 10
        this.engine3d.cylinderRightLower.setPosZ(lng)
        this.engine3d.markerRightLower.setPosZ(lng)

        this.rightLowerRtn = data.axes[ServoNumber.RLRTN].position
        const rtn = (this.rightLowerRtn - 127) / 100
        this.engine3d.cylinderRightLower.setRtnZ(rtn)
        this.engine3d.markerRightLower.setRtnZ(rtn)
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
    console.info(MarkerComponent.name, "onStartPattern", "selected pattern:", this.selectedPatternId)
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
    console.info(MarkerComponent.name, "onStopPattern", "executing pattern:", this.executingPatternId)
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

  onLeftUpperLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderLeftUpper.setPosZ(lng)
    this.engine3d.markerLeftUpper.setPosZ(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LULNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftUpperRtnChanged(event) {
    const rtn = (event.value - 127) / 100
    this.engine3d.cylinderLeftUpper.setRtnZ(rtn)
    this.engine3d.markerLeftUpper.setRtnZ(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LURTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftLowerLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderLeftLower.setPosZ(lng)
    this.engine3d.markerLeftLower.setPosZ(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftLowerRtnChanged(event) {
    const rtn = (event.value - 127) / 100
    this.engine3d.cylinderLeftLower.setRtnZ(rtn)
    this.engine3d.markerLeftLower.setRtnZ(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLRTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightUpperLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderRightUpper.setPosZ(lng)
    this.engine3d.markerRightUpper.setPosZ(lng)
    //this.engine3d.target.setLng(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RULNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightUpperRtnChanged(event) {
    const rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightUpper.setRtnZ(rtn)
    this.engine3d.markerRightUpper.setRtnZ(rtn)
    //this.engine3d.target.setRtn(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RURTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLowerLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.engine3d.cylinderRightLower.setPosZ(lng)
    this.engine3d.markerRightLower.setPosZ(lng)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLLNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLowerRtnChanged(event) {
    const rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightLower.setRtnZ(rtn)
    this.engine3d.markerRightLower.setRtnZ(rtn)

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLRTN
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingLngChanged(event) {
    const lng = (event.value - 127) / 10
    this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng * 2, 0))

    if (this.inUseByMe) {
      const servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GALNG
      servoPos.position = event.value

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingRtnChanged(event) {
    const rtn = (event.value - 127) / 100
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
    this.context.showBody = checked
}

  onCylindersChecked(checked: boolean) {
    this.engine3d.cylinderLeftUpper.setVisible(checked)
    this.engine3d.cylinderLeftLower.setVisible(checked)
    this.engine3d.cylinderRightUpper.setVisible(checked)
    this.engine3d.cylinderRightLower.setVisible(checked)
    this.context.showCylinders = checked
 }

  onMarkersChecked(checked: boolean) {
    this.engine3d.markerLeftUpper.setVisible(checked)
    this.engine3d.markerLeftLower.setVisible(checked)
    this.engine3d.markerRightUpper.setVisible(checked)
    this.engine3d.markerRightLower.setVisible(checked)
    this.context.showMarkers = checked
 }

  private setVisibilies() {
    this.engine3d.setXray(this.context.showAsXray)
    this.engine3d.body.setVisible(this.context.showBody)
    this.engine3d.cylinderLeftUpper.setVisible(this.context.showCylinders)
    this.engine3d.cylinderLeftLower.setVisible(this.context.showCylinders)
    this.engine3d.cylinderRightUpper.setVisible(this.context.showCylinders)
    this.engine3d.cylinderRightLower.setVisible(this.context.showCylinders)
    this.engine3d.markerLeftUpper.setVisible(this.context.showMarkers)
    this.engine3d.markerLeftLower.setVisible(this.context.showMarkers)
    this.engine3d.markerRightUpper.setVisible(this.context.showMarkers)
    this.engine3d.markerRightLower.setVisible(this.context.showMarkers)
  }

}

const enum ServoNumber {
  LURTN = 0,
  LULNG,
  LLRTN,
  LLLNG,
  RLLNG,
  RLRTN,
  RULNG,
  RURTN,
  GALNG,
  GARTN
}
