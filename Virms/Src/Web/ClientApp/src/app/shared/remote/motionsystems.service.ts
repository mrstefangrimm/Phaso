// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TocService } from './toc.service'

@Injectable({ providedIn: 'root' })
export class MotionSystemsService {

  private apiBaseUrl: string
  
  constructor(
    private readonly http: HttpClient,
    private readonly tocService: TocService) {
    this.clientId = Math.floor(Math.random() * 1000).toString()
    console.info(MotionSystemsService.name, "c'tor, client id:", this.clientId)
  }

  clientId: string

  getMotionSystems(): Observable<MotionSystemsResponse> {
    let doWork = () => {
      return this.http.get<MotionSystemsResponse>(this.apiBaseUrl)
    }
    if (this.apiBaseUrl) {
      return doWork()
    }
    else {
      this.getApiBaseUrlFromToc().subscribe(null, null, () => {
        return doWork()
      })
    }
  }

  getMotionSystemData(alias: string): Observable<MotionSystemResponse> {

    let doWork = (subscriber) => {
      this.http.get<MotionSystemsResponse>(this.apiBaseUrl).subscribe(
        result => {
          result.data.forEach(x => {
            if (x.data.alias.toUpperCase().indexOf(alias) > -1) {
              subscriber.next(x)
            }
          })
        },
        err => {
          console.error(err)
          subscriber.error()
        })
    }
    return new Observable<MotionSystemResponse>(subscriber => {
      if (this.apiBaseUrl) {
        doWork(subscriber)
      }
      else {
        this.getApiBaseUrlFromToc().subscribe(null, null, () => {
          doWork(subscriber)
        })
      }
    })      
  }

  getMotionSystem(id: number): Observable<MotionSystemResponse> {

    let doWork = () => {
      let request = this.apiBaseUrl + '/' + id
      console.debug(request)
      return this.http.get<MotionSystemResponse>(request)
    }
    if (this.apiBaseUrl) {
      return doWork()
    }
    else {
      this.getApiBaseUrlFromToc().subscribe(null, null, () => {
        return doWork()
      })
    }
  }

  patchServoPositions(motionSystemId: number, positions: ServoPosition[]) {

    let doWork = () => {
      let request = this.apiBaseUrl + '/' + motionSystemId + '/motionstep'
      console.debug(request, positions)
      this.http.patch(request, positions).subscribe(null, err => console.error(err))
    }
    if (this.apiBaseUrl) {
      doWork()
    }
    else {
      this.getApiBaseUrlFromToc().subscribe(null, null, () => {
        doWork()
      })
    }
  }

  patch(motionSystemId: number, data: MotionSystemData): Observable<any> {

    let doWork = () => {
      data.clientId = this.clientId
      data.timestamp = new Date()
      let request = this.apiBaseUrl + '/' + motionSystemId
      console.debug(request, data)
      return this.http.patch(request, data)
    }
    if (this.apiBaseUrl) {
      return doWork()
    }
    else {
      this.getApiBaseUrlFromToc().subscribe(null, null, () => {
        return doWork()
      })
    }
  }

  //patchMotionPattern(motionSystemId: number, patternId, data: MotionPatternData): Observable<any> {
  //  let request = this.baseUrl + 'api/motionsystems/' + motionSystemId + '/motionpatterns/' + patternId
  //  console.debug(request)
  //  return this.http.patch<any>(request, data)
  //}

  private getApiBaseUrlFromToc(): Observable<any> {
    return new Observable<boolean>(subscriber => {
      this.tocService.getTableOfContent().subscribe(
        result => {
          this.apiBaseUrl = result.hrefs['motionsystems']
          console.debug(this.apiBaseUrl)
          subscriber.complete()
        },
        err => {
          console.error(err)
          subscriber.error()
        })
    })
  }
}

// Data Transfer Objects, Data Payload Objects

export class MotionPatternData {
  name: string
  executing: boolean
  progId: number
}

export interface MotionPatternResponse {
  id: number
  data: MotionPatternData
}

export interface MotionPatternsResponse {
  data: MotionPatternResponse[]
}

export class ServoPosition {
  servoNumber: number
  position: number
}

export interface Axis {
  servoNumber: number
  alias: string
  position: number
}

export class MotionSystemData {
  name: string
  alias: string
  inUse: boolean
  clientId: string
  timestamp: Date
  synced: boolean
  servoCount: number
  axes: Axis[]
}

export interface MotionSystemResponse {
  id: number
  data: MotionSystemData
  motionPatterns: MotionPatternsResponse
}

export interface MotionSystemsResponse {
  data: MotionSystemResponse[]
  hrefs: { [key: string]: string }
}
