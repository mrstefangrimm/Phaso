// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Observable, Subscription, timer } from "rxjs"
import { MotionPatternResponse, MotionSystemData, MotionSystemsService } from "../remote/motionsystems.service"

export class MotionsystemComponentBaseModel  {

  motionSystemId: number
  patterns: MotionPatternResponse[]

  inUseByMe: boolean
  inUseByOther: boolean
  synced: boolean
  hasLiveImage: boolean
  state: UIState = UIState.DeviceNotReady

  statusRefreshTimer: Observable<number> = timer(1000, 500)
  statusRefreshTimerSubscription: Subscription

  liveImgRefreshTimer: Observable<number> = timer(1000, 500)
  liveImgRefreshTimerSubscription: Subscription
  linkPicture: string
  timeStamp: number

  constructor(
    public remoteService: MotionSystemsService,
    public alias: string) { }

  onInit(liveimagename: string) {
    this.remoteService.getMotionSystemData(this.alias).subscribe(
      result => {
        console.info(result.id, result.data.alias, result.data.name)
        this.motionSystemId = result.id

        this.remoteService.getMotionSystem(this.motionSystemId).subscribe(
          result => {
            this.initSystemStatusPullTimer(this.motionSystemId)
            this.initLiveImageTimer(liveimagename)
            this.patterns = result.motionPatterns.data
          }, err => console.error(err))
      }, err => console.error(err))
  }

  onDestroy() {
    if (this.liveImgRefreshTimerSubscription) this.liveImgRefreshTimerSubscription.unsubscribe()
    if (this.statusRefreshTimerSubscription) this.statusRefreshTimerSubscription.unsubscribe()
    this.onLetControl()
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

      const a = +new Date()
      const b = +(new Date(data.timestamp))
      if (a - b > 300000) {
        console.warn("Kick out ", data.clientId, "which reserved the motion system at", data.timestamp)
        const data2 = new MotionSystemData
        data2.inUse = false
        this.remoteService.patch(this.motionSystemId, data2).subscribe(
          result => {
            this.inUseByMe = false
            this.inUseByOther = false
            this.state = UIState.NotInControl
          }, err => console.error(err))
      }
    }
    this.updateUI(data)
  }

  updateUI(data: MotionSystemData) { }

  getLivePicture() {
    if (this.timeStamp) {
      return this.linkPicture + '?' + this.timeStamp
    }
    return this.linkPicture
  }

  setLivePicture(url: string) {
    this.linkPicture = url
    this.timeStamp = (new Date()).getTime()
  }

  onTakeControl() {
    if (this.state == UIState.NotInControl) {
      const data = new MotionSystemData
      data.inUse = true
      this.state = UIState.InControl
      this.inUseByMe = true
      this.remoteService.patch(this.motionSystemId, data).subscribe(
        result => {
        }, err => console.error(err))
    }
  }

  private onLetControl() {
    if (this.state == UIState.InControl) {
      const data = new MotionSystemData
      data.inUse = false
      this.remoteService.patch(this.motionSystemId, data).subscribe(
        result => {
          this.inUseByMe = false
          this.state = UIState.NotInControl
        }, err => console.error(err))
    }
  }

  private initSystemStatusPullTimer(id: number) {
    this.statusRefreshTimerSubscription = this.statusRefreshTimer.subscribe(seconds => {

      this.remoteService.getMotionSystem(id).subscribe(
        result => {
          //console.debug(result)
          this.updateStatus(result.data)
        }, err => console.error(err))
    })
  }

  private initLiveImageTimer(name: string) {
    if (this.remoteService.liveImageUrl) {
      this.hasLiveImage = true
      this.liveImgRefreshTimerSubscription = this.liveImgRefreshTimer.subscribe(seconds => {
        this.setLivePicture(this.remoteService.liveImageUrl + '/' + name)
      })
    }
    else {
      console.info("live-image url is not set.")
    }
  }

}

const enum UIState {
  // There is no connection to the web service
  // or the device has not synced with the service
  // or the service does not allow to use the device. 
  DeviceNotReady,
  // Device is ready to use.
  NotInControl,
  // Device is under this client's control.
  InControl,
  // Some other client is in control of the device.
  OtherInControl,
}
