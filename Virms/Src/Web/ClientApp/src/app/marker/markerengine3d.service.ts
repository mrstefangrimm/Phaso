// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model'
import { ThreeObject } from '../shared/ui/threeobject.model'

@Injectable({providedIn: 'root'})

export class MarkerEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.AmbientLight
  private frameId: number = null

  private meshes = []

  private backGround: THREE.Color
  private backGroundXray: THREE.Color
  private materialTissue: THREE.Material
  private materialTissueXray: THREE.Material
  private materialMarker: THREE.Material
  private materialMarkerXray: THREE.Material
  private materialGraphite: THREE.Material
  private materialGraphiteXray: THREE.Material

  body: LoadableObject
  bodyRigidMarkers: LoadableObject

  // TODO - target was added for testing, please remove
  //target: LoadableObject

  cylinderLeftUpper: ThreeObject
  markerLeftUpper: ThreeObject
  cylinderLeftLower: ThreeObject
  markerLeftLower: ThreeObject
  cylinderRightUpper: ThreeObject
  markerRightUpper: ThreeObject
  cylinderRightLower: ThreeObject
  markerRightLower: ThreeObject

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
    this.meshes.forEach(m => this.scene.remove(m))
    this.materialTissue.dispose()
    this.materialTissueXray.dispose()
    this.materialMarker.dispose()
    this.materialMarkerXray.dispose()
    this.materialGraphite.dispose()
    this.materialGraphiteXray.dispose()
    this.cylinderLeftUpper.dispose()
    this.markerLeftUpper.dispose()
    this.cylinderLeftLower.dispose()
    this.markerLeftLower.dispose()
    this.cylinderRightUpper.dispose()
    this.markerRightUpper.dispose()
    this.cylinderRightLower.dispose()
    this.markerRightLower.dispose()
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, width: number, height: number) {
    console.info(MarkerEngine3dService.name, "createScene")

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

    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 500)
    this.camera.position.set(-100, 100, 120)
    this.scene.add(this.camera)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 2000

    //var axesHelper = new THREE.AxesHelper(50)
    //this.scene.add(axesHelper)

    // soft white light
    this.light = new THREE.AmbientLight(0x404040)
    this.light.position.y = 1000
    this.light.position.z = 1000
    this.scene.add(this.light)

    this.backGround = null
    this.backGroundXray = new THREE.Color(0x000000)
    this.materialMarker = new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: false })
    this.materialMarkerXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: false })
    this.materialGraphite = new THREE.MeshBasicMaterial({ color: 0xAAAAAA, opacity: 0.6, transparent: false })
    this.materialGraphiteXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.6, transparent: false })

    this.materialTissue = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.8,
      opacity: 1,
      transparent: true
    })
    this.materialTissueXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.4,
      opacity: 1,
      transparent: true
    })

    const cadDirection = new Vector3(0, -1, 0)

    LoadedObject.tryAdd(this.body).subscribe(existing => this.scene.add(existing),
      () => {
        this.body = new LoadedObject()
        this.body.origin = new Vector3(0, 0, 0)
        this.body.directionVector = cadDirection
        this.body.position = new Vector3(0, 0, 0)
        this.body.material = this.materialTissue
        this.body.load(this.baseUrl + 'assets/Gris5A-Body.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.body = new NotLoadedObject()
            console.warn(MarkerEngine3dService.name, "createScene", "body is not shown")
          })
      })

    LoadedObject.tryAdd(this.bodyRigidMarkers).subscribe(existing => this.scene.add(existing),
      () => {
        this.bodyRigidMarkers = new LoadedObject()
        this.bodyRigidMarkers.origin = new Vector3(0, 0, 0)
        this.bodyRigidMarkers.directionVector = cadDirection
        this.bodyRigidMarkers.position = new Vector3(0, 0, 0)
        this.bodyRigidMarkers.material = this.materialTissue
        this.bodyRigidMarkers.load(this.baseUrl + 'assets/Gris5A-BodyRigidMarkers.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.bodyRigidMarkers = new NotLoadedObject()
            console.warn(MarkerEngine3dService.name, "createScene", "rigid markers are not shown")
          })
      })

    this.cylinderLeftUpper = new ThreeObject()
    this.cylinderLeftUpper.fromWorldToLocalOrigin = new Vector3(-25, 25, 0)
    this.cylinderLeftUpper.position = new Vector3(0, 0, 0)
    this.cylinderLeftUpper.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderLeftUpper.geometry.rotateX(Math.PI / 2)
    this.cylinderLeftUpper.material = this.materialTissue
    this.cylinderLeftUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.markerLeftUpper = new ThreeObject()
    this.markerLeftUpper.fromWorldToLocalOrigin = new Vector3(-25, 25, 0)
    this.markerLeftUpper.position = new Vector3(10.606, -10.606, 2)
    this.markerLeftUpper.geometry = new THREE.CylinderGeometry(1, 1, 8, 32)
    this.markerLeftUpper.geometry.rotateX(Math.PI / 2)
    this.markerLeftUpper.material = this.materialMarker
    this.markerLeftUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.cylinderLeftLower = new ThreeObject()
    this.cylinderLeftLower.fromWorldToLocalOrigin = new Vector3(-25, -25, 0)
    this.cylinderLeftLower.position = new Vector3(0, 0, 0)
    this.cylinderLeftLower.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderLeftLower.geometry.rotateX(Math.PI / 2)
    this.cylinderLeftLower.material = this.materialTissue
    this.cylinderLeftLower.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.markerLeftLower = new ThreeObject()
    this.markerLeftLower.fromWorldToLocalOrigin = new Vector3(-25, -25, 0)
    this.markerLeftLower.position = new Vector3(10.606, 10.606, 22)
    this.markerLeftLower.geometry = new THREE.CylinderGeometry(1, 1, 8, 32)
    this.markerLeftLower.geometry.rotateX(Math.PI / 2)
    this.markerLeftLower.material = this.materialMarker
    this.markerLeftLower.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.cylinderRightUpper = new ThreeObject()
    this.cylinderRightUpper.fromWorldToLocalOrigin = new Vector3(25, 25, 0)
    this.cylinderRightUpper.position = new Vector3(0, 0, 0)
    this.cylinderRightUpper.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderRightUpper.geometry.rotateX(Math.PI / 2)
    this.cylinderRightUpper.material = this.materialTissue
    this.cylinderRightUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.markerRightUpper = new ThreeObject()
    this.markerRightUpper.fromWorldToLocalOrigin = new Vector3(25, 25, 0)
    this.markerRightUpper.position = new Vector3(-10.606, -10.606, -18)
    this.markerRightUpper.geometry = new THREE.CylinderGeometry(1, 1, 8, 32)
    this.markerRightUpper.geometry.rotateX(Math.PI / 2)
    this.markerRightUpper.material = this.materialMarker
    this.markerRightUpper.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    //LoadedObject.tryAdd(this.target).subscribe(existing => this.scene.add(existing),
    //  () => {
    //    this.target = new LoadedObject()
    //    this.target.origin = new Vector3(-35.2, 0, -45)
    //    this.target.directionVector = cadDirection
    //    this.target.position = new Vector3(-35.2 + 25, -45 + 25, 0)
    //    this.target.material = this.materialMarker
    //    this.target.load(this.baseUrl + 'assets/No3-LungLeftUpperCylinderInsert.obj').subscribe(
    //      object3d => {
    //        this.scene.add(object3d)
    //        this.meshes.push(object3d)
    //      },
    //      () => {
    //        this.target = new NotLoadedObject()
    //        console.warn(MarkerEngine3dService.name, "createScene", "primary target is not shown")
    //      })
    //  })

    this.cylinderRightLower = new ThreeObject()
    this.cylinderRightLower.fromWorldToLocalOrigin = new Vector3(25, -25, 0)
    this.cylinderRightLower.position = new Vector3(0, 0, 0)
    this.cylinderRightLower.geometry = new THREE.CylinderGeometry(15, 15, 96, 32)
    this.cylinderRightLower.geometry.rotateX(Math.PI / 2)
    this.cylinderRightLower.material = this.materialTissue
    this.cylinderRightLower.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
      })

    this.markerRightLower = new ThreeObject()
    this.markerRightLower.fromWorldToLocalOrigin = new Vector3(25, -25, 0)
    this.markerRightLower.position = new Vector3(-10.606, 10.606, -2)
    this.markerRightLower.geometry = new THREE.CylinderGeometry(1, 1, 8, 32)
    this.markerRightLower.geometry.rotateX(Math.PI / 2)
    this.markerRightLower.material = this.materialMarker
    this.markerRightLower.build().subscribe(
      object3d => {
        this.scene.add(object3d)
        this.meshes.push(object3d)
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
      this.bodyRigidMarkers.setMaterial(this.materialGraphiteXray)

      this.cylinderLeftUpper.setMaterial(this.materialTissueXray)
      this.cylinderLeftLower.setMaterial(this.materialTissueXray)
      this.cylinderRightUpper.setMaterial(this.materialTissueXray)
      this.cylinderRightLower.setMaterial(this.materialTissueXray)

      this.markerLeftUpper.setMaterial(this.materialMarkerXray)
      this.markerLeftLower.setMaterial(this.materialMarkerXray)
      this.markerRightUpper.setMaterial(this.materialMarkerXray)
      this.markerRightLower.setMaterial(this.materialMarkerXray)
    }
    else {
      this.scene.background = this.backGround

      this.body.setMaterial(this.materialTissue)
      this.bodyRigidMarkers.setMaterial(this.materialGraphite)

      this.cylinderLeftUpper.setMaterial(this.materialTissue)
      this.cylinderLeftLower.setMaterial(this.materialTissue)
      this.cylinderRightUpper.setMaterial(this.materialTissue)
      this.cylinderRightLower.setMaterial(this.materialTissue)

      this.markerLeftUpper.setMaterial(this.materialMarker)
      this.markerLeftLower.setMaterial(this.materialMarker)
      this.markerRightUpper.setMaterial(this.materialMarker)
      this.markerRightLower.setMaterial(this.materialMarker)
    }
  }

}
