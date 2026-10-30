// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Observable } from "rxjs"
import { MotionSystemsResponse } from "./motionsystems.service"

export class FakeMotionSystemsService {
  getMotionSystemData(): Observable<MotionSystemsResponse> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Observable<MotionSystemsResponse>(_ => { })
  }
}
