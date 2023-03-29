// Copyright (c) 2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'

import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  const routerSpy = jasmine.createSpyObj('Router', [''])
  const activeRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activeRouteSpy },
      ]
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
