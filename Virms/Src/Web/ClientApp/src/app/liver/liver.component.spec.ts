// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { HttpClient } from '@angular/common/http'
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { FakeMotionSystemsService } from '../shared/remote/fakemotionsystems.service'
import { MotionSystemsService } from '../shared/remote/motionsystems.service'
import { TocService } from '../shared/remote/toc.service'
import { GatingEngine3dService } from '../shared/ui/gatingengine3d.service'

import { LiverComponent } from './liver.component'
import { LiverEngine3dService } from './liverengine3d.service'

describe('LiverComponent', () => {
  let component: LiverComponent
  let fixture: ComponentFixture<LiverComponent>
  const routerSpy = jasmine.createSpyObj('Router', [''])
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post'])
  const tocServiceSpy = jasmine.createSpyObj('TocService', ['getTableOfContent'])
  const gatingEngineServiceSpy = jasmine.createSpyObj('GatingEngine3dService', ['createScene', 'animate'])

  const loadableObjectSpy = jasmine.createSpyObj('LoadableObject', ['setVisible'])
  class FakeEngineService {
    createScene() { }
    animate() { }
    setXray() { }
    body = loadableObjectSpy
    bodyInsertCenter = loadableObjectSpy
    bodyInsertBack = loadableObjectSpy
    cylinderLeft = loadableObjectSpy
    cylinderLeftCylinder = loadableObjectSpy
    cylinderLeftInsertCenter = loadableObjectSpy
    cylinderLeftInsertBack = loadableObjectSpy
    cylinderLeftMarkers = loadableObjectSpy
    cylinderRight = loadableObjectSpy
    cylinderRightCylinderCenter = loadableObjectSpy
    cylinderRightCylinderBack = loadableObjectSpy
    cylinderRightInsertCenter = loadableObjectSpy
    cylinderRightInsertBack = loadableObjectSpy
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiverComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: TocService, useValue: tocServiceSpy },
        { provide: MotionSystemsService, useClass: FakeMotionSystemsService },
        { provide: LiverEngine3dService, useClass: FakeEngineService },
        { provide: GatingEngine3dService, useValue: gatingEngineServiceSpy },
      ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LiverComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
