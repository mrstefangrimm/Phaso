// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { NgModule } from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {AppComponent} from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatDividerModule } from '@angular/material/divider'

import { SharedModule } from './shared/shared.module'
import { MarkerComponent } from './marker/marker.component'
import { LiverComponent } from './liver/liver.component'
import { LungComponent } from './lung/lung.component'
import { LnrComponent } from './lnr/lnr.component'
import { IsocalComponent } from './isocal/isocal.component'
import { HomeComponent } from './home/home.component'

@NgModule({
  declarations: [
    AppComponent,
    MarkerComponent,
    LiverComponent,
    LungComponent,
    LnrComponent,
    IsocalComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      // Paths do not work on github.io
      //{ path: 'a', component: HomeComponent, pathMatch: 'full' },
      //{ path: 'b', component: HomeComponent, pathMatch: 'full' },
      //{ path: 'c', component: HomeComponent, pathMatch: 'full' },
      //{ path: 'd', component: HomeComponent, pathMatch: 'full' },
      //{
      //  // markerphantom, liverphantom, lungphantom, lnractuator
      //  path: ':motionSystem',
      //  component: HomeComponent,
      //  pathMatch: 'full'
      //},
    ]),
    MatSliderModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
