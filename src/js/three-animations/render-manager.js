import Stats from 'stats-js';
import { Clock, WebGLRenderer } from 'three';
import { observer } from '../commons/observer';
// eslint-disable-next-line no-unused-vars
import { InteractiveScene } from './core/scene-management';

// Set to true to see FPS tracker
const DEBUG = false;

/**
 * Sets up an instance of Stats.
 * @returns {Stats}
 */
const setupStats = () => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  return stats;
};

/**
 * @typedef {Object} ActiveRenderObject
 * @property {string} name
 * @property {ActiveRender} activeRender
 */

/**
 * Meant for iterators
 * @type {ActiveRenderObject[]}
 */
const activeRenders = [];

/**
 * Meant for getting specific renders
 * @type {{[key: string]: ActiveRender}}
 */
const keyedActiveRenders = {};

// Handle responsiveness for renders
window.addEventListener('resize', (event) => {
  for (const { activeRender } of activeRenders) {
    activeRender.resize(event);
  }
});

observer.subscribe((entry) => {
  const name = entry.target.getAttribute('data-name');
  if (!name) {
    return;
  }
  /**
   * @type {ActiveRender}
   */
  const activeRender = keyedActiveRenders[name];
  const ratio = entry.intersectionRatio;
  if (ratio > 0) {
    activeRender.onViewEnter();
  } else {
    activeRender.onViewLeave();
  }
});

const clock = new Clock();

/**
 * Initializes and handles the frame by frame animation of
 * all Three scenes managed by this custom framework.
 */
const handleAnimation = () => {
  let stats;
  if (DEBUG) {
    stats = setupStats();
  }
  const animate = (time) => {
    if (DEBUG) {
      stats.begin();
    }
    for (const { activeRender } of activeRenders) {
      if (activeRender.useClock) {
        activeRender.render(clock.getElapsedTime());
      } else {
        activeRender.render(time);
      }
    }
    // We prefer this over renderer.setAnimationLoop
    // since we're using multiple scenes. This way,
    // we can reuse the same render loop for all.
    window.requestAnimationFrame(animate);
    if (DEBUG) {
      stats.end();
    }
  };
  window.requestAnimationFrame(animate);
};
handleAnimation();

/**
 * @typedef {Object} ActiveRenderArgs
 * @property {string} name
 * @property {HTMLCanvasElement} canvas
 * @property {{ new(): InteractiveScene }} sceneClass
 * @property {import('three').WebGLRendererParameters | null} options
 * @property {boolean} disableWhenNotVisible
 *  - Stops frame by frame update calls if the canvas is not visible.
 * @property {boolean} useDefaultRendering
 *  - Set to false if you intend to render via an EffectComposer
 * @property {boolean} responsive - Set to false to disable responsiveness
 * @property {boolean} useClock - Set to true to use Clock instead of the built in time.
 * @property {HTMLElement} observerElement
 *  - The element observed by the IntersectionObserver to optimize render cycles.
 *  - Defaults as the same canvas received.
 */

/** Class containing the configurations of one render. */
class ActiveRender {
  /**
   * @param {ActiveRenderArgs} args
   */
  constructor({
    name,
    canvas,
    sceneClass,
    options,
    disableWhenNotVisible = true,
    useDefaultRendering = true,
    responsive = true,
    useClock = false,
    observerElement = null,
  }) {
    if (typeof (options) === 'object') {
      if (options.canvas) {
        // eslint-disable-next-line no-param-reassign
        canvas = options.canvas;
      }
    }
    this.canvas = canvas;
    this.useClock = useClock;
    this.disableWhenNotVisible = disableWhenNotVisible;
    this.useDefaultRendering = useDefaultRendering;
    this.sceneClass = sceneClass;
    this.responsive = responsive;
    this.renderer = new WebGLRenderer(options || {
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      canvas,
    });
    this.renderer.setSize(
      canvas.parentElement.clientWidth,
      canvas.parentElement.clientHeight,
    );
    const SceneClass = sceneClass;

    this.scene = new SceneClass(canvas, this.renderer);
    this.scene.awake();
    this.scene.start();

    this.isRunning = false;

    if (disableWhenNotVisible) {
      const element = observerElement || canvas;
      element.setAttribute('data-name', name);
      observer.observe(element);
    }
  }

  onViewEnter() {
    this.isRunning = true;
    this.scene.onViewEnter();
  }

  onViewLeave() {
    this.isRunning = false;
    this.scene.onViewLeave();
  }

  render(time) {
    if (!this.isRunning && this.disableWhenNotVisible) {
      return;
    }
    this.scene.update(time);
    if (this.useDefaultRendering) {
      this.renderer.render(this.scene.scene, this.scene.currentCamera);
    }
    this.scene.lateUpdate(time);
    this.scene.onAfterRender();
  }

  /**
   * @param {UIEvent} event
   */
  resize(event) {
    if (this.responsive) {
      const camera = this.scene.currentCamera;
      const canvas = this.renderer.domElement;
      this.scene.resize(event);
      camera.aspect = canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(
        canvas.parentElement.clientWidth,
        canvas.parentElement.clientHeight,
      );
    }
  }
}

export const ThreeAnimations = {
  /**
   * Initializes an InteractiveScene.
   * NOTE: Canvas size is dependent on the parent's size.
   * @param {string} name - The internal id of the renderer
   * @param {ActiveRenderArgs} args
   */
  init: (args) => {
    if (!args.canvas) {
      if (!args.options) {
        return;
      }
      if (!args?.options?.canvas) {
        return;
      }
    }
    const { name } = args;
    const activeRender = new ActiveRender(args);
    activeRenders.push({
      name,
      activeRender,
    });
    keyedActiveRenders[name] = activeRender;
  },
};
