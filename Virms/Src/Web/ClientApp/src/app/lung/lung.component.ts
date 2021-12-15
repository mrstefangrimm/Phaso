// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vector3 } from 'three';
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service';
import { MotionSystemsService, ServoPosition } from '../shared/remote/motionsystems.service';
import { LungService } from './lung.service';
import { LungEngine3dService } from './lungengine3d.service';
import { MotionsystemComponentBaseModel } from '../shared/ui/motionsystemcomponentbase.model';

@Component({
  selector: 'app-lung',
  templateUrl: './lung.component.html',
  styleUrls: ['./lung.component.css']
})
export class LungComponent extends MotionsystemComponentBaseModel implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

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
              this.upperLng = result.data.axes[ServoNumber.UPLNG].position
              this.upperRtn = result.data.axes[ServoNumber.UPRTN].position
              this.lowerLng = result.data.axes[ServoNumber.LOLNG].position
              this.lowerRtn = result.data.axes[ServoNumber.LORTN].position
              this.gatingLng = result.data.axes[ServoNumber.GALNG].position
              this.gatingRtn = result.data.axes[ServoNumber.GARTN].position
              this.updateStatus(result.data)
            }
            this.initSystemStatusPullTimer(this.motionSystemId)
            this.initLiveImageTimer("third-live.jpg")
          }, err => console.error(err))
      }, err => console.error(err))

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(LungComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
    this.liveImgRefreshTimerSubscription.unsubscribe()
    this.statusRefreshTimerSubscription.unsubscribe()
    this.onLetControl()
  }

  onUpperLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.upperCylinder.setLng(lng)
    this.engine3d.target.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.UPLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onUpperRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.upperCylinder.setRtn(rtn)
    this.engine3d.target.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.UPRTN;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLowerLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.lowerCylinder.setLng(lng)
    this.engine3d.secondTarget.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LOLNG;
      servoPos.position = event.value;

      if (this.motionSystemId) this.remoteService.patchServoPositions(this.motionSystemId, [servoPos])
    }
  }

  onLowerRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.lowerCylinder.setRtn(rtn)
    this.engine3d.secondTarget.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LORTN;
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
