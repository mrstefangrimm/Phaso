// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

export class NavigationContextBaseModel  {

  sideNavOpen: boolean = true
  automaticControlsEnabled: boolean = false
  visiblitiesOpen: boolean

  constructor() {
    console.info(NavigationContextBaseModel.name, "c'tor")
  }

  copyNavigationContext(to: NavigationContextBaseModel) {
    to.sideNavOpen = this.sideNavOpen
    to.automaticControlsEnabled = this.automaticControlsEnabled
    to.visiblitiesOpen = this.visiblitiesOpen
  }

}
