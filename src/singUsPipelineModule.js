import Lyric from './Lyric/Lyric';

export default function(font, texture) {
  const lyrics = [];

  /**
   * onStart 
   */
  const onStart = ({ canvas }) => {
    // Get the 3js sceen from xr3js.
    const { scene, camera, renderer } = XR8.Threejs.xrScene();

    const lyric = new Lyric(
      font,
      texture,
      {
        align: 'center',
        color:  new THREE.Color('#fff'),
        onComplete: (e) => {
          e.change(window.tweets[Math.floor(Math.random() * window.tweets.length)]);
        },
        text: window.tweets[Math.floor(Math.random() * window.tweets.length)],
        width: 500,
      }
    );

    lyrics.push(lyric);

    scene.add(lyric.text);
    lyric.text.position.set(0, 0, 10);
    lyric.text.scale.multiplyScalar(-0.2);

    // Set the initial camera position relative to the scene we just laid out. This must be at a height greater than y=0.
    camera.position.set(0, 3, 0);

    const axis = new THREE.AxisHelper(1000);
    axis.position.set(0, 0, 0);
    scene.add(axis);
    

    // XR コントローラの 6DoF 位置とカメラのパレメーターをシーンに同期
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
  };

  /**
   * onUpdate 
   */
  const onUpdate = () => {
    lyrics.forEach((lyric) => {
      lyric.update();
    });
  };

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'SING_US',
    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
    onUpdate,
  };
}