// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/ui/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class MarkerService extends NavigationContextBaseModel {

  showAsXray: boolean = false
  showBody: boolean = true
  showCylinders: boolean = true
  showMarkers: boolean = true

  constructor() {
    super()
    console.info(MarkerService.name, "c'tor")
  }

}
