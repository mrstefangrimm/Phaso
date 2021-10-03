// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class LiverService extends NavigationContextBaseModel {

  showAsXray: boolean = false
  showBody: boolean = true
  showLeftCylinder: boolean = true
  showRightCylinder: boolean = true
  showMarkers: boolean = true

  constructor() {
    super()
    console.info(LiverService.name, "c'tor")
  }

}
