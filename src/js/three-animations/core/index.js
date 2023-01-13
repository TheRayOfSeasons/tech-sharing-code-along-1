import {
  Group, WebGLRenderer, Scene as ThreeScene, PerspectiveCamera,
} from 'three';

/* eslint-disable no-unused-vars */

export class Behaviour {
  constructor(entity) {
    this.entity = entity;
  }

  awake() {}

  start() {}

  update(time) {}

  export() {}
}

export class BehaviourRunner extends Behaviour {
  instances = {};

  arrayedInstances = [];

  awake() {
    for (const instance of this.arrayedInstances) {
      instance.awake();
    }
  }

  start() {
    for (const instance of this.arrayedInstances) {
      instance.start();
    }
  }

  update(time) {
    for (const instance of this.arrayedInstances) {
      instance.update(time);
    }
  }
}

export class Entity extends BehaviourRunner {
  /**
   * @typedef {[key: string]: { new(): Behaviour }}
   */
  behaviours = {};

  constructor(scene) {
    super();
    this.group = new Group();
    this.scene = scene;
  }

  setup() {
    for (const [key, Klass] of Object.entries(this.behaviours)) {
      const instance = new Klass(this);
      const object = instance.export();
      this.instances[key] = instance;
      this.arrayedInstances.push(instance);
      this.awake();
      this.start();
      if (object) {
        this.group.add(object);
      }
    }
  }

  export() {
    return this.group;
  }
}

export class Scene extends BehaviourRunner {
  entities = {};

  constructor(canvas) {
    super();
    this.canvas = canvas;
  }

  setup() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.setRendererSize();
    this.threeScene = new ThreeScene();
    this.camera = new PerspectiveCamera(75);
    for (const [key, Klass] of Object.entries(this.entities)) {
      const entity = new Klass(this);
      entity.setup();
      this.instances[key] = entity;
      this.arrayedInstances.push(entity);
      this.threeScene.add(entity.export());
    }
    this.renderer.setAnimationLoop((time) => {
      this.update(time);
      this.renderer.render(this.threeScene, this.camera);
    });
  }

  initialize() {}

  setRendererSize() {
    this.renderer.setSize(
      this.canvas.parentElement.clientWidth,
      this.canvas.parentElement.clientHeight,
    );
  }
}
