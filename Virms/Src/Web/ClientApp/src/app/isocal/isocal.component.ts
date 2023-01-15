// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ViewChild } from '@angular/core'
import { ElementRef } from '@angular/core'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { IsocalService } from './isocal.service'
import { IsocalEngine3dService } from './isocalengine3d.service'

@Component({
  selector: 'app-isocal',
  templateUrl: './isocal.component.html',
  styleUrls: ['./isocal.component.css']
})
export class IsocalComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas: ElementRef<HTMLCanvasElement>

  constructor(
    public context: IsocalService,
    private readonly engine3d: IsocalEngine3dService) {
    console.info(IsocalComponent.name, "c'tor")
  }

  ngOnInit() {
    console.info(IsocalComponent.name, "ngOnInit")

    this.engine3d.createScene(this.rendererCanvas);
    this.engine3d.animate();

    this.setVisibilies()
  }

  ngOnDestroy() {
    console.info(IsocalComponent.name, "ngOnDestroy")
    this.engine3d.ngOnDestroy()
  }

  onXrayChecked(checked: boolean) {
    this.engine3d.setXray(checked)
    this.context.showAsXray = checked
  }

  private setVisibilies() {
    this.engine3d.setXray(this.context.showAsXray)
  }

}
