/**
 * @constructor
 */
function CloudLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.scene.add(this.camera);

  var texture = Loader.loadTexture('res/cloud.png');
  texture.magFilter = THREE.LinearMipMapLinearFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

  this.material = new THREE.ShaderMaterial({
    uniforms: {
      "alpha": { type: "f", value: 1.0 },
      "map": { type: "t", value: texture },
      "fogColor" : { type: "c", value: fog.color },
      "fogNear" : { type: "f", value: fog.near },
      "fogFar" : { type: "f", value: fog.far },
    },
    vertexShader: SHADERS.clouds.vertexShader,
    fragmentShader: SHADERS.clouds.fragmentShader,
    depthWrite: false,
    depthTest: false,
    transparent: true
  });

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));
  var geometry = new THREE.Geometry();

  for ( var i = 0; i < 6000; i++ ) {
    plane.position.x = Math.random() * 1000 - 500;
    plane.position.y = - Math.random() * Math.random() * 200 - 15;
    plane.position.z = i;
    plane.rotation.z = Math.random() * Math.PI;
    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
    plane.updateMatrix();

    geometry.merge(plane.geometry, plane.matrix);
  }
  var mesh = new THREE.Mesh(geometry, this.material);
  this.scene.add(mesh);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

CloudLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

CloudLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);

  var t = (relativeFrame - 300) / 80;
  this.material.uniforms.alpha.value = smoothstep(1, 0, t);
};
