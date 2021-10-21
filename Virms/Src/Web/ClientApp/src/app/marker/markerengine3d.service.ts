// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three-orbitcontrols-ts'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model';
import { ThreeCylinder } from '../shared/ui/threecylinder.model';

@Injectable({providedIn: 'root'})

export class MarkerEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.AmbientLight
  private frameId: number = null

  private backGround: THREE.Color
  private backGroundXray: THREE.Color
  private materialTissue: THREE.Material
  private materialTissueXray: THREE.Material
  private materialMarker: THREE.Material
  private materialMarkerXray: THREE.Material

  body: LoadableObject

  cylinderLeftUpper: ThreeCylinder
  markerLeftUpper: ThreeCylinder
  cylinderLeftLower: ThreeCylinder
  markerLeftLower: ThreeCylinder
  cylinderRightUpper: ThreeCylinder
  markerRightUpper: ThreeCylinder
  cylinderRightLower: ThreeCylinder
  markerRightLower: ThreeCylinder

  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(MarkerEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(MarkerEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.info(MarkerEngine3dService.name, "createScene")

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement

    const w = this.canvas.width
    const h = this.canvas.width

    console.debug(w,h)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(w, h)

    // create the scene
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 500)
    this.camera.position.x = -100
    this.camera.position.y = 100
    this.camera.position.z = 180
    this.scene.add(this.camera)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 2000

    // soft white light
    this.light = new THREE.AmbientLight(0x404040)
    this.light.position.y = 1000
    this.light.position.z = 1000
    this.scene.add(this.light)

    this.backGround = null
    this.backGroundXray = new THREE.Color(0x000000)
    this.materialMarker = new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: false })
    this.materialMarkerXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: false })
    this.materialTissue = new THREE.MeshPhysicalMaterial({
      color: 0x0000AA,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.8, // use material.transmission for glass materials
      opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
      transparent: true
    })
    this.materialTissueXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.7,
      opacity: 1,
      transparent: true
    })

    const worldOffset = new Vector3(0, 0, 0)

    LoadedObject.tryAdd(this.body).subscribe(existing => this.scene.add(existing),
      () => {
        this.body = new LoadedObject()
        this.body.origin = new Vector3(0, 0, 0)
        this.body.normal = new Vector3(0, -1, 0)
        this.body.position = worldOffset
        this.body.material = this.materialTissue
        this.body.load(this.baseUrl + 'assets/Gris5A-Body.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.body = new NotLoadedObject()
            console.warn(MarkerEngine3dService.name, "createScene", "body is not shown")
          })
      })

    this.cylinderLeftUpper = new ThreeCylinder()
    this.cylinderLeftUpper.origin = new Vector3(0, 0, 0)
    this.cylinderLeftUpper.normal = new Vector3(0, -1, 0)
    this.cylinderLeftUpper.position = new Vector3(-25, 0, 25)
    this.cylinderLeftUpper.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderLeftUpper.material = this.materialTissue
    this.cylinderLeftUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.markerLeftUpper = new ThreeCylinder()
    this.markerLeftUpper.origin = new Vector3(10.606, 0, -10.606)
    this.markerLeftUpper.normal = new Vector3(0, -1, 0)
    this.markerLeftUpper.position = new Vector3(-25, -2, 25)
    this.markerLeftUpper.geometry = new THREE.CylinderGeometry(1, 1, 4, 32)
    this.markerLeftUpper.material = this.materialMarker
    this.markerLeftUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.cylinderLeftLower = new ThreeCylinder()
    this.cylinderLeftLower.origin = new Vector3(0, 0, 0)
    this.cylinderLeftLower.normal = new Vector3(0, -1, 0)
    this.cylinderLeftLower.position = new Vector3(-25, 0, -25)
    this.cylinderLeftLower.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderLeftLower.material = this.materialTissue
    this.cylinderLeftLower.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.markerLeftLower = new ThreeCylinder()
    this.markerLeftLower.origin = new Vector3(10.606, 0, 10.606)
    this.markerLeftLower.normal = new Vector3(0, -1, 0)
    this.markerLeftLower.position = new Vector3(-25, -22, -25)
    this.markerLeftLower.geometry = new THREE.CylinderGeometry(1, 1, 4, 32)
    this.markerLeftLower.material = this.materialMarker
    this.markerLeftLower.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.cylinderRightUpper = new ThreeCylinder()
    this.cylinderRightUpper.origin = new Vector3(0, 0, 0)
    this.cylinderRightUpper.normal = new Vector3(0, -1, 0)
    this.cylinderRightUpper.position = new Vector3(25, 0, 25)
    this.cylinderRightUpper.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderRightUpper.material = this.materialTissue
    this.cylinderRightUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.markerRightUpper = new ThreeCylinder()
    this.markerRightUpper.origin = new Vector3(-10.606, 0, -10.606)
    this.markerRightUpper.normal = new Vector3(0, -1, 0)
    this.markerRightUpper.position = new Vector3(25, 18, 25)
    this.markerRightUpper.geometry = new THREE.CylinderGeometry(1, 1, 4, 32)
    this.markerRightUpper.material = this.materialMarker
    this.markerRightUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.cylinderRightLower = new ThreeCylinder()
    this.cylinderRightLower.origin = new Vector3(0, 0, 0)
    this.cylinderRightLower.normal = new Vector3(0, -1, 0)
    this.cylinderRightLower.position = new Vector3(25, 0, -25)
    this.cylinderRightLower.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderRightLower.material = this.materialTissue
    this.cylinderRightLower.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })

    this.markerRightLower = new ThreeCylinder()
    this.markerRightLower.origin = new Vector3(-10.606, 0, 10.606)
    this.markerRightLower.normal = new Vector3(0, -1, 0)
    this.markerRightLower.position = new Vector3(25, -2, -25)
    this.markerRightLower.geometry = new THREE.CylinderGeometry(1, 1, 4, 32)
    this.markerRightLower.material = this.materialMarker
    this.markerRightLower.build().subscribe(
      object3d => {
        this.scene.add(object3d);
      })
  }

  animate() {
    console.debug(MarkerEngine3dService.name, "animate")

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
    const h = this.canvas.width

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(w, h)
  }

  setXray(xray: boolean) {
    console.info(MarkerEngine3dService.name, "setXray", xray)
    if (xray) {
      this.scene.background = this.backGroundXray

      this.body.setMaterial(this.materialTissueXray)
      this.markerLeftUpper.setMaterial(this.materialMarkerXray)
      this.markerLeftLower.setMaterial(this.materialMarkerXray)
      this.markerRightUpper.setMaterial(this.materialMarkerXray)
      this.markerRightLower.setMaterial(this.materialMarkerXray)
    }
    else {
      this.scene.background = this.backGround

      this.body.setMaterial(this.materialTissue)
      this.markerLeftUpper.setMaterial(this.materialMarker)
      this.markerLeftLower.setMaterial(this.materialMarker)
      this.markerRightUpper.setMaterial(this.materialMarker)
      this.markerRightLower.setMaterial(this.materialMarker)
    }
  }

}
