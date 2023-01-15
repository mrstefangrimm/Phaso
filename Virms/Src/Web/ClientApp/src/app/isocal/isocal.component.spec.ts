// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'

import { IsocalComponent } from './isocal.component'
import { IsocalEngine3dService } from './isocalengine3d.service'

describe('IsocalComponent', () => {
  let component: IsocalComponent
  let fixture: ComponentFixture<IsocalComponent>
  const loadableObjectSpy = jasmine.createSpyObj('LoadableObject', ['setVisible'])

  class FakeEngineService {
    createScene() { }
    animate() { }
    setTransparent() { }
    groupStaticCoverBlue = loadableObjectSpy
    groupStaticCoverSilver = loadableObjectSpy
  }

  //const lnrEngineServiceSpy = jasmine.createSpyObj(
  //  'LnrEngine3dService',
  //  ['createScene', 'animate', 'setTransparent'],
  //  ['groupStaticCoverBlue', 'groupStaticCoverSilver'],
  //)
  //spyOnProperty(lnrEngineServiceSpy, 'groupStaticCoverBlue').and.returnValue(loadableObjectSpy)
  //spyOnProperty(lnrEngineServiceSpy, 'groupStaticCoverSilver').and.returnValue(loadableObjectSpy)
  //lnrEngineServiceSpy.groupStaticCoverBlue.returnValue(loadableObjectSpy)
  //lnrEngineServiceSpy.groupStaticCoverSilver.returnValue(loadableObjectSpy)

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsocalComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: IsocalEngine3dService, useClass: FakeEngineService },
        //{ provide: LnrEngine3dService, useValue: lnrEngineServiceSpy },
      ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(IsocalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    //component.ngOnDestroy()
    //component = null
  //  fixture.destroy()
  //  fixture = null
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
