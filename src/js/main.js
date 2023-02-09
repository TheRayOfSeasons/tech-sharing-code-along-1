import '../styles/main.scss';
import { ThreeAnimations } from './three-animations/render-manager';
import { MainScene } from './three-animations/scenes/main-scene';

ThreeAnimations.init({
  name: 'main',
  canvas: document.getElementById('main'),
  sceneClass: MainScene,
});
