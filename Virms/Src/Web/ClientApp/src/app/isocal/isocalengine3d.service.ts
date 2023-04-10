// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model'
import { ThreeObject } from '../shared/ui/threeobject.model'

@Injectable({providedIn: 'root'})

export class IsocalEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.Light
  private frameId: number = null
  private orbit: OrbitControls

  private meshes = []

  private backGround: THREE.Color
  private backGroundXray: THREE.Color

  private materialDrum: THREE.Material
  private materialDrumXray: THREE.Material
  private materialMarkers: THREE.Material
  private materialMarkersXray: THREE.Material
  private materialCouch: THREE.Material
  private materialCouchXray: THREE.Material

  drum: LoadableObject
  markers: LoadableObject
  couch: LoadableObject
  detector: ThreeObject
  x1: ThreeObject
  x2: ThreeObject
  y1: ThreeObject
  y2: ThreeObject

  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(IsocalEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(IsocalEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
    this.meshes.forEach(m => this.scene.remove(m))
    this.materialDrum.dispose()
    this.materialDrumXray.dispose()
    this.materialMarkers.dispose()
    this.materialMarkersXray.dispose()
    this.materialCouch.dispose()
    this.materialCouchXray.dispose()
    this.drum.dispose()
    this.markers.dispose()
    this.couch.dispose()
    this.detector.dispose()
    this.x1.dispose()
    this.x2.dispose()
    this.y1.dispose()
    this.y2.dispose()
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, width: number, height: number) {
    console.info(IsocalEngine3dService.name, "createScene")

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement

    const w = width
    const h = height
    console.debug(w, h)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    })
    this.renderer.setSize(w, h)

    // create the scene
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(30, w / h, 1, 3000)
    this.camera.position.set(0, 1000, 0)
    this.scene.add(this.camera)

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.minDistance = 0
    this.orbit.maxDistance = 2500

    //var axesHelper = new THREE.AxesHelper(600)
    //this.scene.add(axesHelper)

    this.light = new THREE.SpotLight(0xFFFFFF)
    this.light.position.set(0, 0, 600)

    this.light.castShadow = true

    this.light.shadow.mapSize.width = 1024
    this.light.shadow.mapSize.height = 1024

    this.light.shadow.camera.near = 500
    this.light.shadow.camera.far = 4000
    this.light.shadow.camera.fov = 30

    this.scene.add(this.light)

    this.backGround = null
    this.backGroundXray = new THREE.Color(0x000000)

    this.materialDrum = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
    })
    this.materialDrumXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.2,
      opacity: 0.7,
      transparent: true
    })
    this.materialMarkers = new THREE.MeshStandardMaterial({
      color: 0xAAA9AD,
      metalness: 1.0,
    })
    this.materialMarkersXray = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.0,
      opacity: 1,
      transparent: true
    })
    this.materialCouch = new THREE.MeshStandardMaterial({
      color: 0xAAA9AD,
      metalness: 1.0,
    })
    this.materialCouchXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.0,
      opacity: 0.5,
      transparent: true
    })
    const materialDetector = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
    })
    const materialCollimator = new THREE.MeshStandardMaterial({
      color: 0x000000,
    })

    const originOffset = new Vector3(0, 0, 0)

    this.detector = new ThreeObject()
    this.detector.fromWorldToLocalOrigin = new Vector3(0, 0, 0)
    this.detector.position = new Vector3(0, -600, 0)
    this.detector.geometry = new THREE.BoxGeometry(430, 100, 430)
    this.detector.material = materialDetector
    this.detector.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.x1 = new ThreeObject()
    this.x1.fromWorldToLocalOrigin = new Vector3(0, 0, 0)
    this.x1.position = new Vector3(0, 570, -110)
    this.x1.geometry = new THREE.BoxGeometry(200, 10, 100)
    this.x1.material = materialCollimator
    this.x1.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })
    this.x2 = new ThreeObject()
    this.x2.fromWorldToLocalOrigin = new Vector3(0, 0, 0)
    this.x2.position = new Vector3(0, 570, 110)
    this.x2.geometry = new THREE.BoxGeometry(200, 10, 100)
    this.x2.material = materialCollimator
    this.x2.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })
    this.y1 = new ThreeObject()
    this.y1.fromWorldToLocalOrigin = new Vector3(0, 0, 0)
    this.y1.position = new Vector3(-110, 570, 0)
    this.y1.geometry = new THREE.BoxGeometry(100, 10, 200)
    this.y1.material = materialCollimator
    this.y1.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })
    this.y2 = new ThreeObject()
    this.y2.fromWorldToLocalOrigin = new Vector3(0, 0, 0)
    this.y2.position = new Vector3(110, 570, 0)
    this.y2.geometry = new THREE.BoxGeometry(100, 10, 200)
    this.y2.material = materialCollimator
    this.y2.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    LoadedObject.tryAdd(this.drum).subscribe(existing => this.scene.add(existing),
      () => {
        this.drum = new LoadedObject()
        this.drum.origin = new Vector3(0, 0, 0)
        this.drum.directionVector = new Vector3(0, -1, 0)
        this.drum.position = originOffset
        this.drum.material = this.materialDrum
        this.drum.load(this.baseUrl + 'assets/Isocal-Drum.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.drum = new NotLoadedObject()
            console.warn(IsocalEngine3dService.name, "createScene", "drum is not shown")
          })
      })
    LoadedObject.tryAdd(this.markers).subscribe(existing => this.scene.add(existing),
      () => {
        this.markers = new LoadedObject()
        this.markers.origin = new Vector3(0, 0, 0)
        this.markers.directionVector = new Vector3(0, -1, 0)
        this.markers.position = originOffset
        this.markers.material = this.materialMarkers
        this.markers.load(this.baseUrl + 'assets/Isocal-Markers.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.markers = new NotLoadedObject()
            console.warn(IsocalEngine3dService.name, "createScene", "markers are not shown")
          })
      })
    LoadedObject.tryAdd(this.couch).subscribe(existing => this.scene.add(existing),
      () => {
        this.couch = new LoadedObject()
        this.couch.origin = new Vector3(0, 200, -115)
        this.couch.directionVector = new Vector3(0, -1, 0)
        this.couch.position = new Vector3(0, -115, -200)
        this.couch.material = this.materialCouch
        this.couch.load(this.baseUrl + 'assets/Isocal-Couch.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.couch = new NotLoadedObject()
            console.warn(IsocalEngine3dService.name, "createScene", "couch is not shown")
          })
      })
  }

  animate() {
    console.debug(IsocalEngine3dService.name, "animate")

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
    this.light.position.x = this.camera.position.x
    this.light.position.y = this.camera.position.y
    this.light.position.z = this.camera.position.z

    //const delta = this.camera.position.x - this.currentX
    //this.currentX = this.camera.position.x
    //var rotX = Math.atan(delta / 300)
    //console.info(this.camera.position.x, delta, -rotX)
    //this.detector.rotateY(rotX)

    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const w = this.canvas.width
    const h = this.canvas.height

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(w, h)
  }

  setXray(xray: boolean) {
    console.info(IsocalEngine3dService.name, "setXray", xray)

    //this.orbit.enabled = !xray

    if (xray) {
      this.scene.background = this.backGroundXray

      this.drum.setMaterial(this.materialDrumXray)
      this.markers.setMaterial(this.materialMarkersXray)
      this.couch.setMaterial(this.materialCouchXray)
    }
    else {
      this.scene.background = this.backGround

      this.drum.setMaterial(this.materialDrum)
      this.markers.setMaterial(this.materialMarkers)
      this.couch.setMaterial(this.materialCouch)
    }

  }

}
