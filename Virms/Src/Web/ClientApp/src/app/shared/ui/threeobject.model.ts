// Copyright (c) 2021-2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { Material, Object3D, Vector3 } from 'three';

export class ThreeObject {

  fromWorldToLocalOrigin: Vector3 // From world space origin to the local orign
  position: Vector3 // From the local origin to the center of the object
  material: Material
  geometry: THREE.CylinderGeometry

  private pos: number = 0
  private rtn: number = 0
  private object: Object3D

  build(): Observable<Object3D> {
    return new Observable<Object3D>(subscriber => {

      this.object = new THREE.Mesh(this.geometry, this.material)

      this.object.translateX(this.fromWorldToLocalOrigin.x + this.position.x)
      this.object.translateY(this.fromWorldToLocalOrigin.y + this.position.y)
      this.object.translateZ(this.fromWorldToLocalOrigin.z + this.position.z)

      subscriber.next(this.object)
    })
  }

  setPosZ(pos: number) {
    const distance = (pos - this.pos)
    this.object.translateZ(distance)
    this.pos = pos
  }

  setPos(axis: Vector3, pos: number) {
    const distance = (pos - this.pos)
    this.object.translateOnAxis(axis, distance)
    this.pos = pos
  }

  setRtnZ(rtn: number) {
    this.object.translateX(-this.position.x)
    this.object.translateY(-this.position.y)
    this.object.translateZ(-this.position.z)

    const angle = (rtn - this.rtn)
    this.object.rotateZ(angle)
    this.rtn = rtn

    this.object.translateX(this.position.x)
    this.object.translateY(this.position.y)
    this.object.translateZ(this.position.z)
  }

  setRtn(axis: Vector3, rtn: number) {
    this.object.translateX(-this.position.x)
    this.object.translateY(-this.position.y)
    this.object.translateZ(-this.position.z)

    const angle = (rtn - this.rtn)
    this.object.rotateOnAxis(axis, angle)
    this.rtn = rtn

    this.object.translateX(this.position.x)
    this.object.translateY(this.position.y)
    this.object.translateZ(this.position.z)
  }

  setVisible(show: boolean) {
    this.object.visible = show
  }

  setMaterial(mat: Material) {
    this.material = mat
    this.object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = mat
      }
    })
  }
}
