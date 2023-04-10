// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model'

@Injectable({providedIn: 'root'})

export class LungEngine3dService implements OnDestroy {

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
  private materialLeftLungInsertXray: THREE.Material

  private materialSkeleton: THREE.Material
  private materialSkeletonXray: THREE.Material
  private materialLungs: THREE.Material
  private materialLungsXray: THREE.Material

  private materialTarget: THREE.Material
  private materialTargetXray: THREE.Material

  chest: LoadableObject
  skeleton: LoadableObject

  lungRight: LoadableObject

  lungLeft: LoadableObject
  lungLeftInsert: LoadableObject

  upperCylinder: LoadableObject
  lowerCylinder: LoadableObject

  target: LoadableObject
  secondTarget: LoadableObject

  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(LungEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(LungEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
    this.meshes.forEach(m => this.scene.remove(m))
    this.materialTissue.dispose()
    this.materialTissueXray.dispose()
    this.materialLeftLungInsertXray.dispose()
    this.materialSkeleton.dispose()
    this.materialSkeletonXray.dispose()
    this.materialLungs.dispose()
    this.materialLungsXray.dispose()
    this.materialTarget.dispose()
    this.materialTargetXray.dispose()
    this.chest.dispose()
    this.skeleton.dispose()
    this.lungRight.dispose()
    this.lungLeft.dispose()
    this.lungLeftInsert.dispose()
    this.upperCylinder.dispose()
    this.lowerCylinder.dispose()
    this.target.dispose()
    this.secondTarget.dispose()
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, width: number, height: number) {
    console.info(LungEngine3dService.name, "createScene")

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

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 2000

    this.light = new THREE.SpotLight(0xFFFFFF)
    this.light.position.set(0, 1000, 0)

    this.light.castShadow = true

    this.light.shadow.mapSize.width = 1024
    this.light.shadow.mapSize.height = 1024

    this.light.shadow.camera.near = 5000
    this.light.shadow.camera.far = 4000
    this.light.shadow.camera.fov = 300

    this.scene.add(this.light)

    this.backGround = null
    this.backGroundXray = new THREE.Color(0x000000)

    this.materialSkeleton = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.6, transparent: true })
    this.materialSkeletonXray = new THREE.MeshPhysicalMaterial({
      color: 0xFDFDFD,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0,
      opacity: 0.6,
      transparent: false
    })
    this.materialTarget = new THREE.MeshBasicMaterial({ color: 0xFF0000, opacity: 0.2, transparent: true })
    this.materialTargetXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.4, transparent: true })
    this.materialTissue = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.7,
      opacity: 1,
      transparent: true
    })
    this.materialTissueXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.1,
      opacity: 0.6,
      transparent: true
    })
    this.materialLeftLungInsertXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.4, transparent: true })
    this.materialLungs = new THREE.MeshPhysicalMaterial({
      color: 0x0000FF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.6,
      opacity: 1,
      transparent: true
    })
   this.materialLungsXray = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0,
      opacity: 0.4,
      transparent: true
    })

    const originOffset = new Vector3(0, 0, 0)

    LoadedObject.tryAdd(this.chest).subscribe(existing => this.scene.add(existing),
      () => {
        this.chest = new LoadedObject()
        this.chest.origin = new Vector3(0, 0, 0)
        this.chest.directionVector = new Vector3(0, -1, 0)
        this.chest.position = originOffset
        this.chest.material = this.materialTissue
        this.chest.load(this.baseUrl + 'assets/No3-ChestPositive.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.chest = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "chest is not shown")
          })
      })

    LoadedObject.tryAdd(this.skeleton).subscribe(existing => this.scene.add(existing),
      () => {
        this.skeleton = new LoadedObject()
        this.skeleton.origin = new Vector3(0, 0, 0)
        this.skeleton.directionVector = new Vector3(0, -1, 0)
        this.skeleton.position = originOffset
        this.skeleton.material = this.materialSkeleton
        this.skeleton.load(this.baseUrl + 'assets/No3-Skeleton.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.skeleton = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "skeleton is not shown")
          })
      })

    LoadedObject.tryAdd(this.lungRight).subscribe(existing => this.scene.add(existing),
      () => {
        this.lungRight = new LoadedObject()
        this.lungRight.origin = new Vector3(0, 0, 0)
        this.lungRight.directionVector = new Vector3(0, -1, 0)
        this.lungRight.position = originOffset
        this.lungRight.material = this.materialLungs
        this.lungRight.load(this.baseUrl + 'assets/No3-LungRight.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.lungRight = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "lung right is not shown")
          })
      })

    LoadedObject.tryAdd(this.lungLeft).subscribe(existing => this.scene.add(existing),
      () => {
        this.lungLeft = new LoadedObject()
        this.lungLeft.origin = new Vector3(0, 0, 0)
        this.lungLeft.directionVector = new Vector3(0, -1, 0)
        this.lungLeft.position = originOffset
        this.lungLeft.material = this.materialLungs
        this.lungLeft.load(this.baseUrl + 'assets/No3-LungLeft.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.lungLeft = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "lung left is not shown")
          })
      })

    LoadedObject.tryAdd(this.lungLeftInsert).subscribe(existing => this.scene.add(existing),
      () => {
        this.lungLeftInsert = new LoadedObject()
        this.lungLeftInsert.origin = new Vector3(0, 0, 0)
        this.lungLeftInsert.directionVector = new Vector3(0, -1, 0)
        this.lungLeftInsert.position = originOffset
        this.lungLeftInsert.material = this.materialTissue
        this.lungLeftInsert.load(this.baseUrl + 'assets/No3-LungLeftInsert.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.lungLeftInsert = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "lung left insert is not shown")
          })
      })

    LoadedObject.tryAdd(this.upperCylinder).subscribe(existing => this.scene.add(existing),
      () => {
        this.upperCylinder = new LoadedObject()
        this.upperCylinder.origin = new Vector3(-35.2, 0, -45)
        this.upperCylinder.directionVector = new Vector3(0, -1, 0)
        this.upperCylinder.position = originOffset
        this.upperCylinder.material = this.materialLungs
        this.upperCylinder.load(this.baseUrl + 'assets/No3-LungLeftUpperCylinder.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.upperCylinder = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "upper cylinder is not shown")
          })
      })

    LoadedObject.tryAdd(this.target).subscribe(existing => this.scene.add(existing),
      () => {
        this.target = new LoadedObject()
        this.target.origin = new Vector3(-35.2, 0, -45)
        this.target.directionVector = new Vector3(0, -1, 0)
        this.target.position = originOffset
        this.target.material = this.materialTarget
        this.target.load(this.baseUrl + 'assets/No3-LungLeftUpperCylinderInsert.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.target = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "primary target is not shown")
          })
      })

    LoadedObject.tryAdd(this.lowerCylinder).subscribe(existing => this.scene.add(existing),
      () => {
        this.lowerCylinder = new LoadedObject()
        this.lowerCylinder.origin = new Vector3(-35.2, 0, 45)
        this.lowerCylinder.directionVector = new Vector3(0, -1, 0)
        this.lowerCylinder.position = originOffset
        this.lowerCylinder.material = this.materialLungs
        this.lowerCylinder.load(this.baseUrl + 'assets/No3-LungLeftLowerCylinder.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.lowerCylinder = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "lower cylinder is not shown")
          })
      })

    LoadedObject.tryAdd(this.secondTarget).subscribe(existing => this.scene.add(existing),
      () => {
        this.secondTarget = new LoadedObject()
        this.secondTarget.origin = new Vector3(-35.2, 0, 45)
        this.secondTarget.directionVector = new Vector3(0, -1, 0)
        this.secondTarget.position = originOffset
        this.secondTarget.material = this.materialTarget
        this.secondTarget.load(this.baseUrl + 'assets/No3-LungLeftLowerCylinderInsert.obj').subscribe(
          object3d => {
            this.scene.add(object3d)
            this.meshes.push(object3d)
          },
          () => {
            this.secondTarget = new NotLoadedObject()
            console.warn(LungEngine3dService.name, "createScene", "secondary target is not shown")
          })
      })
  }

  animate() {
    console.debug(LungEngine3dService.name, "animate")

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
    console.info(LungEngine3dService.name, "setXray", xray)
    if (xray) {
      this.scene.background = this.backGroundXray

      this.chest.setMaterial(this.materialTissueXray)
      this.skeleton.setMaterial(this.materialSkeletonXray)
      this.lungRight.setMaterial(this.materialLungsXray)
      this.lungLeft.setMaterial(this.materialLungsXray)
      this.lungLeftInsert.setMaterial(this.materialLeftLungInsertXray)
      this.upperCylinder.setMaterial(this.materialLungsXray)
      this.target.setMaterial(this.materialTargetXray)
      this.lowerCylinder.setMaterial(this.materialLungsXray)
      this.secondTarget.setMaterial(this.materialTargetXray)
    }
    else {
      this.scene.background = this.backGround

      this.chest.setMaterial(this.materialTissue)
      this.skeleton.setMaterial(this.materialSkeleton)
      this.lungRight.setMaterial(this.materialLungs)
      this.lungLeft.setMaterial(this.materialLungs)
      this.lungLeftInsert.setMaterial(this.materialTissue)
      this.upperCylinder.setMaterial(this.materialLungs)
      this.target.setMaterial(this.materialTarget)
      this.lowerCylinder.setMaterial(this.materialLungs)
      this.secondTarget.setMaterial(this.materialTarget)
    }
  }

}
