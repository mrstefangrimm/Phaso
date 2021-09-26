// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

import { Observable } from 'rxjs';
import * as THREE from 'three';
import { Material, Object3D, Quaternion, Vector3 } from 'three';

export class ThreeCylinder {

  private object: Object3D

  readonly worldsNormal: Vector3 = new THREE.Vector3(0, 0, 1);

  origin: Vector3 // From (rotation) origin to the object (should it be called center)
  normal: Vector3
  position: Vector3 // From the origin to the center of the object
  material: Material
  geometry: THREE.CylinderGeometry

  build(): Observable<Object3D> {
    return new Observable<Object3D>(subscriber => {

      this.object = new THREE.Mesh(this.geometry, this.material);

      //  ThreeJS <- Sketchup
      //   | y        | z
      //    - x        - x
      //  /          /
      // z          y

      const q = new Quaternion()
      q.setFromUnitVectors(this.normal, this.worldsNormal)
      this.object.setRotationFromQuaternion(q)

      const position3js = this.position.applyQuaternion(q)
      this.object.position.x = position3js.x
      this.object.position.y = position3js.y
      this.object.position.z = position3js.z

      this.object.translateX(this.origin.x)
      this.object.translateY(this.origin.y)
      this.object.translateZ(this.origin.z)

      subscriber.next(this.object)
    })
  }

  setLng(lng: number) {
    this.object.position.z = this.position.z + lng
  }

  setRtn(rtn: number) {
    this.object.translateX(-this.origin.x)
    this.object.translateY(-this.origin.y)
    this.object.translateZ(-this.origin.z)

    const q = new Quaternion()
    q.setFromUnitVectors(this.normal, this.worldsNormal)

    const qRtn = new Quaternion();
    qRtn.setFromAxisAngle(this.normal, rtn);
    q.multiply(qRtn)
    this.object.setRotationFromQuaternion(q)

    this.object.translateX(this.origin.x)
    this.object.translateY(this.origin.y)
    this.object.translateZ(this.origin.z)
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
