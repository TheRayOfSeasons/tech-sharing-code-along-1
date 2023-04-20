import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MonoBehaviour, SceneObject } from '../core/components';

class ControlManager extends MonoBehaviour {
  start() {
    this.controls = new OrbitControls(this.scene.currentCamera, this.scene.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
  }

  update() {
    this.controls.update();
  }
}

export class Controls extends SceneObject {
  monobehaviours = {
    ControlManager,
  };
}
