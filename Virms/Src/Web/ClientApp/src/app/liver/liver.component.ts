// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Vector3 } from 'three';
import { MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service';
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service';
import { LiverEngine3dService } from './liverengine3d.service';
import { LiverService } from './liver.service';
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model';

@Component({
  selector: 'app-liver',
  templateUrl: './liver.component.html',
  styleUrls: ['./liver.component.css']
})
export class LiverComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>

  selectedPatternId: number
  executingPatternId: number

  leftLng: number = 127
  leftRtn: number = 127
  rightLng: number = 127
  rightRtn: number = 127
  gatingLng: number = 127
  gatingRtn: number = 127

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
              this.leftLng = result.data.axes[ServoNumber.LLNG].position
              this.leftRtn = result.data.axes[ServoNumber.LRTN].position
              this.rightLng = result.data.axes[ServoNumber.RLNG].position
              this.rightRtn = result.data.axes[ServoNumber.RRTN].position
              this.gatingLng = result.data.axes[ServoNumber.GALNG].position
              this.gatingRtn = result.data.axes[ServoNumber.GARTN].position
              this.updateStatus(result.data)
            }
            this.initSystemStatusPullTimer(this.motionSystemId)
            this.initLiveImageTimer("second-live.jpg")
          }, err => console.error(err))
      }, err => console.error(err))

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(LiverComponent.name, "ngOnDestroy")
    if (this.executingPatternId != undefined) {
      this.onStopPattern()
    }
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.liveImgRefreshTimerSubscription.unsubscribe()
    this.statusRefreshTimerSubscription.unsubscribe()
    this.onLetControl()
  }

  //patterns(): MotionPatternResponse[] { return this.remoteService.patterns }

  onStartPattern() {
  //  console.info(this.selectedPatternId)
  //  this.phantomService.startPattern(this.selectedPatternId)
  //  this.executingPatternId = this.selectedPatternId
  }

  onStopPattern() {
//    this.phantomService.stopPattern(this.selectedPatternId).subscribe(
//      result => {
//        this.executingPatternId = undefined

//        this.leftLng = result.axes[ServoNumber.LLNG].position
//        this.leftRtn = result.axes[ServoNumber.LRTN].position
//        this.rightLng = result.axes[ServoNumber.RLNG].position
//        this.rightRtn = result.axes[ServoNumber.RRTN].position
//        this.gatingLng = result.axes[ServoNumber.GALNG].position
//        this.gatingRtn = result.axes[ServoNumber.GARTN].position

//        console.info(this.gatingLng)
//      }, err => console.error(err))
}

  onLeftLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderLeft.setLng(lng)
    this.engine3d.cylinderLeftCylinder.setLng(lng)
    this.engine3d.cylinderLeftInsertCenter.setLng(lng)
    this.engine3d.cylinderLeftInsertBack.setLng(lng)
    this.engine3d.cylinderLeftMarkers.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLeftRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value -127) / 100
    this.engine3d.cylinderLeft.setRtn(rtn)
    this.engine3d.cylinderLeftCylinder.setRtn(rtn)
    this.engine3d.cylinderLeftInsertCenter.setRtn(rtn)
    this.engine3d.cylinderLeftInsertBack.setRtn(rtn)
    this.engine3d.cylinderLeftMarkers.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LRTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderRight.setLng(lng)
    this.engine3d.cylinderRightCylinderCenter.setLng(lng)
    this.engine3d.cylinderRightCylinderBack.setLng(lng)
    this.engine3d.cylinderRightInsertCenter.setLng(lng)
    this.engine3d.cylinderRightInsertBack.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onRightRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderRight.setRtn(rtn)
    this.engine3d.cylinderRightCylinderCenter.setRtn(rtn)
    this.engine3d.cylinderRightCylinderBack.setRtn(rtn)
    this.engine3d.cylinderRightInsertCenter.setRtn(rtn)
    this.engine3d.cylinderRightInsertBack.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.RRTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.gatingEngine3d.gatingPlatform.translate(new Vector3(0, lng*2, 0))

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.GALNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onGatingRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value -127) / 100
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
