// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/ui/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class LungService extends NavigationContextBaseModel {

  showAsXray = false
  showChest = true
  showRightLung = true
  showLeftLung = true
  showTargets = true

  constructor() {
    super()
    console.info(LungService.name, "c'tor")
  }

}
