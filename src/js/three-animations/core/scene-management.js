/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import {
  Camera, PerspectiveCamera, Scene, WebGLRenderer,
} from 'three';
import { BaseSceneObject, Behaviour } from './behaviour';

/** A class that sets up a scene. */
export class InteractiveScene extends Behaviour {
  /**
   * @type {{[key: string]: { new(): BaseSceneObject }}}
   */
  sceneObjects = {};

  /**
   * Used for referencing SceneObject instances from outside.
   * @type {{[key: string]: BaseSceneObject}}
   */
  instances = {};

  /**
   * Used for iterating lifecycle based events for performance.
   * @type {BaseSceneObject[]}
   */
  arrayedInstances = [];

  /**
   * @type {{[key: string]: Camera}}
   */
  cameras = {};

  /**
   * The name of the first camera.
   */
  defaultCamera = 'Main';

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderer} renderer
   */
  constructor(canvas, renderer) {
    super();
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;
    /**
     * @type {WebGLRenderer}
     */
    this.renderer = renderer;
    /**
     * @type {Scene}
     */
    this.scene = new Scene();
    this.modifyScene(this.scene);
  }

  /**
   * A virtual method for further modifying the scene after the constructor runs.
   * @param {Scene} scene
   */
  modifyScene(scene) {}

  /**
   * Runs after all SceneObjects awake.
   * Can be utilized for setting up postprocessing.
   */
  onSceneAwake() {}

  /**
   * Runs after all SceneObjects start.
   */
  onSceneStart() {}

  /**
   * Runs before the frame renders all SceneObjects.
   */
  onBeforeFrameRender() {}

  /**
   * Runs after the frame renders all SceneObjects.
   */
  onAfterRender() {}

  /**
   * A virtual method for adding custom render cycles.
   * Can be utilized for rendering through EffectComposers.
   * NOTE: To use EffectComposers, useDefaultRendering must
   * be set to false when initialzing. See `init` in render-manager.
   */
  onRender() {}

  /**
   * A virtual method for adding resize events
   * on the scene level.
   * @param {UIEvent} event
   */
  onResize(event) {}

  /**
   * Adapts the aspect ratio of the current camera to fit the canvas.
   * This only works for cameras that is or extends PerspectiveCamera.
   */
  adaptPerspectiveCamera() {
    this.currentCamera.aspect = (
      this.canvas.parentElement.clientWidth
      / this.canvas.parentElement.clientHeight
    );
    this.currentCamera.updateProjectionMatrix();
  }

  /**
   * Changes the current camera.
   * @param {string} cameraKey - The key of the camera in the `cameras` field.
   */
  setCurrentCamera(cameraKey) {
    this.currentCamera = this.cameras[cameraKey];
    if (this.currentCamera instanceof PerspectiveCamera) {
      this.adaptPerspectiveCamera();
    }
  }

  awake() {
    this.setCurrentCamera(this.defaultCamera);
    for (const [key, SceneObject] of Object.entries(this.sceneObjects)) {
      const instance = new SceneObject({ scene: this });
      this.instances[key] = instance;
      this.arrayedInstances.push(instance);
      instance.awake();
    }
    this.onSceneAwake();
  }

  start() {
    for (const instance of this.arrayedInstances) {
      instance.start();
      const group = instance.exportObjectGroup();
      this.scene.add(group);
    }
    this.onSceneStart();
  }

  update(time) {
    this.onBeforeFrameRender();
    for (const instance of this.arrayedInstances) {
      // Force async on the SceneObject level to allow concurrency
      (async () => {
        instance.update(time);
      })();
    }
    this.onRender();
  }

  lateUpdate(time) {
    for (const instance of this.arrayedInstances) {
      // Force async on the SceneObject level to allow concurrency
      (async () => {
        instance.lateUpdate(time);
      })();
    }
  }

  onViewEnter() {
    for (const instance of this.arrayedInstances) {
      instance.onViewEnter();
    }
  }

  onViewLeave() {
    for (const instance of this.arrayedInstances) {
      instance.onViewLeave();
    }
  }

  resize(event) {
    this.onResize(event);
    for (const instance of this.arrayedInstances) {
      // Force async on the SceneObject level to allow concurrency
      (async () => {
        instance.resize(event);
      })();
    }
  }
}
