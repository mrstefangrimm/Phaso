// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MotionSystemsService {

  constructor(private readonly http: HttpClient,
    @Inject('BASE_URL') private readonly baseUrl: string) {
  }
 
  getMotionSystems(): Observable<MotionSystemsResponse> {
    let request = this.baseUrl + 'api/motionsystems'
    console.debug(request)
    return this.http.get<MotionSystemsResponse>(request)
  }

  getMotionSystem(id: number): Observable<MotionSystemResponse> {
    let request = this.baseUrl + 'api/motionsystems/' + id
    console.debug(request)
    return this.http.get<MotionSystemResponse>(request)
  }

  patch(motionSystemId: number, data: MotionSystemData): Observable<any> {
    let request = this.baseUrl + 'api/motionsystems/' + motionSystemId
    console.debug(request)
    return this.http.patch<any>(request, data)
  }

  patchServoPositions(motionSystemId: number, positions: ServoPosition[]): Observable<any> {
    let request = this.baseUrl + 'api/motionsystems/' + motionSystemId + '/motionstep'
    console.debug(request)
    return this.http.patch<any>(request, positions)
  }

  patchMotionPattern(motionSystemId: number, patternId, data: MotionPatternData): Observable<any> {
    let request = this.baseUrl + 'api/motionsystems/' + motionSystemId + '/motionpatterns/' + patternId
    console.debug(request)
    return this.http.patch<any>(request, data)
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
