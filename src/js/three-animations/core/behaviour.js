/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import { Group } from 'three';

/**
 * NOTE: This is a custom framework loosely based on Unity Engine.
 */

/** Base class for all behaviours present in a scene. */
export class Behaviour {
  /** Called whenever the behaviour becomes active */
  awake() {}

  /** Called at the beginning of a scene to setup the behaviour. */
  start() {}

  /**
   * Called before each frame renders.
   * @param {Number} time - A reference to the time since the scene was first rendered.
   */
  update(time) {}

  /**
   * Called after each frame renders.
   * @param {Number} time - A reference to the time since the scene was first rendered.
   */
  lateUpdate(time) {}

  /**
   * Called whenever the viewport is resized
   * @param {UIEvent} event
   */
  resize(event) {}

  /**
   * Called whenever the canvas enters the viewport
   */
  onViewEnter() {}

  /**
   * Called whenver the canvas leaves the viewport
   */
  onViewLeave() {}

  /** Whatever this returns will be added to the scene. */
  exportAsSceneObject() {}

  /**
   * Whatever this returns will be added to the scene as a group.
   * NOTE: Currently, this is only used for the SceneObject as a
   * collector of all Monobehaviours under it. Don't use this in
   * any other way unless the abstraction is revised.
   */
  exportObjectGroup() {}
}

export class BaseMonoBehaviour extends Behaviour {
  /**
   * Returns a reference to the instance of a sibling component or monobehaviour.
   * @param {string} type - The key to the component.
   */
  getComponent(type) {}
}

export class BaseSceneObject extends Behaviour {
  /**
   * @type {{[key: string]: { new(): BaseMonoBehaviour }}}
   */
  monobehaviours = {};

  /**
    * Used for referencing Monobehaviour instances from other Monobehaviours.
    * @type {{[key: string]: BaseMonoBehaviour}}
    */
  components = {};

  /**
   * Used for iterating lifecycle based events for performance.
   * @type {BaseMonoBehaviour[]}
   */
  arrayedComponents = [];

  /**
   * @type {Group | null}
   */
  group = null;
}
