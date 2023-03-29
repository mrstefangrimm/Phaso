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

import { LungComponent } from './lung.component'
import { LungEngine3dService } from './lungengine3d.service'

describe('LungComponent', () => {
  let component: LungComponent
  let fixture: ComponentFixture<LungComponent>
  const routerSpy = jasmine.createSpyObj('Router', [''])
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post'])
  const tocServiceSpy = jasmine.createSpyObj('TocService', ['getTableOfContent'])
  const gatingEngineServiceSpy = jasmine.createSpyObj('GatingEngine3dService', ['createScene', 'animate'])

  const loadableObjectSpy = jasmine.createSpyObj('LoadableObject', ['setVisible'])
  class FakeEngineService {
    createScene() { }
    animate() { }
    setXray() { }
    chest = loadableObjectSpy
    lungLeftInsert = loadableObjectSpy
    skeleton = loadableObjectSpy
    lungRight = loadableObjectSpy
    lungLeft = loadableObjectSpy
    upperCylinder = loadableObjectSpy
    lowerCylinder = loadableObjectSpy
    target = loadableObjectSpy
    secondTarget = loadableObjectSpy
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LungComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: TocService, useValue: tocServiceSpy },
        { provide: MotionSystemsService, useClass: FakeMotionSystemsService },
        { provide: LungEngine3dService, useClass: FakeEngineService },
        { provide: GatingEngine3dService, useValue: gatingEngineServiceSpy },
      ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LungComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
