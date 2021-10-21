// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Observable, Subscription, timer } from "rxjs";
import { MotionSystemData, MotionSystemsService } from "../remote/motionsystems.service";

export class MotionsystemComponentBaseModel  {

  motionSystemId: number;

  inUseByMe: boolean = false
  inUseByOther: boolean = false
  synced: boolean = false
  state: UIState = UIState.DeviceNotReady

  refreshTimer: Observable<number> = timer(1000, 5000);
  refreshTimerSubscription: Subscription

  constructor(
    public remoteService: MotionSystemsService,
    public alias: string) { }

  initSystemStatusPullTimer(id: number) {
    this.refreshTimerSubscription = this.refreshTimer.subscribe(seconds => {

      this.remoteService.getMotionSystem(id).subscribe(
        result => {
          console.debug(result)
          this.updateStatus(result.data)
        }, err => console.error(err))
    })
  }

  updateStatus(data: MotionSystemData) {
    this.synced = data.synced
    if (this.state == UIState.DeviceNotReady && this.synced == true) {
      if (data.inUse) {
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
      if (data.inUse) {
        this.state = UIState.OtherInControl
        this.inUseByOther = true
      }
    }
    else if (this.state == UIState.OtherInControl && this.synced == true) {
      if (data.inUse == false) {
        this.state = UIState.NotInControl
        this.inUseByOther = false
      }
    }
  }

  onTakeControl() {
    if (this.state == UIState.NotInControl) {
      let data = new MotionSystemData
      data.inUse = true
      this.remoteService.patch(this.motionSystemId, data)
      this.inUseByMe = true
      this.state = UIState.InControl
    }
  }

  onLetControl() {
    if (this.state == UIState.InControl) {
      let data = new MotionSystemData
      data.inUse = false
      this.remoteService.patch(this.motionSystemId, data)
      this.inUseByMe = false
      this.state = UIState.NotInControl
    }
  }

}

const enum UIState {
  InControl,
  NotInControl,
  OtherInControl,
  DeviceNotReady
}

