import { PerspectiveCamera } from 'three';
import { InteractiveScene } from '../core/scene-management';
import { RotatingCube } from '../scene-objects/rotating-cube';

export class MainScene extends InteractiveScene {
  sceneObjects = {
    RotatingCube,
  };

  cameras = {
    Main: new PerspectiveCamera(75),
  };

  onSceneAwake() {
    this.cameras.Main.position.z = 3;
  }
}
