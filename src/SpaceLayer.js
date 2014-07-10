/*
 * @constructor
 */
function SpaceLayer(layer) {
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.camera.fov = 90;
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.light1 = new THREE.PointLight(0xffffff);
  this.light1.position.x = 200;
  this.light1.position.y = 200;
  this.light1.position.z = 200;
  this.scene.add(this.light1); 
  this.light2 = new THREE.DirectionalLight(0x888888);
  this.light2.position.x = -400;
  this.light2.position.y = 400;
  this.light2.position.z = 400;
  this.light2.lookAt(new THREE.Vector3(0, 0, 0));
  this.scene.add(this.light2); 
  this.scene.add(new THREE.AmbientLight(0x222222));

  this.initSkybox();

  this.planet1 = this.createPlanet(
    Loader.loadTexture('/res/textures/planet1.jpg'),
    Loader.loadTexture('/res/textures/planet1-normalmap.jpg'));
  this.planet2 = this.createPlanet(
    Loader.loadTexture('/res/textures/planet2.jpg'),
    Loader.loadTexture('/res/textures/planet2-normalmap.jpg'));
  this.planet3 = this.createPlanet(
    Loader.loadTexture('/res/textures/planet3.jpg'),
    Loader.loadTexture('/res/textures/planet3-normalmap.jpg'));
  this.planet4 = this.createPlanet(
    Loader.loadTexture('/res/textures/planet4.jpg'),
    Loader.loadTexture('/res/textures/planet4-normalmap.jpg'));

  this.scene.add(this.planet1.object3D);
  this.scene.add(this.planet2.object3D);
  this.scene.add(this.planet3.object3D);
  this.scene.add(this.planet4.object3D);
}

SpaceLayer.prototype.update = function(frame, relativeFrame) {
  this.planet1.planetMesh.rotation.x = relativeFrame / 167 / 2;
  this.planet1.object3D.position.set(250, 150, -200);

  this.planet2.planetMesh.rotation.x = relativeFrame / 142 / 2;
  this.planet2.object3D.position.set(-150, -150, 300);

  this.planet3.planetMesh.rotation.x = relativeFrame / 112 / 2;
  this.planet3.object3D.position.set(150, -150, -100);

  this.planet4.planetMesh.rotation.x = relativeFrame / 124 / 2;
  this.planet4.object3D.position.set(-250, 150, 100);

  this.planet1.update();
  this.planet2.update();
  this.planet4.update();
  this.planet3.update();

  this.camera.rotation.x = relativeFrame / 132 / 4;
  this.camera.rotation.y = relativeFrame / 151 / 4;
  this.camera.rotation.z = relativeFrame / 163 / 4;
};


SpaceLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

SpaceLayer.prototype.createPlanet = function(map, normalMap) {
  var planet = {};
  var mesh = new THREE.Mesh(
      new THREE.SphereGeometry(100, 32, 32),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: map,
        normalMap: normalMap,
        shininess: 10
      }));
  var glowMaterial = new THREE.ShaderMaterial(SHADERS.planetGlow).clone();
  glowMaterial.side = THREE.BackSide;
  glowMaterial.blending = THREE.AdditiveBlending;
  glowMaterial.transparent = true;
  glowMaterial.uniforms.glowColor.value = new THREE.Color(0xaaaaff);
  glowMaterial.uniforms.viewVector.value = null;
  glowMaterial.uniforms.c.value = 0.1;
  glowMaterial.uniforms.p.value = 3.4;
  var glow = new THREE.Mesh(
    new THREE.SphereGeometry(120, 32, 32),
    glowMaterial);

  var object3D = new THREE.Object3D();
  object3D.add(mesh);
  object3D.add(glow);

  planet.object3D = object3D;
  var that = this;
  planet.planetMesh = mesh;
  planet.update = function() {
    glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
      that.camera.position, object3D.position);
  };

  return planet;
}

SpaceLayer.prototype.initSkybox = function() {
  var imagePrefix = "/res/skyboxes/space-";
  var directions  = [
    "pos-x",
    "neg-x",
    "pos-y",
    "neg-y",
    "pos-z",
    "neg-z"
  ];
  var imageSuffix = ".png";
  var skyGeometry = new THREE.BoxGeometry(20000, 20000, 20000);

  var materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
      map: Loader.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide,
      color: 0x888888
    }));
  }
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  this.scene.add(skyBox);
};
