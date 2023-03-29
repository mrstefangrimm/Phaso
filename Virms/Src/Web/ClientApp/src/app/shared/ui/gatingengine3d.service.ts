// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { LoadableObject, LoadedObject, NotLoadedObject } from './loadedobject.model'
import { tick } from '@angular/core/testing'

@Injectable({providedIn: 'root'})
export class GatingEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.AmbientLight
  private frameId: number = null

  private mesh: undefined

  gatingPlatform: LoadableObject

  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(GatingEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(GatingEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
    this.scene.remove(this.mesh)
    this.gatingPlatform.dispose()
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.info(GatingEngine3dService.name, "createScene")

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement

    const w = this.canvas.width
    const h = this.canvas.height

    console.debug(w, h)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    })
    this.renderer.setSize(w, h)

    // create the scene
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 500)
    this.camera.position.set(0, 10, 100)
    this.scene.add(this.camera)

    // soft white light
    this.light = new THREE.AmbientLight(0x404040)
    this.light.position.y = 1000
    this.light.position.z = 1000
    this.scene.add(this.light)

    var materialGatingPanel = new THREE.MeshPhysicalMaterial({
      color: 0x0000AA,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.8,
      opacity: 1,
      transparent: true
    })

    const worldOffset = new Vector3(0, 0, 0)

    LoadedObject.tryAdd(this.gatingPlatform).subscribe(existing => this.scene.add(existing),
      () => {
        this.gatingPlatform = new LoadedObject()
        this.gatingPlatform.origin = new Vector3(0, 0, 0)
        this.gatingPlatform.directionVector = new Vector3(0, -1, 0)
        this.gatingPlatform.position = worldOffset
        this.gatingPlatform.material = materialGatingPanel
        this.gatingPlatform.load(this.baseUrl + 'assets/Cmn-GatingPlatform.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.mesh = object3d
          },
          () => {
            this.gatingPlatform = new NotLoadedObject()
            console.warn(GatingEngine3dService.name, "createScene", "gatingPlatform is not shown")
          })
      })
  }

  animate() {
    console.debug(GatingEngine3dService.name, "animate")

    // Run outside angular zones, because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render()
      }
      else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render()
        })
      }
      window.addEventListener('resize', () => {
        this.resize()
      })
    })
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render()
    })
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const w = this.canvas.width
    const h = this.canvas.height

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(w, h)
  }

}
