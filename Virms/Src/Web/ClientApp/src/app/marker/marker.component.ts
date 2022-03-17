// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HostListener, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vector3 } from 'three';
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service';
import { MotionSystemData, MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service';
import { MarkerService } from './marker.service';
import { MarkerEngine3dService } from './markerengine3d.service';
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>

  leftUpperLng: number = 127
  leftUpperRtn: number = 127
  leftLowerLng: number = 127
  leftLowerRtn: number = 127
  rightUpperLng: number = 127
  rightUpperRtn: number = 127
  rightLowerLng: number = 127
  rightLowerRtn: number = 127
  gatingLng: number = 127
  gatingRtn: number = 127

  constructor(
    public context: MarkerService,
    public remoteService: MotionSystemsService,
    private readonly engine3d: MarkerEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService) {
    super(remoteService, 'GRIS5A')
    console.info(MarkerComponent.name, "c'tor")
  }

  ngOnInit(): void {
    console.info(MarkerComponent.name, "ngOnInit")

    this.engine3d.createScene(this.rendererCanvas);
    this.engine3d.animate();

    this.gatingEngine3d.createScene(this.gatingRendererCanvas);
    this.gatingEngine3d.animate();

    this.remoteService.getMotionSystemData(this.alias).subscribe(
      result => {
        console.info(result.id, result.data.alias, result.data.name)
        this.motionSystemId = result.id

        this.remoteService.getMotionSystem(this.motionSystemId).subscribe(
          result => {
            this.initSystemStatusPullTimer(this.motionSystemId)
            this.initLiveImageTimer("first-live.jpg")
          }, err => console.error(err))
      }, err => console.error(err))

    this.setVisibilies()   
  }

  ngOnDestroy() {
    console.info(MarkerComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.liveImgRefreshTimerSubscription.unsubscribe()
    this.statusRefreshTimerSubscription.unsubscribe()
    this.onLetControl()
  }

  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  WindowBeforeUnoad($event: any) {
    //$event.preventDefault()
    this.onLetControl()
  }

  override updateUI(data: MotionSystemData) {
    if (data.synced) {
      {
        this.leftUpperLng = data.axes[ServoNumber.LULNG].position
        let lng = (this.leftUpperLng - 127) / 10
        this.engine3d.cylinderLeftUpper.setLng(lng)
        this.engine3d.markerLeftUpper.setLng(lng)

        this.leftUpperRtn = data.axes[ServoNumber.LURTN].position
        let rtn = (this.leftUpperRtn - 127) / 100
        this.engine3d.cylinderLeftUpper.setRtn(rtn)
        this.engine3d.markerLeftUpper.setRtn(rtn)
      }
      {
        this.leftLowerLng = data.axes[ServoNumber.LLLNG].position
        let lng = (this.leftLowerLng - 127) / 10
        this.engine3d.cylinderLeftLower.setLng(lng)
        this.engine3d.markerLeftLower.setLng(lng)

        this.leftLowerRtn = data.axes[ServoNumber.LLRTN].position
        let rtn = (this.leftLowerRtn - 127) / 100
        this.engine3d.cylinderLeftLower.setRtn(rtn)
        this.engine3d.markerLeftLower.setRtn(rtn)
      }
      {
        this.rightUpperLng = data.axes[ServoNumber.RULNG].position
        let lng = (this.rightUpperLng - 127) / 10
        this.engine3d.cylinderRightUpper.setLng(lng)
        this.engine3d.markerRightUpper.setLng(lng)

        this.rightUpperRtn = data.axes[ServoNumber.RURTN].position
        let rtn = (this.rightUpperRtn - 127) / 100
        this.engine3d.cylinderRightUpper.setRtn(rtn)
        this.engine3d.markerRightUpper.setRtn(rtn)
      }
      {
        this.rightLowerLng = data.axes[ServoNumber.RLLNG].position
        let lng = (this.rightLowerLng - 127) / 10
        this.engine3d.cylinderRightLower.setLng(lng)
        this.engine3d.markerRightLower.setLng(lng)

        this.rightLowerRtn = data.axes[ServoNumber.RLRTN].position
        let rtn = (this.rightLowerRtn - 127) / 100
        this.engine3d.cylinderRightLower.setRtn(rtn)
        this.engine3d.markerRightLower.setRtn(rtn)
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

  onLeftUpperLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderLeftUpper.setLng(lng)
    this.engine3d.markerLeftUpper.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LULNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftUpperRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderLeftUpper.setRtn(rtn)
    this.engine3d.markerLeftUpper.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LURTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftLowerLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderLeftLower.setLng(lng)
    this.engine3d.markerLeftLower.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftLowerRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderLeftLower.setRtn(rtn)
    this.engine3d.markerLeftLower.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLRTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightUpperLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderRightUpper.setLng(lng)
    this.engine3d.markerRightUpper.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RULNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightUpperRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightUpper.setRtn(rtn)
    this.engine3d.markerRightUpper.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RURTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLowerLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderRightLower.setLng(lng)
    this.engine3d.markerRightLower.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLowerRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightLower.setRtn(rtn)
    this.engine3d.markerRightLower.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLRTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng * 2, 0))

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GALNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.gatingEngine3d.gatingPlatform.rotate(rtn, new Vector3(0, 0, 1))

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GARTN;
      servoPos.position = event.value;

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
