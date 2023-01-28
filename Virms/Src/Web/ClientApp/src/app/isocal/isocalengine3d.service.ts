// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model'

@Injectable({providedIn: 'root'})

export class IsocalEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.Light
  private frameId: number = null
  private orbit: OrbitControls

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
  detector: THREE.BufferGeometry
  x1: THREE.BufferGeometry
  x2: THREE.BufferGeometry
  y1: THREE.BufferGeometry
  y2: THREE.BufferGeometry

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
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.info(IsocalEngine3dService.name, "createScene")

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement

    const w = this.canvas.width
    const h = this.canvas.height

    console.debug(w,h)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(w, h)

    // create the scene
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(30, w / h, 1, 3000)
    this.camera.position.set(0, 0, 1000)
    this.scene.add(this.camera)

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbit.minDistance = 0
    this.orbit.maxDistance = 2500

    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(0, 0, 600);

    this.light.castShadow = true;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    this.light.shadow.camera.near = 500;
    this.light.shadow.camera.far = 4000;
    this.light.shadow.camera.fov = 30;

    this.scene.add(this.light);

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

    this.detector = new THREE.BoxGeometry(430, 430, 100)
    this.detector.translate(0, 0, -500)
    this.detector.translate(originOffset.x, originOffset.y, originOffset.z)
    this.scene.add(new THREE.Mesh(this.detector, materialDetector))

    this.x1 = new THREE.BoxGeometry(200, 100, 10)
    this.x1.translate(0, 110, 570)
    this.x1.translate(originOffset.x, originOffset.y, originOffset.z)
    this.scene.add(new THREE.Mesh(this.x1, materialCollimator))
    this.x2 = new THREE.BoxGeometry(200, 100, 10)
    this.x2.translate(0, -110, 570)
    this.x2.translate(originOffset.x, originOffset.y, originOffset.z)
    this.scene.add(new THREE.Mesh(this.x2, materialCollimator))
    this.y1 = new THREE.BoxGeometry(100, 200, 10)
    this.y1.translate(-110, 0, 570)
    this.y1.translate(originOffset.x, originOffset.y, originOffset.z)
    this.scene.add(new THREE.Mesh(this.y1, materialCollimator))
    this.y2 = new THREE.BoxGeometry(100, 200, 10)
    this.y2.translate(110, 0, 570)
    this.y2.translate(originOffset.x, originOffset.y, originOffset.z)
    this.scene.add(new THREE.Mesh(this.y2, materialCollimator))

    LoadedObject.tryAdd(this.drum).subscribe(existing => this.scene.add(existing),
      () => {
        this.drum = new LoadedObject()
        this.drum.origin = new Vector3(0, 0, 0)
        this.drum.normal = new Vector3(0, 0, 1)
        this.drum.position = originOffset
        this.drum.material = this.materialDrum
        this.drum.load(this.baseUrl + 'assets/Isocal-Drum.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
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
        this.markers.normal = new Vector3(0, 0, 1)
        this.markers.position = originOffset
        this.markers.material = this.materialMarkers
        this.markers.load(this.baseUrl + 'assets/Isocal-Markers.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
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
        this.couch.normal = new Vector3(0, 0, 1)
        this.couch.position = new Vector3(0, 200, -115)
        this.couch.material = this.materialCouch
        this.couch.load(this.baseUrl + 'assets/Isocal-Couch.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
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

  //currentX: number = 0

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render()
    })
    this.light.position.x = this.camera.position.x
    this.light.position.y = this.camera.position.y
    this.light.position.z = this.camera.position.z

    //const delta = this.camera.position.x - this.currentX;
    //this.currentX = this.camera.position.x;
    //var rotX = Math.atan(delta / 300);
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
