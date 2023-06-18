// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/ui/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class MarkerService extends NavigationContextBaseModel {

  showAsXray = false
  showBody = true
  showCylinders = true
  showMarkers = true

  constructor() {
    super()
    console.info(MarkerService.name, "c'tor")
  }

}
