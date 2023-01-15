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

  private backGround: THREE.Color
  private backGroundXray: THREE.Color

  private materialDrum: THREE.Material
  private materialMarkers: THREE.Material
  private materialDrumXray: THREE.Material
  private materialMarkersXray: THREE.Material

  groupStaticDrum: LoadableObject
  groupStaticMarkers: LoadableObject
  detector: THREE.BufferGeometry

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

    //this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 500)
    this.camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, 1, 1000);
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 300
    this.scene.add(this.camera)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 500

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
    this.materialMarkers = new THREE.MeshStandardMaterial({
      color: 0xAAA9AD,
      metalness: 1.0,
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

    this.detector = new THREE.BoxGeometry(400, 400, 100)
    this.detector.translate(0, 0, -200)
    const material = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
    })

    const mesh = new THREE.Mesh(this.detector, material)
    this.scene.add(mesh)

    const originOffset = new Vector3(0, 0, 0)

    LoadedObject.tryAdd(this.groupStaticDrum).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticDrum = new LoadedObject()
        this.groupStaticDrum.origin = new Vector3(0.65, 2.41, 0)
        this.groupStaticDrum.normal = new Vector3(0, -1, 0)
        this.groupStaticDrum.position = originOffset
        this.groupStaticDrum.material = this.materialDrum
        this.groupStaticDrum.load(this.baseUrl + 'assets/Isocal-Drum.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticDrum = new NotLoadedObject()
            console.warn(IsocalEngine3dService.name, "createScene", "drum is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticMarkers).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticMarkers = new LoadedObject()
        this.groupStaticMarkers.origin = new Vector3(0.65, 2.41, 0)
        this.groupStaticMarkers.normal = new Vector3(0, -1, 0)
        this.groupStaticMarkers.position = originOffset
        this.groupStaticMarkers.material = this.materialMarkers
        this.groupStaticMarkers.load(this.baseUrl + 'assets/Isocal-Markers.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticMarkers = new NotLoadedObject()
            console.warn(IsocalEngine3dService.name, "createScene", "markers are not shown")
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

  currentX: number = 0

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render()
    })
    this.light.position.x = this.camera.position.x
    this.light.position.y = this.camera.position.y
    this.light.position.z = this.camera.position.z

    const delta = this.camera.position.x - this.currentX;
    this.currentX = this.camera.position.x;
    var rotX = Math.atan(delta / 300);
    //console.info(this.camera.position.x, delta, -rotX)
    this.detector.rotateY(rotX)

    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const w = this.canvas.width
    const h = this.canvas.height

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(w, h)
  }

  setXray(transparent: boolean) {
    console.info(IsocalEngine3dService.name, "setTransparent", transparent)
    if (transparent) {
      this.scene.background = this.backGroundXray

      this.groupStaticDrum.setMaterial(this.materialDrumXray)
      this.groupStaticMarkers.setMaterial(this.materialMarkersXray)
    }
    else {
      this.scene.background = this.backGround

      this.groupStaticDrum.setMaterial(this.materialDrum)
      this.groupStaticMarkers.setMaterial(this.materialMarkers)
    }

  }

}
