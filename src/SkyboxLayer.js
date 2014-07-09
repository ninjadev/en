/**
 * @constructor
 */
function SkyboxLayer(layer) {
  this.offset = layer.config.offset;
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  this.camera.position.z = 200;

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  var imagePrefix = "http://localhost:9999/res/skyboxes/dunes_";
  var directions  = ["right", "left", "top", "bottom", "front", "back"];
  var imageSuffix = ".jpg";
  var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
      side: THREE.BackSide
    }));
  var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
  this.scene.add(skyBox);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

SkyboxLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

SkyboxLayer.prototype.start = function() {
};

SkyboxLayer.prototype.end = function() {
};

SkyboxLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

SkyboxLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);

  this.cube.rotation.x = Math.sin(frame / 10 + this.offset);
  this.cube.rotation.y = Math.cos(frame / 10 + this.offset);
};
