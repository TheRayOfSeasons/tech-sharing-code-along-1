import { PerspectiveCamera } from 'three';
import { InteractiveScene } from '../core/scene-management';
import { Bubble } from '../scene-objects/bubble';
import { Controls } from '../scene-objects/controls';
import { RotatingCube } from '../scene-objects/rotating-cube';

export class MainScene extends InteractiveScene {
  sceneObjects = {
    Bubble,
    RotatingCube,
    Controls,
  };

  cameras = {
    Main: new PerspectiveCamera(75),
  };

  onSceneAwake() {
    this.cameras.Main.position.z = 18;
  }
}
