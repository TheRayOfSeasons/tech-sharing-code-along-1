import { Scene } from '../core';
import { Cube } from '../entities/cube';

export class MainScene extends Scene {
  entities = {
    Cube,
  };

  initialize() {
    this.camera.position.z = 10;
  }
}
