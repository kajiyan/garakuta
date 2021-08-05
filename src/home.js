// const createTextGeometry = require('three-bmfont-text');
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

(async () => {
  const bmFont = await loadBMFont(
    '/shared/fonts/noto-sans-cjk-jp-sdf-4112.json',
    '/shared/fonts/noto-sans-cjk-jp-sdf-4112.png'
  );

  console.log(bmFont);
})();

if (module.hot) {
  module.hot.accept((error) => {
    if (error) {
      console.error(error);
    }
  });

  // module.hot.dispose(() => {});
};