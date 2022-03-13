// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Observable, Subscription, timer } from "rxjs"
import { MotionSystemData, MotionSystemsService } from "../remote/motionsystems.service"

export class MotionsystemComponentBaseModel  {

  motionSystemId: number;

  inUseByMe: boolean = false
  inUseByOther: boolean = false
  synced: boolean = false
  state: UIState = UIState.DeviceNotReady

  statusRefreshTimer: Observable<number> = timer(1000, 5000);
  statusRefreshTimerSubscription: Subscription

  liveImgRefreshTimer: Observable<number> = timer(1000, 500);
  liveImgRefreshTimerSubscription: Subscription
  linkPicture: string
  timeStamp: number

  constructor(
    public remoteService: MotionSystemsService,
    public alias: string) { }

  initSystemStatusPullTimer(id: number) {
    this.statusRefreshTimerSubscription = this.statusRefreshTimer.subscribe(seconds => {

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
      // System was available and is now in use => used by someone else
      if (data.inUse) {
        this.state = UIState.OtherInControl
        this.inUseByOther = true
      }
    }
    else if (this.state == UIState.OtherInControl && this.synced == true) {
      // Is other use still in control? If not, system is available
      if (data.inUse == false) {
        this.state = UIState.NotInControl
        this.inUseByOther = false
      }

      let a = +new Date()
      let b = +(new Date(data.timestamp))
      if (a - b > 300000) {
        console.warn("Kick out ", data.clientId, "which reserved the motion system at", data.timestamp)
        let data2 = new MotionSystemData
        data2.inUse = false
        this.remoteService.patch(this.motionSystemId, data2).subscribe(
          result => {
            this.inUseByMe = false
            this.inUseByOther = false
            this.state = UIState.NotInControl
          }, err => console.error(err))
      }
    }
  }

  initLiveImageTimer(name: string) {
    this.liveImgRefreshTimerSubscription = this.liveImgRefreshTimer.subscribe(seconds => {
      this.setLivePicture("https://webaepp.dynv6.net:50445/images/" + name)
    })
  }

  public getLivePicture() {
    if (this.timeStamp) {
      return this.linkPicture + '?' + this.timeStamp;
    }
    return this.linkPicture;
  }

  public setLivePicture(url: string) {
    this.linkPicture = url;
    this.timeStamp = (new Date()).getTime();
  }

  public onTakeControl() {
    if (this.state == UIState.NotInControl) {
      let data = new MotionSystemData
      data.inUse = true
      this.remoteService.patch(this.motionSystemId, data).subscribe(
        result => {
          this.inUseByMe = true
          this.state = UIState.InControl
        }, err => console.error(err))
    }
  }

  onLetControl() {
    if (this.state == UIState.InControl) {
      let data = new MotionSystemData
      data.inUse = false
      this.remoteService.patch(this.motionSystemId, data).subscribe(
        result => {
          this.inUseByMe = false
          this.state = UIState.NotInControl
        }, err => console.error(err))
    }
  }

}

const enum UIState {
  InControl,
  NotInControl,
  OtherInControl,
  DeviceNotReady
}

