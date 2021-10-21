// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vector3 } from 'three';
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service';
import { MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service';
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
  rendererCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>;

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
            if (this.synced) {
              this.leftUpperLng = result.data.axes[ServoNumber.LULNG].position
              this.leftUpperRtn = result.data.axes[ServoNumber.LURTN].position
              this.leftLowerLng = result.data.axes[ServoNumber.LLLNG].position
              this.leftLowerRtn = result.data.axes[ServoNumber.LLRTN].position
              this.rightUpperLng = result.data.axes[ServoNumber.RULNG].position
              this.rightUpperRtn = result.data.axes[ServoNumber.RURTN].position
              this.rightLowerLng = result.data.axes[ServoNumber.RLLNG].position
              this.rightLowerRtn = result.data.axes[ServoNumber.RLRTN].position
              this.gatingLng = result.data.axes[ServoNumber.GALNG].position
              this.gatingRtn = result.data.axes[ServoNumber.GARTN].position
              this.updateStatus(result.data)
            }
            this.initSystemStatusPullTimer(this.motionSystemId)
          }, err => console.error(err))
      }, err => console.error(err))

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(MarkerComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.refreshTimerSubscription.unsubscribe()
    this.onLetControl()
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
      servoPos.servoNumber = ServoNumber.LULNG;
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
      servoPos.servoNumber = ServoNumber.LURTN;
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
