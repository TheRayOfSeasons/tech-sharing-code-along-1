import * as THREE from 'three';
import { CanvasTexture } from 'three';
import { MonoBehaviour, SceneObject } from '../core/components';

class TextureRenderer extends MonoBehaviour {
  awake() {
    this.canvas = document.getElementById('text-canvas');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext('2d');

    this.context.fillStyle = 'white';
    this.context.font = '600 64pt Arial';
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
  }

  start() {
    this.context.beginPath();
    this.context.fillText('THIS IS A TEXT', -350, 0, 700);
  }
}

class MeshRenderer extends MonoBehaviour {
  createMaterial() {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.texture },
        uResolution: {
          value: new THREE.Vector2(
            this.canvas.parentElement.clientWidth,
            this.canvas.parentElement.clientHeight,
          ),
        },
      },
      vertexShader: `
        varying vec2 vUv;

        void main()
        {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;

        varying vec2 vUv;

        void main()
        {
          vec2 uv = gl_FragCoord.xy / uResolution;
          vec4 color = texture2D(uTexture, uv);
          if (length(color.rgb) <= 0.0)
          {
            discard;
          }
          else {
            gl_FragColor = color;
          }
        }
      `,
      blending: THREE.AdditiveBlending,
    });
    return material;
  }

  start() {
    this.canvas = this.getComponent('TextureRenderer').canvas;
    this.texture = new CanvasTexture(this.canvas);
    this.material = this.createMaterial();
    const geometry = new THREE.PlaneGeometry(100, 100);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.z = -50;
  }

  update() {
    this.texture.needsUpdate = true;
  }

  exportAsSceneObject() {
    return this.mesh;
  }
}

export class TextProjector extends SceneObject {
  monobehaviours = {
    TextureRenderer,
    MeshRenderer,
  };
}
