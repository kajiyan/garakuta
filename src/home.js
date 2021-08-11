import singUsPipelineModule from './singUsPipelineModule';
import Lyric from './Lyric/Lyric';

// Show loading screen before the full XR library has been loaded.
const load = () => {
  (async () => {
    try {
      const { font, texture } = await Lyric.loadBMFont(
        '/shared/fonts/noto-sans-cjk-jp-sdf-4112.json',
        '/shared/fonts/noto-sans-cjk-jp-sdf-4112.png'
      );

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
          singUsPipelineModule(font, texture),
        ]);

        // Open the camera and start running the camera run loop.
        XR8.run({
          canvas: document.getElementById('camerafeed'),
        });
      };

      // 以下は XRExtras.Loading.showLoading({ onxrloaded: onxrloaded }); を省略した記述
      // オブジェクトのキー名とバリューの変数名が同じであればこのように記述できる
      XRExtras.Loading.showLoading({ onxrloaded });
    } catch (error) {
      console.error(error);
    }
  })();
};

window.onload = () => {
  if (window.XRExtras) {
    load();
  } else {
    window.addEventListener('xrextrasloaded', load);
  }
};

if (module.hot) {
  module.hot.accept((error) => {
    if (error) {
      console.error(error);
    }
  });

  // module.hot.dispose(() => {});
};