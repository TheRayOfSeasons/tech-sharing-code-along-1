/* eslint-disable no-unused-vars */
import { PerspectiveCamera } from 'three';
import { InteractiveScene } from '../core/scene-management';
import { Bubble } from '../scene-objects/bubble';
import { Controls } from '../scene-objects/controls';
import { DynamicTextProjector } from '../scene-objects/dynamic-text-projector';
import { RotatingCube } from '../scene-objects/rotating-cube';
import { TextProjector } from '../scene-objects/text-projector';

export class MainScene extends InteractiveScene {
  sceneObjects = {
    Bubble,
    // RotatingCube,
    Controls,
    // TextProjector,
    DynamicTextProjector,
  };

  cameras = {
    Main: new PerspectiveCamera(75),
  };

  onSceneAwake() {
    this.cameras.Main.position.z = 18;
  }
}
