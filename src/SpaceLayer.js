/*
 * @constructor
 */
function SpaceLayer(layer) {
  this.config = layer.config;

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
  this.initMilkyWay();
  this.initTrain();

  this.planetX = this.createPlanet(
    Loader.loadTexture('res/textures/planetX-earth.jpg'),
    Loader.loadTexture('res/textures/planetX-earth-normalmap.jpg'));
  this.planet1 = this.createPlanet(
    Loader.loadTexture('res/textures/planet1-outracks.jpg'),
    Loader.loadTexture('res/textures/planet1-outracks-normalmap.jpg'));
  this.planet2 = this.createPlanet(
    Loader.loadTexture('res/textures/planet2-mrdoob.jpg'),
    Loader.loadTexture('res/textures/planet2-mrdoob-normalmap.jpg'));
  this.planet3 = this.createPlanet(
    Loader.loadTexture('res/textures/planet3-solskogen.jpg'),
    Loader.loadTexture('res/textures/planet3-solskogen-normalmap.jpg'));
  this.planet4 = this.createPlanet(
    Loader.loadTexture('res/textures/planet5-pandacube.jpg'),
    Loader.loadTexture('res/textures/planet5-pandacube-normalmap.jpg'));

  this.scene.add(this.planetX.object3D);
  this.scene.add(this.planet1.object3D);
  this.scene.add(this.planet2.object3D);
  this.scene.add(this.planet3.object3D);
  this.scene.add(this.planet4.object3D);
}

SpaceLayer.prototype.update = function(frame, relativeFrame) {
  this.planetX.planetMesh.rotation.y = relativeFrame / 118 / 2;
  this.planetX.object3D.position.set(0, 0, 0);

  this.planet1.planetMesh.rotation.y = relativeFrame / 167 / 2;
  this.planet1.object3D.position.set(4000, 150, -200);

  this.planet2.planetMesh.rotation.y = relativeFrame / 142 / 2;
  this.planet2.object3D.position.set(-3500, 1500, 300);

  this.planet3.planetMesh.rotation.y = relativeFrame / 112 / 2;
  this.planet3.object3D.position.set(150, -1500, -100);

  this.planet4.planetMesh.rotation.y = relativeFrame / 124 / 2;
  this.planet4.object3D.position.set(1000, 1500, 1000);

  this.planetX.update();
  this.planet1.update();
  this.planet2.update();
  this.planet3.update();
  this.planet4.update();

  this.milkyWay.rotation.z = - relativeFrame / 66 / 4;

  this.camera.rotation.x = relativeFrame / 132 / 4;
  this.camera.rotation.y = relativeFrame / 151 / 4;
  this.camera.rotation.z = relativeFrame / 163 / 4;

  this.updateTrain(frame, relativeFrame);
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
  var imagePrefix = "res/skyboxes/space-";
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

SpaceLayer.prototype.initMilkyWay = function() {
  var material = new THREE.MeshBasicMaterial({
    map: Loader.loadTexture("res/textures/milkyWay.png"),
    transparent: true,
    side: THREE.FrontSide,
    color: 0x888888
  });
  this.milkyWay = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), material);
  this.milkyWay.position.z = -9900;

  this.scene.add(this.milkyWay);
};

SpaceLayer.prototype.initTrain = function() {
  var that = this;
  var material = new THREE.MeshBasicMaterial({
    map: Loader.loadTexture('res/textures/train.jpg')
  });

  var objLoader = new THREE.OBJLoader();
  Loader.loadAjax('res/objects/train.obj', function(text) {
    var object = objLoader.parse(text);
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
    object.userData.initPos = {x: -5000, y: 1673, z: -3363};
    object.position.set(
      object.userData.initPos.x,
      object.userData.initPos.y,
      object.userData.initPos.z
    );
    object.userData.initSpeed = 58000;
    object.userData.acceleration = -200000;

    object.scale.set(20, 20, -20);
    that.train = object;
    that.scene.add(object);
  });

  var tailMaterial = new THREE.MeshBasicMaterial({
    map: Loader.loadTexture("res/textures/shootingStar.png"),
    transparent: true,
    side: THREE.FrontSide,
    color: 0x888888
  });
  this.shootingStar = new THREE.Mesh(new THREE.PlaneGeometry(510, 109), tailMaterial);
  var scale = 4;
  this.shootingStar.scale.set(scale, scale, scale);
  this.shootingStar.userData.xOffset = -1400;
  this.shootingStar.userData.zOffset = -450;
  this.shootingStar.position.set(
    -5000 + this.shootingStar.userData.xOffset,
    1673,
    -3363 + this.shootingStar.userData.zOffset
  );

  this.scene.add(this.shootingStar);
};

SpaceLayer.prototype.updateTrain = function(frame, relativeFrame) {
  if (!this.train) {
    return false;
  }
  if (relativeFrame >= this.config.train.startShootFrame
    && relativeFrame < this.config.train.endShootFrame) {
    var t = (relativeFrame - this.config.train.startShootFrame) / (this.config.train.endShootFrame - this.config.train.startShootFrame);
    var speed = this.train.userData.initSpeed + t * this.train.userData.acceleration;
    if (speed < 0) {
      this.scene.remove(this.train);
      this.scene.remove(this.shootingStar);
      this.train = null;
      this.shootingStar = null;
      return false;
    }
    this.train.position.x = this.train.userData.initPos.x
      + t * this.train.userData.initSpeed
      + 0.5 * this.train.userData.acceleration * t * t;
    this.shootingStar.position.x = this.train.position.x + this.shootingStar.userData.xOffset;
  }
};
