// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Vector3 } from 'three';
import { GatingEngine3dService } from '../shared/services/gatingengine3d.service';
import { ServoPosition } from '../shared/services/motionsystems.service';
import { MarkerEngine3dService } from './markerengine3d.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('gatingRendererCanvas', { static: true })
  gatingRendererCanvas: ElementRef<HTMLCanvasElement>;

  sideNavOpen: boolean = true
  controlsExpanded: boolean = true
  automaticControlsEnabled: boolean = false
  visiblitiesOpen: boolean

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

  inUseByMe: boolean = false
  inUseByOther: boolean = false
  synced: boolean = false
  state: UIState = UIState.DeviceNotReady

  constructor(
    private readonly engine3d: MarkerEngine3dService,
    private readonly gatingEngine3d: GatingEngine3dService) {
    console.info(MarkerComponent.name, "c'tor")
  }

  ngOnInit(): void {
    console.info(MarkerComponent.name, "ngOnInit")

    this.engine3d.createScene(this.rendererCanvas);
    this.engine3d.animate();

    this.gatingEngine3d.createScene(this.gatingRendererCanvas);
    this.gatingEngine3d.animate();

    //this.phantomService.updateData().subscribe(
    //  result => {
    //    if (result.synced) {
    //      this.leftLng = result.axes[ServoNumber.LLNG].position
    //      this.leftRtn = result.axes[ServoNumber.LRTN].position
    //      this.rightLng = result.axes[ServoNumber.RLNG].position
    //      this.rightRtn = result.axes[ServoNumber.RRTN].position
    //      this.gatingLng = result.axes[ServoNumber.GALNG].position
    //      this.gatingRtn = result.axes[ServoNumber.GARTN].position
    //    }
    //  }, err => console.error(err))
  }

  ngOnDestroy() {
    console.info(MarkerComponent.name, "ngOnDestroy")
    //if (this.executingPatternId != undefined) {
    //  this.onStopPattern()
    //}
    //this.onLetControl()

    this.engine3d.ngOnDestroy()
    this.gatingEngine3d.ngOnDestroy()
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

      // this.phantomService.patchPhantom([servoPos])
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

      //this.phantomService.patchPhantom([servoPos])
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

      // this.phantomService.patchPhantom([servoPos])
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

      //this.phantomService.patchPhantom([servoPos])
    }
  }

  onRightUpperLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderRightUpper.setLng(lng)
    this.engine3d.markerRightUpper.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LULNG;
      servoPos.position = event.value;

      // this.phantomService.patchPhantom([servoPos])
    }
  }

  onRightUpperRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightUpper.setRtn(rtn)
    this.engine3d.markerRightUpper.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LURTN;
      servoPos.position = event.value;

      //this.phantomService.patchPhantom([servoPos])
    }
  }

  onRightLowerLngChanged(event) {
    console.debug(event.value)

    let lng = (event.value - 127) / 10
    this.engine3d.cylinderRightLower.setLng(lng)
    this.engine3d.markerRightLower.setLng(lng)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LULNG;
      servoPos.position = event.value;

      // this.phantomService.patchPhantom([servoPos])
    }
  }

  onRightLowerRtnChanged(event) {
    console.debug(event.value)

    let rtn = (event.value - 127) / 100
    this.engine3d.cylinderRightLower.setRtn(rtn)
    this.engine3d.markerRightLower.setRtn(rtn)

    if (this.inUseByMe) {
      let servoPos = new ServoPosition
      servoPos.servoNumber = ServoNumber.LURTN;
      servoPos.position = event.value;

      //this.phantomService.patchPhantom([servoPos])
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

      //this.phantomService.patchPhantom([servoPos])
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

      //this.phantomService.patchPhantom([servoPos])
    }
  }

  onXrayChecked(checked: boolean) {
    this.engine3d.setXray(checked)
  }

  onBodyChecked(checked: boolean) {
    this.engine3d.body.setVisible(checked)
  }

  onCylindersChecked(checked: boolean) {
    this.engine3d.cylinderLeftUpper.setVisible(checked)
    this.engine3d.cylinderLeftLower.setVisible(checked)
    this.engine3d.cylinderRightUpper.setVisible(checked)
    this.engine3d.cylinderRightLower.setVisible(checked)
  }

  onMarkersChecked(checked: boolean) {
    this.engine3d.markerLeftUpper.setVisible(checked)
    this.engine3d.markerLeftLower.setVisible(checked)
    this.engine3d.markerRightUpper.setVisible(checked)
    this.engine3d.markerRightLower.setVisible(checked)
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

const enum UIState {
  InControl,
  NotInControl,
  OtherInControl,
  DeviceNotReady
}

