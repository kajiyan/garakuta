import textFragmentShader from './shader/text-fragment-shader.frag';
import textVertexShader from './shader/text-vertex-shader.vert';

const createTextGeometry = require('three-bmfont-text');
const loadFont = require('load-bmfont');

/**
 * @typedef BMFont
 * @property {object} font - ビットマップフォントの座標情報などのオブジェクト
 * @property {THREE.Texture} texture - ビットマップフォント画像を元にしたテクスチャ
 */

export default class Lyric {
  constructor(
    font,
    texture,
    options = {}
  ) {
    this.font = font;
    this.texture = texture;
    this.options = Object.assign(
      {
        align: 'center',
        color:  new THREE.Color('#fff'),
        onComplete: function(e) {},
        text: undefined,
        width: 500,
      },
      options
    );

    this.prev = 0;
    this.progress = 0;
    this.duration = 4;

    this.geometry = createTextGeometry({
      align: this.options.align,
      flipY: this.texture.flipY,
      font: this.font,
      text: this.options.text,
      width: this.options.width,
    });

    this.material = new THREE.RawShaderMaterial({
      vertexShader: textVertexShader,
      fragmentShader: textFragmentShader,
      uniforms: {
        animate: {
          type: 'f',
          value: 1,
        },
        color: {
          type: 'c',
          value: this.options.color,
        },
        map: {
          type: 't',
          value: this.texture,
        },
        iGlobalTime: {
          type: 'f',
          value: 0,
        },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = -this.geometry.layout.width / 2;
    this.mesh.position.y = this.geometry.layout.height / 2;

    this.text = new THREE.Object3D();
    this.text.scale.multiplyScalar(-0.05);
    this.text.rotation.set(0, 0, Math.PI);
    this.text.add(this.mesh);
  }

  /**
   * change
   * テキストを更新するメソッド
   * @param {string} text - 更新後の文字列
   */
  change(text) {
    this.geometry.update(text);

    const lines = this.geometry.visibleGlyphs.map((glyph) => {
      return glyph.line;
    });

    const lineCount = lines.reduce((a, b) => {
      return Math.max(a, b);
    }, 0);

    const lineData = lines
      .map((line) => {
        const t = lineCount <= 1 ? 1 : line / (lineCount - 1);
        return [t, t, t, t];
      })
      .reduce((a, b) => {
        return a.concat(b);
      }, []);
    
    this.geometry.setAttribute(
      'line',
      new THREE.BufferAttribute(new Float32Array(lineData), 1)
    );
    
    this.mesh.position.x = -this.geometry.layout.width / 2;
    this.mesh.position.y = this.geometry.layout.height / 2;
  }

  /**
   * update
   */
  update() {
    const now = performance.now();
    const sec = (now - this.prev) / 1000;

    this.progress += sec;
    this.material.uniforms.iGlobalTime.value = this.progress;
    this.material.uniforms.animate.value = this.progress / this.duration;
    
    if (this.progress > this.duration) {
      this.progress = 0;
      this.options.onComplete(this);
    }

    this.prev = now;
  }

  /**
   * loadTexture
   * テクスチャを読み込む関数
   * @param {string} url - ファイルのパスまたは URL。
   * @return {Promise<THREE.Texture|ErrorEvent>}
   */
  static loadTexture(url) {
    return new Promise((resolve, reject) => {
      const texLoader = new THREE.TextureLoader();
      // テクスチャの読み込みが正常に完了した時に呼び出される関数
      const onLoad = (texture) => {
        resolve(texture);
      };
      // テクスチャの読み込みが失敗した時に呼び出される関数
      const onError = (err) => {
        reject(err);
      };

      // テクスチャの読み込む
      texLoader.load(url, onLoad, undefined, onError);
    });
  }

  /**
   * loadBMFont
   * ビットマップフォントを読み込む関数
   * @param {string} url - 読み込むビットマップフォントデータの JSON ファイルまでのパス
   * @param {string} image - 読み込むビットマップフォントデータの画像ファイルまでのパス
   * @return {Promise<BMFont|Error>}
   */
  static loadBMFont(url, image) {
    return new Promise((resolve, reject) => {
      (async () => {
        const texture = await Lyric.loadTexture(image);
        const onComplete = (error, font) => {
          if (error) {
            reject(error);
          }

          resolve({ font, texture });
        };

        loadFont(url, onComplete);
      })();
    });
  }
}