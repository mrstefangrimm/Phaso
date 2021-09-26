// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import * as THREE from 'three'
import { Vector3 } from 'three'
import { ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { OrbitControls } from 'three-orbitcontrols-ts'
import { LoadableObject, LoadedObject, NotLoadedObject } from '../shared/loadedobject.model';

@Injectable({providedIn: 'root'})

export class LiverEngine3dService implements OnDestroy {

  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private light: THREE.AmbientLight
  private frameId: number = null

  private backGround: THREE.Color
  private backGroundXray: THREE.Color
  private materialLiver: THREE.Material
  private materialLiver2: THREE.Material
  private materialLiverXray: THREE.Material
  private materialLiverXray2: THREE.Material
  private materialSecondTarget: THREE.Material
  private materialSecondTargetXray: THREE.Material
  private materialMarker: THREE.Material
  private materialMarkerXray: THREE.Material
  private materialTissue: THREE.Material
  private materialTissueXray: THREE.Material

  body: LoadableObject
  bodyInsertCenter: LoadableObject
  bodyInsertBack: LoadableObject

  cylinderLeft: LoadableObject
  cylinderLeftCylinder: LoadableObject
  cylinderLeftInsertCenter: LoadableObject
  cylinderLeftInsertBack: LoadableObject

  cylinderLeftMarkers: LoadableObject

  cylinderRight: LoadableObject
  cylinderRightCylinderCenter: LoadableObject
  cylinderRightCylinderBack: LoadableObject
  cylinderRightInsertCenter: LoadableObject
  cylinderRightInsertBack: LoadableObject

  public constructor(
    private ngZone: NgZone,
    @Inject('BASE_URL') private readonly baseUrl: string) {
    console.info(LiverEngine3dService.name, "constructor", "base url", this.baseUrl)
  }

  ngOnDestroy() {
    console.info(LiverEngine3dService.name, "ngOnDestroy")
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId)
    }
    this.frameId = null
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.info(LiverEngine3dService.name, "createScene")

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
    this.camera.position.x = -100
    this.camera.position.y = 100
    this.camera.position.z = 130
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
    this.materialLiver = new THREE.MeshBasicMaterial({ color: 0xEE0000, opacity: 0.2, transparent: true })
    this.materialLiverXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.4, transparent: true })
    this.materialLiver2 = new THREE.MeshBasicMaterial({ color: 0xDD0000, opacity: 0.2, transparent: true })
    this.materialLiverXray2 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.1, transparent: true })
    this.materialSecondTarget = new THREE.MeshBasicMaterial({ color: 0x0000EE, opacity: 0.2, transparent: true })
    this.materialSecondTargetXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.6, transparent: true })
    this.materialMarker = new THREE.MeshBasicMaterial({ color: 0xFFFF00, transparent: false })
    this.materialMarkerXray = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: false })

    this.materialTissue = new THREE.MeshPhysicalMaterial({
      color: 0x0000AA,
      metalness: 0,
      roughness: 0,
      //alphaMap: texture,
      alphaTest: 0.5,
      //envMap: hdrCubeRenderTarget.texture,
      //envMapIntensity: params.envMapIntensity,
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
      transmission: 0.3,
      opacity: 1,
      transparent: true
    })

    const originOffset = new Vector3(-40, 0, 50)

    LoadedObject.tryAdd(this.body).subscribe(existing => this.scene.add(existing),
      () => {
        this.body = new LoadedObject()
        this.body.origin = new Vector3(0, 0, 0)
        this.body.normal = new Vector3(0, -1, 0)
        this.body.position = originOffset
        this.body.material = this.materialTissue
        this.body.load(this.baseUrl + 'assets/No2-Body.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.body = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "body is not shown")
          })
      })

    LoadedObject.tryAdd(this.bodyInsertCenter).subscribe(existing => this.scene.add(existing),
      () => {
        this.bodyInsertCenter = new LoadedObject()
        this.bodyInsertCenter.origin = new Vector3(0, 0, 0)
        this.bodyInsertCenter.normal = new Vector3(0, -1, 0)
        this.bodyInsertCenter.position = originOffset
        this.bodyInsertCenter.material = this.materialLiver
        this.bodyInsertCenter.load(this.baseUrl + 'assets/No2-BodyInsertCenter.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.bodyInsertCenter = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "bodyInsertCenter is not shown")
          })
      })

    LoadedObject.tryAdd(this.bodyInsertBack).subscribe(existing => this.scene.add(existing),
      () => {
        this.bodyInsertBack = new LoadedObject()
        this.bodyInsertBack.origin = new Vector3(0, 0, 0)
        this.bodyInsertBack.normal = new Vector3(0, -1, 0)
        this.bodyInsertBack.position = originOffset
        this.bodyInsertBack.material = this.materialTissue
        this.bodyInsertBack.load(this.baseUrl + 'assets/No2-BodyInsertBack.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.bodyInsertBack = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "bodyInsertBack is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderLeft).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderLeft = new LoadedObject()
        this.cylinderLeft.origin = new Vector3(0, 0, 0)
        this.cylinderLeft.normal = new Vector3(0, -1, 0)
        this.cylinderLeft.position = originOffset
        this.cylinderLeft.material = this.materialTissue
        this.cylinderLeft.load(this.baseUrl + 'assets/No2-CylinderLeft.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderLeft = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderLeft is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderLeftCylinder).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderLeftCylinder = new LoadedObject()
        this.cylinderLeftCylinder.origin = new Vector3(0, 0, 0)
        this.cylinderLeftCylinder.normal = new Vector3(0, -1, 0)
        this.cylinderLeftCylinder.position = originOffset
        this.cylinderLeftCylinder.material = this.materialLiver2
        this.cylinderLeftCylinder.load(this.baseUrl + 'assets/No2-CylinderLeftCylinder.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderLeftCylinder = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderLeftCylinder is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderLeftInsertCenter).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderLeftInsertCenter = new LoadedObject()
        this.cylinderLeftInsertCenter.origin = new Vector3(0, 0, 0)
        this.cylinderLeftInsertCenter.normal = new Vector3(0, -1, 0)
        this.cylinderLeftInsertCenter.position = originOffset
        this.cylinderLeftInsertCenter.material = this.materialLiver
        this.cylinderLeftInsertCenter.load(this.baseUrl + 'assets/No2-CylinderLeftInsertCenter.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderLeftInsertCenter = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderLeftInsertCenter is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderLeftInsertBack).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderLeftInsertBack = new LoadedObject()
        this.cylinderLeftInsertBack.origin = new Vector3(0, 0, 0)
        this.cylinderLeftInsertBack.normal = new Vector3(0, -1, 0)
        this.cylinderLeftInsertBack.position = originOffset
        this.cylinderLeftInsertBack.material = this.materialTissue
        this.cylinderLeftInsertBack.load(this.baseUrl + 'assets/No2-CylinderLeftInsertBack.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderLeftInsertBack = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderLeftInsertBack is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderLeftMarkers).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderLeftMarkers = new LoadedObject()
        this.cylinderLeftMarkers.origin = new Vector3(0, 0, 0)
        this.cylinderLeftMarkers.normal = new Vector3(0, -1, 0)
        this.cylinderLeftMarkers.position = originOffset
        this.cylinderLeftMarkers.material = this.materialMarker
        this.cylinderLeftMarkers.load(this.baseUrl + 'assets/No2-CylinderLeftMarkers.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderLeftMarkers = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderLeftMarkers is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderRight).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderRight = new LoadedObject()
        this.cylinderRight.origin = new Vector3(-60, 0, 0)
        this.cylinderRight.normal = new Vector3(0, -1, 0)
        this.cylinderRight.position = originOffset
        this.cylinderRight.material = this.materialTissue
        this.cylinderRight.load(this.baseUrl + 'assets/No2-CylinderRight.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderRight = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderRight is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderRightCylinderCenter).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderRightCylinderCenter = new LoadedObject()
        this.cylinderRightCylinderCenter.origin = new Vector3(-60, 0, 0)
        this.cylinderRightCylinderCenter.normal = new Vector3(0, -1, 0)
        this.cylinderRightCylinderCenter.position = originOffset
        this.cylinderRightCylinderCenter.material = this.materialSecondTarget
        this.cylinderRightCylinderCenter.load(this.baseUrl + 'assets/No2-CylinderRightCylinderCenter.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderRightCylinderCenter = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderRightCylinderCenter is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderRightCylinderBack).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderRightCylinderBack = new LoadedObject()
        this.cylinderRightCylinderBack.origin = new Vector3(-60, 0, 0)
        this.cylinderRightCylinderBack.normal = new Vector3(0, -1, 0)
        this.cylinderRightCylinderBack.position = originOffset
        this.cylinderRightCylinderBack.material = this.materialTissue
        this.cylinderRightCylinderBack.load(this.baseUrl + 'assets/No2-CylinderRightCylinderBack.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderRightCylinderBack = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderRightCylinderBack is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderRightInsertCenter).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderRightInsertCenter = new LoadedObject()
        this.cylinderRightInsertCenter.origin = new Vector3(-60, 0, 0)
        this.cylinderRightInsertCenter.normal = new Vector3(0, -1, 0)
        this.cylinderRightInsertCenter.position = originOffset
        this.cylinderRightInsertCenter.material = this.materialLiver
        this.cylinderRightInsertCenter.load(this.baseUrl + 'assets/No2-CylinderRightInsertCenter.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderRightInsertCenter = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderRightInsertCenter is not shown")
          })
      })

    LoadedObject.tryAdd(this.cylinderRightInsertBack).subscribe(existing => this.scene.add(existing),
      () => {
        this.cylinderRightInsertBack = new LoadedObject()
        this.cylinderRightInsertBack.origin = new Vector3(-60, 0, 0)
        this.cylinderRightInsertBack.normal = new Vector3(0, -1, 0)
        this.cylinderRightInsertBack.position = originOffset
        this.cylinderRightInsertBack.material = this.materialTissue
        this.cylinderRightInsertBack.load(this.baseUrl + 'assets/No2-CylinderRightInsertBack.obj').subscribe(
          object3d => {
            this.scene.add(object3d);
          },
          () => {
            this.cylinderRightInsertBack = new NotLoadedObject()
            console.warn(LiverEngine3dService.name, "createScene", "cylinderRightInsertBack is not shown")
          })
      })
  }

  animate() {
    console.debug(LiverEngine3dService.name, "animate")

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

  setXray(xray: boolean) {
    console.info(LiverEngine3dService.name, "setXray", xray)
    if (xray) {
      this.scene.background = this.backGroundXray

      this.body.setMaterial(this.materialTissueXray)
      this.bodyInsertBack.setMaterial(this.materialTissueXray)
      this.cylinderLeft.setMaterial(this.materialTissueXray)
      this.cylinderLeftInsertBack.setMaterial(this.materialTissueXray)
      this.cylinderRight.setMaterial(this.materialTissueXray)
      this.cylinderRightCylinderBack.setMaterial(this.materialTissueXray)
      this.cylinderRightInsertBack.setMaterial(this.materialTissueXray)

      this.bodyInsertCenter.setMaterial(this.materialLiverXray)
      this.cylinderLeftCylinder.setMaterial(this.materialLiverXray2)
      this.cylinderLeftInsertCenter.setMaterial(this.materialLiverXray)
      this.cylinderRightInsertCenter.setMaterial(this.materialLiverXray)

      this.cylinderRightCylinderCenter.setMaterial(this.materialSecondTargetXray)

      this.cylinderLeftMarkers.setMaterial(this.materialMarkerXray)
    }
    else {
      this.scene.background = this.backGround

      this.body.setMaterial(this.materialTissue)
      this.bodyInsertBack.setMaterial(this.materialTissue)
      this.cylinderLeft.setMaterial(this.materialTissue)
      this.cylinderLeftInsertBack.setMaterial(this.materialTissue)
      this.cylinderRight.setMaterial(this.materialTissue)
      this.cylinderRightCylinderBack.setMaterial(this.materialTissue)
      this.cylinderRightInsertBack.setMaterial(this.materialTissue)

      this.bodyInsertCenter.setMaterial(this.materialLiver)
      this.cylinderLeftCylinder.setMaterial(this.materialLiver2)
      this.cylinderLeftInsertCenter.setMaterial(this.materialLiver)
      this.cylinderRightInsertCenter.setMaterial(this.materialLiver)

      this.cylinderRightCylinderCenter.setMaterial(this.materialSecondTarget)

      this.cylinderLeftMarkers.setMaterial(this.materialMarker)
    }
  }

}
