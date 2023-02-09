import * as THREE from 'three';
import { MonoBehaviour, SceneObject } from '../core/components';

class MeshRenderer extends MonoBehaviour {
  start() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
  }

  exportAsSceneObject() {
    return this.mesh;
  }
}

class Rotator extends MonoBehaviour {
  start() {
    this.mesh = this.getComponent('MeshRenderer').mesh;
  }

  update(time) {
    this.mesh.rotation.y = time * 0.001;
  }
}

export class RotatingCube extends SceneObject {
  monobehaviours = {
    MeshRenderer,
    Rotator,
  };
}
