// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Component, ChangeDetectionStrategy } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.component.html',
  imports: [RouterModule],
})
export class AppComponent {

}
