// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Injectable } from "@angular/core"
import { NavigationContextBaseModel } from "../shared/ui/navigationcontextbase.model"

@Injectable({ providedIn: 'root' })
export class IsocalService extends NavigationContextBaseModel {

  showAsXray: boolean = false

  constructor() {
    super()
    console.info(IsocalService.name, "c'tor")
  }

}
