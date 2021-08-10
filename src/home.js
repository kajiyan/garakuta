import singUsPipelineModule from './singUsPipelineModule';
import textFragmentShader from './shader/text-fragment-shader.frag';
import textVertexShader from './shader/text-vertex-shader.vert';

const createTextGeometry = require('three-bmfont-text');
const loadFont = require('load-bmfont');

/**
 * @typedef BMFont
 * @property {object} font - ビットマップフォントの座標情報などのオブジェクト
 * @property {THREE.Texture} texture　- ビットマップフォント画像を元にしたテクスチャ
 */

/**
 * loadTexture
 * テクスチャを読み込む関数
 * @param {string} url - ファイルのパスまたは URL。
 * @return {Promise<THREE.Texture|ErrorEvent>}
 */
const loadTexture = (url) => new Promise((resolve, reject) => {
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

/**
 * loadBMFont
 * ビットマップフォントを読み込む関数
 * @param {string} url - 読み込むビットマップフォントデータの JSON ファイルまでのパス
 * @param {string} image - 読み込むビットマップフォントデータの画像ファイルまでのパス
 * @return {Promise<BMFont|string>} 
 */
const loadBMFont = (url, image) => new Promise((resolve, reject) => {
  (async () => {
    const texture = await loadTexture(image);
    const onComplete = (error, font) => {
      if (error) {
        reject(error);
      }

      resolve({ font, texture });
    };

    loadFont(url, onComplete);
  })();
});

/**
 * onxrloaded 
 */
const onxrloaded = () => {
  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    // Other custom pipeline modules.
    singUsPipelineModule(),
  ]);

  // Open the camera and start running the camera run loop.
  XR8.run({
    canvas: document.getElementById('camerafeed'),
  });
};

// Show loading screen before the full XR library has been loaded.
const load = () => {
  // 以下は XRExtras.Loading.showLoading({ onxrloaded: onxrloaded }); を省略した記述
  // オブジェクトのキー名とバリューの変数名が同じであればこのように記述できる
  XRExtras.Loading.showLoading({ onxrloaded });
};

/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.z = 200;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
*/

(async () => {
  const bmFont = await loadBMFont(
    '/shared/fonts/noto-sans-cjk-jp-sdf-4112.json',
    '/shared/fonts/noto-sans-cjk-jp-sdf-4112.png'
  );

  const textGeometry = createTextGeometry({
    font: bmFont.font,
    align: 'center',
    width: 500,
    flipY: bmFont.texture.flipY,
  });
  
  window.onload = () => {
    if (window.XRExtras) {
      load();
    } else {
      window.addEventListener('xrextrasloaded', load);
    }
  };

  /*
  const material = new THREE.RawShaderMaterial({
    vertexShader: textVertexShader,
    fragmentShader: textFragmentShader,
    uniforms: {
      animate: {
        type: 'f',
        value: 1,
      },
      iGlobalTime: {
        type: 'f',
        value: 0,
      },
      map: {
        type: 't',
        value: bmFont.texture,
      },
      color: {
        type: 'c',
        value: new THREE.Color('#fff'),
      },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  const textMesh = new THREE.Mesh(textGeometry, material);

  const textAnchor = new THREE.Object3D();
  textAnchor.rotation.set(Math.PI, 0, 0);
  textGeometry.update('こんにちわ世界');
  textAnchor.add(textMesh);
  scene.add(textAnchor);

  const lines = textGeometry.visibleGlyphs.map((glyph) => {
    return glyph.line;
  });

  const lineCount = lines.reduce((a, b) => {
    return Math.max(a, b);
  }, 0);

  const lineData = lines.map((line) => {
    const t = lineCount <= 1 ? 1 : (line / (lineCount - 1));
    return [t, t, t, t];
  }).reduce((a, b) => {
    return a.concat(b)
  }, []);

  textGeometry.setAttribute('line', new THREE.BufferAttribute(new Float32Array(lineData), 1));
  
  textMesh.position.x = -textGeometry.layout.width / 2;
  textMesh.position.y = textGeometry.layout.height / 2;

  let progress = 0;
  const duration = 60;

  const animate = function (timestamp) {
    requestAnimationFrame(animate);

    const sec = performance.now() / 1000;
    
    progress = sec;
    material.uniforms.iGlobalTime.value = sec;
    material.uniforms.animate.value = progress / duration;
    if (progress > duration) {
      progress = 0;
    }

    renderer.render(scene, camera);
  };

  animate();
  */
})();

if (module.hot) {
  module.hot.accept((error) => {
    if (error) {
      console.error(error);
    }
  });

  module.hot.dispose(() => {
    renderer.domElement.remove();
  });
};