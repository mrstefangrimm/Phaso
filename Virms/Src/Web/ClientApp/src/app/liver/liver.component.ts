// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { Observable } from 'rxjs';
import { Vector3 } from 'three';
import { MotionPatternResponse, MotionSystemData, ServoPosition } from '../shared/services/motionsystems.service';
import { GatingEngine3dService } from '../shared/services/gatingengine3d.service';
import { LiverEngine3dService } from './liverengine3d.service';
import { LiverPhantomService } from './liverphantom.service';
import { LiverService } from './liver.service';

@Component({
  selector: 'app-liver',
  templateUrl: './liver.component.html',
  styleUrls: ['./liver.component.css']
})
export class LiverComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>;

  selectedPatternId: number
  executingPatternId: number

  leftLng: number = 127
  leftRtn: number = 127
  rightLng: number = 127
  rightRtn: number = 127
  gatingLng: number = 127
  gatingRtn: number = 127

  inUseByMe: boolean = false
  inUseByOther: boolean = false
  synced: boolean = false
  state: UIState = UIState.DeviceNotReady

  private refreshTimer: Observable<number> = timer(0, 5000);

  constructor(
    public context: LiverService,
    private readonly engine3d: LiverEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService,
    private readonly phantomService: LiverPhantomService) {
    console.info(LiverComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(LiverComponent.name, "ngOnInit")

    this.engine3d.createScene(this.rendererCanvas);
    this.engine3d.animate();

    this.gatingEngine3d.createScene(this.gatingRendererCanvas);
    this.gatingEngine3d.animate();

    this.setVisibilies()

    this.phantomService.updateData().subscribe(
      result => {
        if (result.synced) {
          this.leftLng = result.axes[ServoNumber.LLNG].position
          this.leftRtn = result.axes[ServoNumber.LRTN].position
          this.rightLng = result.axes[ServoNumber.RLNG].position
          this.rightRtn = result.axes[ServoNumber.RRTN].position
          this.gatingLng = result.axes[ServoNumber.GALNG].position
          this.gatingRtn = result.axes[ServoNumber.GARTN].position
        }
      }, err => console.error(err))

    this.refreshTimer.subscribe(seconds => {
      // In control, the connection is not checked. if an action is not successful on the device, the state goes in notready.
      if (this.state != UIState.InControl) {
        this.phantomService.updateData().subscribe(
          result => {
            this.synced = result.synced
            if (this.state == UIState.DeviceNotReady && this.synced == true) {
              if (result.inUse) {
                this.state = UIState.OtherInControl
                this.inUseByOther = true
              }
              else {
                this.state = UIState.NotInControl
                this.inUseByOther = false
              }
            }
            else if ((this.state == UIState.NotInControl || this.state == UIState.OtherInControl) && this.synced == false) {
              this.state = UIState.DeviceNotReady
              this.inUseByOther = false
            }
            else if (this.state == UIState.NotInControl && this.synced == true) {
              if (result.inUse) {
                this.state = UIState.OtherInControl
                this.inUseByOther = true
              }
            }
            else if (this.state == UIState.OtherInControl && this.synced == true) {
              if (result.inUse == false) {
                this.state = UIState.NotInControl
                this.inUseByOther = false
              }
            }
          },
          err => {
            console.error(err)
            this.state = UIState.DeviceNotReady
          })
      }
    })
  }

  ngOnDestroy() {
    console.info(LiverComponent.name, "ngOnDestroy")
    if (this.executingPatternId != undefined) {
      this.onStopPattern()
    }
    this.onLetControl()

    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
  }

  patterns(): MotionPatternResponse[] { return this.phantomService.patterns }

  onStartPattern() {
    console.info(this.selectedPatternId)
    this.phantomService.startPattern(this.selectedPatternId)
    this.executingPatternId = this.selectedPatternId
  }

  onStopPattern() {
    this.phantomService.stopPattern(this.selectedPatternId).subscribe(
      result => {
        this.executingPatternId = undefined

        this.leftLng = result.axes[ServoNumber.LLNG].position
        this.leftRtn = result.axes[ServoNumber.LRTN].position
        this.rightLng = result.axes[ServoNumber.RLNG].position
        this.rightRtn = result.axes[ServoNumber.RRTN].position
        this.gatingLng = result.axes[ServoNumber.GALNG].position
        this.gatingRtn = result.axes[ServoNumber.GARTN].position

        console.info(this.gatingLng)
      }, err => console.error(err))
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

      this.phantomService.patchPhantom([servoPos])
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

      this.phantomService.patchPhantom([servoPos])
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

      this.phantomService.patchPhantom([servoPos])
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

      this.phantomService.patchPhantom([servoPos])
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

      this.phantomService.patchPhantom([servoPos])
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

      this.phantomService.patchPhantom([servoPos])
    }
  }

  onTakeControl() {
    if (this.state == UIState.NotInControl) {
      let data = new MotionSystemData
      data.inUse = true
      this.phantomService.patch(data)
      this.inUseByMe = true
      this.state = UIState.InControl
    }
  }

  onLetControl() {
    if (this.state == UIState.InControl) {
      let data = new MotionSystemData
      data.inUse = false
      this.phantomService.patch(data)
      this.inUseByMe = false
      this.state = UIState.NotInControl
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

const enum UIState {
  InControl,
  NotInControl,
  OtherInControl,
  DeviceNotReady
}
