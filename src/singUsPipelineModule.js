export default function() {
  /**
   * onStart 
   */
  const onStart = ({ canvas }) => {
    // Get the 3js sceen from xr3js.
    const { scene, camera, renderer } = XR8.Threejs.xrScene();

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshBasicMaterial({color: 0x6699FF})
    );

    surface.rotateX(-Math.PI / 2);
    surface.position.set(0, 0, 0);
    surface.receiveShadow = true;
    scene.add(surface);

    // Set the initial camera position relative to the scene we just laid out. This must be at a height greater than y=0.
    camera.position.set(0, 3, 0);

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    });
  };

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'SING_US',
    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
  };
}