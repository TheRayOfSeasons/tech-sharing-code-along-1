/* eslint-disable no-unused-vars */
import { Group } from 'three';
import { BaseMonoBehaviour, BaseSceneObject } from './behaviour';
import { InteractiveScene } from './scene-management';

/**
 * A collection of MonoBehaviours interacting with each other
 * to build up one full behaviour. A loose counterpart of
 * GameObject from Unity Engine.
 */
export class SceneObject extends BaseSceneObject {
  /**
   * @param {Object} args
   * @param {InteractiveScene} args.scene
   */
  constructor({ scene }) {
    super();
    this.scene = scene;
    this.group = new Group();
  }

  /**
   * Add a MonoBehaviour into the object, which in turn is reflected into the scene.
   * @param {Object} args
   * @param {string} args.key - The key to be used when the instance is passed as a component.
   * @param {{ new(): MonoBehaviour }} args.Monobehaviour
   *  - A class that extends MonoBehaviour containing the logic.
   */
  addComponent({ key, Monobehaviour }) {
    const component = new Monobehaviour({ parentBehaviour: this, scene: this.scene });
    this.components[key] = component;
    this.arrayedComponents.push(component);
  }

  awake() {
    for (const [key, Monobehaviour] of Object.entries(this.monobehaviours)) {
      this.addComponent({ key, Monobehaviour });
    }
    for (const component of this.arrayedComponents) {
      component.awake();
    }
  }

  start() {
    for (const component of this.arrayedComponents) {
      component.start();
      const exportedSceneObject = component.exportAsSceneObject();
      if (exportedSceneObject) {
        this.group.add(exportedSceneObject);
      }
    }
  }

  update(time) {
    for (const component of this.arrayedComponents) {
      component.update(time);
    }
  }

  lateUpdate(time) {
    for (const component of this.arrayedComponents) {
      component.lateUpdate(time);
    }
  }

  onViewEnter() {
    for (const component of this.arrayedComponents) {
      component.onViewEnter();
    }
  }

  onViewLeave() {
    for (const component of this.arrayedComponents) {
      component.onViewLeave();
    }
  }

  resize(event) {
    for (const component of this.arrayedComponents) {
      component.resize(event);
    }
  }

  exportObjectGroup() {
    return this.group;
  }
}

/** A singular piece of a behaviour. */
export class MonoBehaviour extends BaseMonoBehaviour {
  /**
   * @param {Object} args
   * @param {SceneObject} args.parentBehaviour
   * @param {InteractiveScene} args.scene
   */
  constructor({ parentBehaviour, scene }) {
    super();
    this.scene = scene;
    this.parentBehaviour = parentBehaviour;
  }

  getComponent(type) {
    return this.parentBehaviour.components[type];
  }
}
