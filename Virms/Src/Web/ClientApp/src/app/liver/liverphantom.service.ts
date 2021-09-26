// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Axis, MotionPatternData, MotionPatternResponse, MotionSystemData, MotionSystemsService, ServoPosition } from "../shared/services/motionsystems.service"


@Injectable({ providedIn: 'root' })
export class LiverPhantomService  {

  motionSystemId: number
  patterns: MotionPatternResponse[]
  axes: Axis[]
  synced: boolean
  inUse: boolean

  constructor(private readonly motionSystems: MotionSystemsService) {
    console.info('LiverPhantomService')
    this.updateData()
  }

  patchPhantom(positions: ServoPosition[]) {
    this.motionSystems.patchServoPositions(this.motionSystemId, positions).subscribe(
      result => {
        console.debug(result)
      }, err => console.error(err))
  }

  patch(data: MotionSystemData) {
    this.motionSystems.patch(this.motionSystemId, data).subscribe(
      result => {
        console.debug(result)
      }, err => console.error(err))
  }

  startPattern(patternId: number) {
    let data = new MotionPatternData()
    data.executing = true
    console.info(patternId + ' executing')

    this.motionSystems.patchMotionPattern(this.motionSystemId, patternId, data).subscribe(
      result => { console.info(result) },
      err => { console.error(err) }
    )
  }

  stopPattern(patternId: number): Observable<LiverPhantomService> {
    let data = new MotionPatternData()
    data.executing = false
    console.info(patternId + ' stopped executing')

    this.motionSystems.patchMotionPattern(this.motionSystemId, patternId, data).subscribe(
      result => { console.info(result) },
      err => { console.error(err) }
    )
    return this.updateData()
  }

  updateData(): Observable<LiverPhantomService> {

    let getData = subscriber => {
      this.motionSystems.getMotionSystem(this.motionSystemId).subscribe(
        result => {
          console.debug(result)
          this.axes = result.data.axes
          this.synced = result.data.synced
          this.inUse = result.data.inUse
          this.patterns = result.motionPatterns.data
          subscriber.next(this)
        }, err => subscriber.error(err))
    }

    return new Observable<LiverPhantomService>(subscriber => {
      if (this.motionSystemId != undefined) {
        getData(subscriber)
      }
      else {
        this.motionSystems.getMotionSystems().subscribe(
          result => {
            console.debug(result)
            result.data.forEach(x => {
              if (x.data.alias.toUpperCase().indexOf('NO2') > -1) {
                this.motionSystemId = x.id
                console.info(x.id, x.data.alias, x.data.name)
                getData(subscriber)
              }
            })
          }, error => subscriber.error(error))
      }
    })    
  }
}
