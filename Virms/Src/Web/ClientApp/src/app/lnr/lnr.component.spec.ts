// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'

import { LnrComponent } from './lnr.component'
import { LnrEngine3dService } from './lnrengine3d.service'

describe('LnrComponent', () => {
  let component: LnrComponent
  let fixture: ComponentFixture<LnrComponent>
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
      declarations: [LnrComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: LnrEngine3dService, useClass: FakeEngineService },
        //{ provide: LnrEngine3dService, useValue: lnrEngineServiceSpy },
      ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LnrComponent)
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
