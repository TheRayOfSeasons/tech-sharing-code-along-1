import { BoxGeometry, MeshNormalMaterial, Mesh } from 'three';
import { Behaviour, Entity } from '../core';

class MeshRenderer extends Behaviour {
  awake() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
  }

  export() {
    return this.mesh;
  }
}

export class Cube extends Entity {
  behaviours = {
    MeshRenderer,
  };
}
