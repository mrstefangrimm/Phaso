// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class LungService extends NavigationContextBaseModel {

  showAsXray: boolean = false
  showChest: boolean = true
  showRightLung: boolean = true
  showLeftLung: boolean = true
  showTargets: boolean = true

  constructor() {
    super()
    console.info(LungService.name, "c'tor")
  }

}
