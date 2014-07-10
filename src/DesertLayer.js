/**
 * @constructor
 */
function DesertLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.scene.add(this.camera);

  this.waterHexes = [];

  this.waterPond = new THREE.Object3D();

  for (var i=0; i < 40; i++) {
    for (var j=0; j < 12; j++) {
      var offset = i%2 ? 150 : 0;
      var x = offset + j * 300 - 1500;
      var z = i * 86.6 - 1500;

      if (new THREE.Vector2(x, z).length() < 1500) {
        var hex = Hexagon(100, x, 0, z, randomBlue());
        this.waterHexes.push(hex);
        this.waterPond.add(hex);
      }
    }
  }

  var waterGeometry = new THREE.CircleGeometry(1500, 6);
  var waterMaterial = new THREE.MeshBasicMaterial({
    color: 0x3399ff
  });
  this.waterBG = new THREE.Mesh(waterGeometry, waterMaterial);
  this.waterBG.position.x = 0;
  this.waterBG.position.y = -10;
  this.waterBG.position.z = 0;
  this.waterBG.rotation.x = -Math.PI/2;
  this.waterPond.add(this.waterBG);

  this.waterPond.position.x = 900;
  this.waterPond.position.z = -300;
  this.waterPond.rotation.y = Math.PI/3;
  this.scene.add(this.waterPond);

  this.desertHexes = [];
  for (var i=0; i < 17; i++) {
    for (var j=0; j < 5; j++) {
      var offset = i%2 ? 2100 : 0;
      var x = offset + j * 4200 - 7500;
      var z = i * 1212.4 - 7500;

      if (new THREE.Vector2(x, z).length() >= 1500) {
        var hex = Hexagon(
            1400,
            x,
            this.config.waterAmplitude*2+5 + Math.random()*10,
            z,
            randomDesertColor()
            );
        this.desertHexes.push(hex);
        this.scene.add(hex);
      }
    }
  }
  for (var i = 0; i < this.desertHexes.length; i++) {
    var hex = this.desertHexes[i];
  }


  var waterBorderGeo = new THREE.TorusGeometry(1450, 150, 6, 6);
  var waterBorderMat = new THREE.MeshBasicMaterial({
    color: 0xafd7f7
  });
  this.waterBorder = new THREE.Mesh(waterBorderGeo, waterBorderMat);
  this.waterBorder.position.x = 900;
  this.waterBorder.position.z = -300;
  this.waterBorder.position.y = this.config.waterAmplitude*2+2;
  this.waterBorder.rotation.x = -Math.PI/2;
  this.waterBorder.rotation.z = Math.PI/3;
  this.scene.add(this.waterBorder);

  this.skyBox = this.createSkybox('res/skyboxes/dunes_');
  this.scene.add(this.skyBox);
  this.doomSkyBox = this.createSkybox('res/skyboxes/dunes_doom_');
  this.doomSkyBox.scale.set(0.99, 0.99, 0.99);
  this.scene.add(this.doomSkyBox);

  this.initDandelionSeedMaterials();
  this.dandelionSeed = DandelionSeed(this, 0.2);
  this.dandelionSeed.position.y = 300;
  this.scene.add(this.dandelionSeed);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

DesertLayer.prototype.createSkybox = function(imagePrefix) {
  var directions  = ["right", "left", "top", "bottom", "front", "back"];
  var imageSuffix = ".jpg";
  var skyGeometry = new THREE.BoxGeometry(15000, 15000, 15000);

  var materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
      map: Loader.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide,
      transparent: true
    }));
  }
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  skyBox.position.y = 1500;//+this.config.waterAmplitude*2;
  return skyBox;
};

DesertLayer.prototype.initDandelionSeedMaterials = function() {
  this.dandelionSeedMaterials = {
    wing: new THREE.MeshBasicMaterial({color: 0xEEEEEE, opacity: 0.5, transparent: true}),
    body: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedBodyTexture.png')
    }),
    seed: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedTexture.png')
    })
  };
};

DesertLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

DesertLayer.prototype.start = function() {
};

DesertLayer.prototype.end = function() {
};

DesertLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

DesertLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);

  for (var i = 0; i < this.waterHexes.length; i++) {
    var hex = this.waterHexes[i];

    var dist = hex.position.length();
    hex.position.y = (Math.sin(relativeFrame/10+dist/1000) + 1) * this.config.waterAmplitude;

    var newColor = hex.userData.baseColor.clone();
    newColor.multiplyScalar(1 + hex.position.y / (this.config.waterAmplitude * 8));
    hex.material.color = newColor;
  }

  //TODO: don't update dandelion seed when it is not in sight
  this.updateDandelionSeed(frame, relativeFrame);

  for(var i = 0; i < this.doomSkyBox.material.materials.length; i++) {
    var material = this.doomSkyBox.material.materials[i];
    material.opacity = smoothstep(0, 1, (frame - 4400) / (4440 - 4400));
  }
};

DesertLayer.prototype.updateDandelionSeed = function(frame, relativeFrame) {
  this.dandelionSeed.rotation.x = 0.25 * Math.sin(relativeFrame * 0.0321 + 5);
  this.dandelionSeed.rotation.y = 0.018 * relativeFrame + 0.15 * Math.sin(relativeFrame * 0.035);
  this.dandelionSeed.rotation.z = 0.28 * Math.cos(relativeFrame * 0.03);

  for (var i = 0; i < this.dandelionSeed.wingCylinders.length; i++) {
    var wingCylinder = this.dandelionSeed.wingCylinders[i];
    wingCylinder.rotation.z = wingCylinder.initialRotation.z + Math.PI / 8 * Math.sin(wingCylinder.rotation.z) * (0.5 + 0.02 * i) * 0.8 * Math.sin(relativeFrame * 0.036);
    wingCylinder.rotation.y = wingCylinder.initialRotation.y + Math.sin(i) * 0.3 * Math.sin(relativeFrame * 0.022);
  }
};

function Hexagon(radius, x, y, z, color) {
  var hexGeometry = new THREE.CircleGeometry(radius, 6);
  var hex = new THREE.Mesh(
    hexGeometry, new THREE.MeshBasicMaterial({
      color: color,
      shading: THREE.FlatShading
  }));
  hex.position = new THREE.Vector3(x, y, z);
  hex.rotation.x = -Math.PI/2;
  hex.userData.baseColor = hex.material.color;
  return hex;
}

function randomBlue() {
  return new THREE.Color(
    Math.random() * 0.05 + 0.15,
    Math.random() * 0.1 + 0.6,
    1
  );
}
function randomDesertColor() {
  return new THREE.Color(
    1,
    Math.random() * 0.1 + 0.8,
    Math.random() * 0.1 + 0.6
  );
}

/**
 * @param layer reference to instance of DesertLayer
 * @param scale number between 0 and x
 * @returns {THREE.Object3D}
 * @constructor
 */
function DandelionSeed(layer, scale) {
  var seedSphereGeometry, bodyCylinderGeometry, wingCylinderGeometry, //geometries
    dandelionSeed, seedSphere, topSphere, bodyCylinder, // meshes
    WING_LENGTH = 120; //constants

  seedSphereGeometry = new THREE.SphereGeometry(12, 12, 20);
  bodyCylinderGeometry = new THREE.CylinderGeometry(2, 2, 240, 16);
  wingCylinderGeometry = new THREE.CylinderGeometry(0.5, 1, WING_LENGTH, 8);
  wingCylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, WING_LENGTH / 2, 0));

  dandelionSeed = new THREE.Object3D();

  seedSphere = new THREE.Mesh(seedSphereGeometry, layer.dandelionSeedMaterials.seed);
  seedSphere.scale.y = 2.9;
  seedSphere.position.y = -240;

  bodyCylinder = new THREE.Mesh(bodyCylinderGeometry, layer.dandelionSeedMaterials.body);
  bodyCylinder.position.y = -120;

  dandelionSeed.wingCylinders = [];

  Math.seedrandom("iverjo-is-sexy");
  for (var i = 0; i < 50; i++) {
    var wingCylinder = new THREE.Mesh(wingCylinderGeometry, layer.dandelionSeedMaterials.wing);

    wingCylinder.rotation.z = Math.PI / 5 + Math.random() * (Math.PI / 2 - Math.PI / 4);
    wingCylinder.rotation.y = Math.random() * 2 * Math.PI;
    wingCylinder.initialRotation = {
      x: wingCylinder.rotation.x,
      y: wingCylinder.rotation.y,
      z: wingCylinder.rotation.z
    };

    dandelionSeed.wingCylinders.push(wingCylinder);
    dandelionSeed.add(wingCylinder);
  }

  dandelionSeed.add(seedSphere);
  dandelionSeed.add(bodyCylinder);

  dandelionSeed.scale.set(scale, scale, scale);

  return dandelionSeed;
}
