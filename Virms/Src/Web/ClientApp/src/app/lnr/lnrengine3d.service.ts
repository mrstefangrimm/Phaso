// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/ui/loadedobject.model';

@Injectable({providedIn: 'root'})

export class LnrEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private frameId: number = null

  private backGround: THREE.Color
  private backGroundXray: THREE.Color

  private materialBlue: THREE.Material
  private materialWhite: THREE.Material
  private materialAnthracite: THREE.Material
  private materialSilver: THREE.Material
  private materialGold: THREE.Material
  private materialWood: THREE.Material
  private materialXray: THREE.Material

  groupStaticCoverBlue: LoadableObject
  groupStaticCoverSilver: LoadableObject
  groupStaticBaseSilver: LoadableObject
  groupStaticBaseGold: LoadableObject
  groupStaticBaseAnthracite: LoadableObject
  groupStaticBaseBlue: LoadableObject
  groupCarriageSilver: LoadableObject
  groupCarriageBlue: LoadableObject
  groupCarriageGold: LoadableObject
  groupCarriageAnthracite: LoadableObject
  groupServoArmGold: LoadableObject
  groupServoArmSilver: LoadableObject
  groupServoArmAnthracite: LoadableObject
  groupServoArmBlue: LoadableObject
  groupRotationWhite: LoadableObject
  groupRotationWood: LoadableObject
  groupRotationBlue: LoadableObject
  groupRotationSilver: LoadableObject
  groupExtensionArm: LoadableObject
  
  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(LnrEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(LnrEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.info(LnrEngine3dService.name, "createScene")

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

    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 500)
    this.camera.position.x = 100
    this.camera.position.y = 150
    this.camera.position.z = 150
    this.scene.add(this.camera)

    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 500

    const light = new THREE.PointLight(0xffffff, 2)
    light.position.set(300, 700, 0)
    this.scene.add(light)
    const light2 = new THREE.PointLight(0xffffff, 2)
    light2.position.set(0, -500, 300)
    this.scene.add(light2)

    this.backGround = null
    this.backGroundXray = null
      
    this.materialBlue = new THREE.MeshStandardMaterial({
      color: 0x0000FF,
      roughness: 0.5,
    })   
    this.materialWhite = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
    })
    this.materialAnthracite = new THREE.MeshStandardMaterial({
      color: 0x383E42,
      roughness: 0.5,
    })
    this.materialSilver = new THREE.MeshStandardMaterial({
      color: 0xAAA9AD,
      roughness: 0.5,
      metalness: 1.0,
    })
    this.materialGold = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      roughness: 0.5,
      metalness: 1.0,
    })
    this.materialWood = new THREE.MeshStandardMaterial({
      color: 0xBA8C63,
      roughness: 0.5,
    })
    this.materialXray = new THREE.MeshPhysicalMaterial({
      color: 0x0000FF,
      metalness: 0,
      roughness: 0,
      alphaTest: 0.5,
      depthWrite: false,
      transmission: 0.6,
      opacity: 1,
      transparent: true
    })

    const originOffset = new Vector3(0, 0, 0)

    LoadedObject.tryAdd(this.groupStaticCoverBlue).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticCoverBlue = new LoadedObject()
        this.groupStaticCoverBlue.origin = new Vector3(0, 0, 0)
        this.groupStaticCoverBlue.normal = new Vector3(0, -1, 0)
        this.groupStaticCoverBlue.position = originOffset
        this.groupStaticCoverBlue.material = this.materialBlue
        this.groupStaticCoverBlue.loadInvisible(this.baseUrl + 'assets/LnR-VirmsGroupStaticCoverBlue.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticCoverBlue = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "cover is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticCoverSilver).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticCoverSilver = new LoadedObject()
        this.groupStaticCoverSilver.origin = new Vector3(0, 0, 0)
        this.groupStaticCoverSilver.normal = new Vector3(0, -1, 0)
        this.groupStaticCoverSilver.position = originOffset
        this.groupStaticCoverSilver.material = this.materialSilver
        this.groupStaticCoverSilver.loadInvisible(this.baseUrl + 'assets/LnR-VirmsGroupStaticCoverSilver.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticCoverSilver = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "cover is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticBaseSilver).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticBaseSilver = new LoadedObject()
        this.groupStaticBaseSilver.origin = new Vector3(0, 0, 0)
        this.groupStaticBaseSilver.normal = new Vector3(0, -1, 0)
        this.groupStaticBaseSilver.position = originOffset
        this.groupStaticBaseSilver.material = this.materialSilver
        this.groupStaticBaseSilver.load(this.baseUrl + 'assets/LnR-VirmsGroupStaticBaseSilver.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticBaseSilver = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "base is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticBaseGold).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticBaseGold = new LoadedObject()
        this.groupStaticBaseGold.origin = new Vector3(0, 0, 0)
        this.groupStaticBaseGold.normal = new Vector3(0, -1, 0)
        this.groupStaticBaseGold.position = originOffset
        this.groupStaticBaseGold.material = this.materialGold
        this.groupStaticBaseGold.load(this.baseUrl + 'assets/LnR-VirmsGroupStaticBaseGold.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticBaseGold = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "base is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticBaseAnthracite).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticBaseAnthracite = new LoadedObject()
        this.groupStaticBaseAnthracite.origin = new Vector3(0, 0, 0)
        this.groupStaticBaseAnthracite.normal = new Vector3(0, -1, 0)
        this.groupStaticBaseAnthracite.position = originOffset
        this.groupStaticBaseAnthracite.material = this.materialAnthracite
        this.groupStaticBaseAnthracite.load(this.baseUrl + 'assets/LnR-VirmsGroupStaticBaseAnthracite.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticBaseAnthracite = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "base is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupStaticBaseBlue).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupStaticBaseBlue = new LoadedObject()
        this.groupStaticBaseBlue.origin = new Vector3(0, 0, 0)
        this.groupStaticBaseBlue.normal = new Vector3(0, -1, 0)
        this.groupStaticBaseBlue.position = originOffset
        this.groupStaticBaseBlue.material = this.materialBlue
        this.groupStaticBaseBlue.load(this.baseUrl + 'assets/LnR-VirmsGroupStaticBaseBlue.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupStaticBaseBlue = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "base not shown")
          })
      })
    LoadedObject.tryAdd(this.groupCarriageSilver).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupCarriageSilver = new LoadedObject()
        this.groupCarriageSilver.origin = new Vector3(0, 0, 0)
        this.groupCarriageSilver.normal = new Vector3(0, -1, 0)
        this.groupCarriageSilver.position = originOffset
        this.groupCarriageSilver.material = this.materialSilver
        this.groupCarriageSilver.load(this.baseUrl + 'assets/LnR-VirmsGroupCarriageSilver.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupCarriageSilver = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "carriage is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupCarriageBlue).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupCarriageBlue = new LoadedObject()
        this.groupCarriageBlue.origin = new Vector3(0, 0, 0)
        this.groupCarriageBlue.normal = new Vector3(0, -1, 0)
        this.groupCarriageBlue.position = originOffset
        this.groupCarriageBlue.material = this.materialBlue
        this.groupCarriageBlue.load(this.baseUrl + 'assets/LnR-VirmsGroupCarriageBlue.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupCarriageBlue = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "carriage is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupCarriageGold).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupCarriageGold = new LoadedObject()
        this.groupCarriageGold.origin = new Vector3(0, 0, 0)
        this.groupCarriageGold.normal = new Vector3(0, -1, 0)
        this.groupCarriageGold.position = originOffset
        this.groupCarriageGold.material = this.materialGold
        this.groupCarriageGold.load(this.baseUrl + 'assets/LnR-VirmsGroupCarriageGold.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupCarriageGold = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "carriage is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupCarriageAnthracite).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupCarriageAnthracite = new LoadedObject()
        this.groupCarriageAnthracite.origin = new Vector3(0, 0, 0)
        this.groupCarriageAnthracite.normal = new Vector3(0, -1, 0)
        this.groupCarriageAnthracite.position = originOffset
        this.groupCarriageAnthracite.material = this.materialAnthracite
        this.groupCarriageAnthracite.load(this.baseUrl + 'assets/LnR-VirmsGroupCarriageAnthracite.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupCarriageAnthracite = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "carriage is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupServoArmGold).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupServoArmGold = new LoadedObject()
        this.groupServoArmGold.origin = new Vector3(10.14, -46.93, 0)
        this.groupServoArmGold.normal = new Vector3(0, -1, 0)
        this.groupServoArmGold.position = originOffset
        this.groupServoArmGold.material = this.materialGold
        this.groupServoArmGold.load(this.baseUrl + 'assets/LnR-VirmsGroupServoArmGold.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupServoArmGold = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "servo is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupServoArmSilver).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupServoArmSilver = new LoadedObject()
        this.groupServoArmSilver.origin = new Vector3(10.14, -46.93, 0)
        this.groupServoArmSilver.normal = new Vector3(0, -1, 0)
        this.groupServoArmSilver.position = originOffset
        this.groupServoArmSilver.material = this.materialSilver
        this.groupServoArmSilver.load(this.baseUrl + 'assets/LnR-VirmsGroupServoArmSilver.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupServoArmSilver = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "servo is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupServoArmAnthracite).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupServoArmAnthracite = new LoadedObject()
        this.groupServoArmAnthracite.origin = new Vector3(10.14, -46.93, 0)
        this.groupServoArmAnthracite.normal = new Vector3(0, -1, 0)
        this.groupServoArmAnthracite.position = originOffset
        this.groupServoArmAnthracite.material = this.materialAnthracite
        this.groupServoArmAnthracite.load(this.baseUrl + 'assets/LnR-VirmsGroupServoArmAnthracite.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupServoArmAnthracite = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "servo is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupServoArmBlue).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupServoArmBlue = new LoadedObject()
        this.groupServoArmBlue.origin = new Vector3(10.14, -46.93, 0)
        this.groupServoArmBlue.normal = new Vector3(0, -1, 0)
        this.groupServoArmBlue.position = originOffset
        this.groupServoArmBlue.material = this.materialBlue
        this.groupServoArmBlue.load(this.baseUrl + 'assets/LnR-VirmsGroupServoArmBlue.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupServoArmBlue = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "servo is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupRotationWhite).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupRotationWhite = new LoadedObject()
        this.groupRotationWhite.origin = new Vector3(8.43, 0, -19)
        this.groupRotationWhite.normal = new Vector3(0, -1, 0)
        this.groupRotationWhite.position = originOffset
        this.groupRotationWhite.material = this.materialWhite
        this.groupRotationWhite.load(this.baseUrl + 'assets/LnR-VirmsGroupRotationWhite.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupRotationWhite = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "rotation group is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupRotationWood).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupRotationWood = new LoadedObject()
        this.groupRotationWood.origin = new Vector3(8.43, 0, -19)
        this.groupRotationWood.normal = new Vector3(0, -1, 0)
        this.groupRotationWood.position = originOffset
        this.groupRotationWood.material = this.materialWood
        this.groupRotationWood.load(this.baseUrl + 'assets/LnR-VirmsGroupRotationWood.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupRotationWood = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "rotation group is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupRotationBlue).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupRotationBlue = new LoadedObject()
        this.groupRotationBlue.origin = new Vector3(8.43, 0, -19)
        this.groupRotationBlue.normal = new Vector3(0, -1, 0)
        this.groupRotationBlue.position = originOffset
        this.groupRotationBlue.material = this.materialBlue
        this.groupRotationBlue.load(this.baseUrl + 'assets/LnR-VirmsGroupRotationBlue.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupRotationBlue = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "rotation group is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupRotationSilver).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupRotationSilver = new LoadedObject()
        this.groupRotationSilver.origin = new Vector3(8.43, 0, -19)
        this.groupRotationSilver.normal = new Vector3(0, -1, 0)
        this.groupRotationSilver.position = originOffset
        this.groupRotationSilver.material = this.materialSilver
        this.groupRotationSilver.load(this.baseUrl + 'assets/LnR-VirmsGroupRotationSilver.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupRotationSilver = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "rotation group is not shown")
          })
      })
    LoadedObject.tryAdd(this.groupExtensionArm).subscribe(existing => this.scene.add(existing),
      () => {
        this.groupExtensionArm = new LoadedObject()
        this.groupExtensionArm.origin = new Vector3(0.65, 2.41, 0)
        this.groupExtensionArm.normal = new Vector3(0, -1, 0)
        this.groupExtensionArm.position = originOffset
        this.groupExtensionArm.material = this.materialBlue
        this.groupExtensionArm.load(this.baseUrl + 'assets/LnR-VirmsGroupExtensionArm.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.groupExtensionArm = new NotLoadedObject()
            console.warn(LnrEngine3dService.name, "createScene", "extension arm is not shown")
          })
      })
  }

  animate() {
    console.debug(LnrEngine3dService.name, "animate")

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

  setTransparent(transparent: boolean) {
    console.info(LnrEngine3dService.name, "setTransparent", transparent)
    if (transparent) {
      this.scene.background = this.backGroundXray

      this.groupStaticCoverBlue.setMaterial(this.materialXray)
      this.groupStaticCoverSilver.setMaterial(this.materialXray)
      this.groupStaticBaseSilver.setMaterial(this.materialXray)
      this.groupStaticBaseGold.setMaterial(this.materialXray)
      this.groupStaticBaseAnthracite.setMaterial(this.materialXray)
      this.groupStaticBaseBlue.setMaterial(this.materialXray)
      this.groupCarriageSilver.setMaterial(this.materialXray)
      this.groupCarriageBlue.setMaterial(this.materialXray)
      this.groupCarriageGold.setMaterial(this.materialXray)
      this.groupCarriageAnthracite.setMaterial(this.materialXray)
      this.groupServoArmGold.setMaterial(this.materialXray)
      this.groupServoArmSilver.setMaterial(this.materialXray)
      this.groupServoArmAnthracite.setMaterial(this.materialXray)
      this.groupServoArmBlue.setMaterial(this.materialXray)
      this.groupRotationWhite.setMaterial(this.materialXray)
      this.groupRotationWood.setMaterial(this.materialXray)
      this.groupRotationBlue.setMaterial(this.materialXray)
      this.groupRotationSilver.setMaterial(this.materialXray)
      this.groupExtensionArm.setMaterial(this.materialXray)
    }
    else {
      this.scene.background = this.backGround

      this.groupStaticCoverBlue.setMaterial(this.materialBlue)
      this.groupStaticCoverSilver.setMaterial(this.materialSilver)
      this.groupStaticBaseSilver.setMaterial(this.materialSilver)
      this.groupStaticBaseGold.setMaterial(this.materialGold)
      this.groupStaticBaseAnthracite.setMaterial(this.materialAnthracite)
      this.groupStaticBaseBlue.setMaterial(this.materialBlue)
      this.groupCarriageSilver.setMaterial(this.materialSilver)
      this.groupCarriageBlue.setMaterial(this.materialBlue)
      this.groupCarriageGold.setMaterial(this.materialGold)
      this.groupCarriageAnthracite.setMaterial(this.materialAnthracite)
      this.groupServoArmGold.setMaterial(this.materialGold)
      this.groupServoArmSilver.setMaterial(this.materialSilver)
      this.groupServoArmAnthracite.setMaterial(this.materialAnthracite)
      this.groupServoArmBlue.setMaterial(this.materialBlue)
      this.groupRotationWhite.setMaterial(this.materialWhite)
      this.groupRotationWood.setMaterial(this.materialWood)
      this.groupRotationBlue.setMaterial(this.materialBlue)
      this.groupRotationSilver.setMaterial(this.materialSilver)
      this.groupExtensionArm.setMaterial(this.materialBlue)
    }
  
  }

}
