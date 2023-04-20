import * as THREE from 'three';
import anime from 'animejs';
import { CanvasTexture } from 'three';
import { MonoBehaviour, SceneObject } from '../core/components';

const words = [
  {
    text: 'THIS IS A TEXT 1',
    y: 0,
  },
  {
    text: 'THIS IS A TEXT 2',
    y: 100,
  },
  {
    text: 'THIS IS A TEXT 3',
    y: 200,
  },
];

class TextureRenderer extends MonoBehaviour {
  awake() {
    this.canvas = document.getElementById('dynamic-text-canvas');
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

  clear() {
    this.context.clearRect(
      -this.canvas.width * 2,
      -this.canvas.height * 2,
      this.canvas.width * 4,
      this.canvas.height * 4,
    );
  }

  draw() {
    this.clear();
    this.context.beginPath();
    this.context.rect(-500, 10, this.canvas.width, 100);
    this.context.clip();
    for (const word of words) {
      this.context.fillText(word.text, -350, word.y, 700);
    }
  }

  start() {
    this.draw();
    setInterval(() => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < words.length; i++) {
        if (words[i].y === 200) {
          words[i].y = 0;
        } else {
          anime({
            targets: words[i],
            y: words[i].y + 100,
            easing: 'easeInOutQuart',
            duration: 800,
          });
        }
      }
    }, 1000);
  }

  update() {
    this.draw();
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

export class DynamicTextProjector extends SceneObject {
  monobehaviours = {
    TextureRenderer,
    MeshRenderer,
  };
}
