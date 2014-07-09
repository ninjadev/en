/**
 * @constructor
 */
function DesertLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.scene.add(this.camera);

  var volcanoFactory = new VolcanoFactory( this.scene );
  this.volcano = volcanoFactory.create(
    new THREE.Vector3( 920.5, -5,-272.03 ),
    28, // Base scale
    100, // Max lava ball size
    120, // Number of lava balls
    false // Party mode
    );

  this.light1 = new THREE.DirectionalLight();
  this.light1.position.set(-1000, -1000, 1000);
  this.scene.add(this.light1);
  this.scene.add(new THREE.AmbientLight(0x222222));

  this.waterHexes = [];

  this.waterPond = new THREE.Object3D();

  Math.seedrandom('water');
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
    color: 0x539cc6
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
  this.dandelionSeed.position.copy(this.config.dandelion.start);
  this.scene.add(this.dandelionSeed);

  this.initGrass();

  this.Z = 10;

  //this.splines = DesertLayer.createTreeSplines();
  //console.log(a = this.splines);
  //
  this.treeScale = 5;
  
  this.splines = [
    /* 1 */
    new THREE.SplineCurve3([
      new THREE.Vector3(0, 0, 0).multiplyScalar(this.treeScale),
      new THREE.Vector3(-1, 10, 1).multiplyScalar(this.treeScale),
      new THREE.Vector3(-15, 25, 0).multiplyScalar(this.treeScale),
      new THREE.Vector3(8, 52, -10).multiplyScalar(this.treeScale),
      new THREE.Vector3(11, 66, -5).multiplyScalar(this.treeScale),
      new THREE.Vector3(7, 78, -2).multiplyScalar(this.treeScale),
      new THREE.Vector3(-10, 82, 0).multiplyScalar(this.treeScale),
      new THREE.Vector3(-33, 68, 1).multiplyScalar(this.treeScale),
      new THREE.Vector3(-45, 71, 4).multiplyScalar(this.treeScale),
      new THREE.Vector3(-52, 69, 5).multiplyScalar(this.treeScale),
      new THREE.Vector3(-63, 81, 5).multiplyScalar(this.treeScale),
      new THREE.Vector3(-64, 91, 5).multiplyScalar(this.treeScale)
    ]),

    /* 2 */
    new THREE.SplineCurve3([
      new THREE.Vector3(11, 66, 0).multiplyScalar(this.treeScale),
      new THREE.Vector3(24, 77, -10).multiplyScalar(this.treeScale),
      new THREE.Vector3(38, 88, -14).multiplyScalar(this.treeScale),
      new THREE.Vector3(54, 89, -15).multiplyScalar(this.treeScale),
      new THREE.Vector3(63, 93, -18).multiplyScalar(this.treeScale)
    ]),

    /* 3 */
    new THREE.SplineCurve3([
      new THREE.Vector3(38, 88, -14).multiplyScalar(this.treeScale),
      new THREE.Vector3(49, 95, -13).multiplyScalar(this.treeScale),
      new THREE.Vector3(64, 103, -11).multiplyScalar(this.treeScale),
      new THREE.Vector3(82, 103, -10).multiplyScalar(this.treeScale)
    ]),

    /* 4 */
    new THREE.SplineCurve3([
      new THREE.Vector3(7, 78, -2).multiplyScalar(this.treeScale),
      new THREE.Vector3(15, 84, 10).multiplyScalar(this.treeScale),
      new THREE.Vector3(12, 87, 8).multiplyScalar(this.treeScale),
      new THREE.Vector3(22, 111, 16).multiplyScalar(this.treeScale),
      new THREE.Vector3(38, 117, 25).multiplyScalar(this.treeScale)
    ]),

    /* 5 */
    new THREE.SplineCurve3([
      new THREE.Vector3(7, 78, -2).multiplyScalar(this.treeScale),
      new THREE.Vector3(3, 84, -5).multiplyScalar(this.treeScale),
      new THREE.Vector3(-16, 70, -19).multiplyScalar(this.treeScale),
      new THREE.Vector3(-25, 88, -24).multiplyScalar(this.treeScale),
      new THREE.Vector3(-28, 92, -26).multiplyScalar(this.treeScale),
      new THREE.Vector3(-20, 104, -30).multiplyScalar(this.treeScale),
      new THREE.Vector3(-15, 122, -32).multiplyScalar(this.treeScale)
    ])
  ];



  this.rubbles = [];
  for(var i = 0; i < 100; i++) {
    var rubble = new THREE.Mesh(
        new THREE.BoxGeometry(
          2 * (this.Z + this.Z / 10 * Math.random()),
          2 * (this.Z + this.Z / 10 * Math.random()),
          2 * (this.Z + this.Z / 10 * Math.random())),
        new THREE.MeshLambertMaterial({
          color: 0x444444
        }));
    var maxlen = 2 * this.Z;
    this.rubbleMaxlen = maxlen;
    var deg = Math.random() * 2 * 3.141592;
    var len = Math.random() * maxlen;
    rubble.position.x = 402.44;
    rubble.position.z = 1311.14;
    rubble.rotation.x = Math.random() * 3.141592;
    rubble.rotation.y = Math.random() * 3.141592;
    rubble.rotation.z = Math.random() * 3.141592;
    rubble.position.x += Math.cos(deg) * len;
    rubble.position.z += Math.sin(deg) * len;
    rubble.position.targetY = 11 + this.Z * Math.sqrt((maxlen - Math.abs(rubble.position.x)) *
                        (maxlen - Math.abs(rubble.position.y))) * Math.random();
    this.scene.add(rubble);
    this.rubbles[i] = rubble;
  }


  this.greenColor = new THREE.Color(0xa3cd01).getHSL();
  this.lightBrownColor = new THREE.Color(0xc3a779).getHSL();
  this.darkBrownColor = new THREE.Color(0x4f4340).getHSL();
  this.darkBrownColor = new THREE.Color(0xffffff).getHSL();
  this.barkTexture = Loader.loadTexture('/res/bark.jpg');
  this.barkTexture.wrapS = this.barkTexture.wrapT = THREE.RepeatWrapping;
  this.barkTexture.repeat.set(12, 4);
  this.barkNormalMap = Loader.loadTexture('/res/bark-normalmap.jpg');
  this.barkNormalMap.wrapS = this.barkNormalMap.wrapT = THREE.RepeatWrapping;
  this.barkNormalMap.repeat.set(12, 4);
  Loader.start(function(){}, function(){});

  this.tubes = [];
  for(var i = 0; i < this.splines.length; i++) {
    var spline = this.splines[i];
    var tubeGeometry = new THREE.TubeGeometryEx(
      spline, 500, 10 * this.treeScale, 12, false, true);
    tubeGeometry.dynamic = true;
    this.tubes[i] = new THREE.Mesh(
      tubeGeometry,
      new THREE.MeshPhongMaterial({
        color: 0x4f4340,
        map: this.barkTexture,
        normalMap: this.barkNormalMap,
        shininess: 10
      }));
    this.scene.add(this.tubes[i]);
  }

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
    wing: new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.65, transparent: true}),
    body: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedBodyTexture.png')
    }),
    seed: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedTexture.png')
    })
  };
};

DesertLayer.prototype.initGrass = function() {
  this.grasses = [];
  this.numGrasses = 100;
  this.grass = {
    growthDuration: this.config.grass.endGrowthFrame - this.config.grass.startGrowthFrame,
    startY: -200,
    targetY: this.config.waterAmplitude * 2 + 10
  };
  this.grass.maxFramesOffset = 0.01 * this.grass.growthDuration * (this.numGrasses - 1);

  var that = this;
  var material = new THREE.MeshBasicMaterial({
    map: Loader.loadTexture('res/textures/grass_diffuse.png')
  });

  var loader = new THREE.OBJLoader();
  loader.load('http://localhost:9999/res/objects/Grass_01.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    for (var i = 0; i < that.numGrasses; i++) {
      var clonedObject = object.clone();
      Math.seedrandom('yo' + i.toString());
      var randomAngle = Math.random() * 2 * Math.PI;
      var randomRadius = 1700 + 800 * Math.random();
      clonedObject.position.x = 900 + randomRadius * Math.cos(randomAngle);
      clonedObject.position.y = that.grass.startY;
      clonedObject.position.z = -300 + randomRadius * Math.sin(randomAngle);
      clonedObject.rotation.y = Math.sin(randomRadius);
      Math.seedrandom("iverjo-likes-grass" + i.toString());
      var scale = 150 + 150 * Math.random();
      clonedObject.scale.set(scale, scale * 1.25, scale * 1.5);
      clonedObject.initScale = scale;
      that.grasses.push(clonedObject);
      that.scene.add(clonedObject);
    }
  });
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

  if (frame < 4400) {
    this.scene.remove(this.volcano);
  } else if (frame > 4400) {
    this.scene.add(this.volcano);
    this.volcano.update( frame - 4600 );
    this.volcano.position.y = clamp(-10, -10 + (frame - 4400) / 27, 20);
  }

  var material = this.waterBorder.material;
  material.color = new THREE.Color(
    smoothstep(0.33, 0.6, (frame - 4400) / (4440 - 4400)),
    smoothstep(0.61, 0.24, (frame - 4400) / (4440 - 4400)),
    smoothstep(0.78, 0.2, (frame - 4400) / (4440 - 4400)));

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

  this.updateGrass(frame, relativeFrame);

  for(var i = 0; i < this.doomSkyBox.material.materials.length; i++) {
    var material = this.doomSkyBox.material.materials[i];
    material.opacity = smoothstep(0, 1, (frame - 4400) / (4440 - 4400));
  }
};

DesertLayer.prototype.updateDandelionSeed = function(frame, relativeFrame) {
  for (var i = 0; i < this.dandelionSeed.wingCylinders.length; i++) {
    var wingCylinder = this.dandelionSeed.wingCylinders[i];
    wingCylinder.rotation.z = wingCylinder.initialRotation.z + Math.PI / 8 * Math.sin(wingCylinder.rotation.z) * (0.5 + 0.02 * i) * 0.8 * Math.sin(relativeFrame * 0.036);
    wingCylinder.rotation.y = wingCylinder.initialRotation.y + Math.sin(i) * 0.3 * Math.sin(relativeFrame * 0.022);
  }

  var options = this.config.dandelion;
  var groundLevel = this.config.waterAmplitude*2+100;

  this.dandelionSeed.position.y = options.start.y + options.speed * relativeFrame;
  if (this.dandelionSeed.position.y > groundLevel) {
    var t = relativeFrame / 60 * options.rotationSpeed;
    this.dandelionSeed.position.x = options.start.x + Math.sin(t) * options.rotationRadius;
    this.dandelionSeed.position.z = options.start.z + Math.cos(t) * options.rotationRadius;

    this.dandelionSeed.rotation.x = 0.25 * Math.sin(relativeFrame * 0.0321 + 5);
    this.dandelionSeed.rotation.y = 0.018 * relativeFrame + 0.15 * Math.sin(relativeFrame * 0.035);
    this.dandelionSeed.rotation.z = 0.28 * Math.cos(relativeFrame * 0.03);
  } else {
    this.dandelionSeed.position.y = groundLevel;
  }

  this.growthIndex = relativeFrame / 10;

  var treeRelativeFrame = relativeFrame + 1897 - 957;
  var treeColor = this.getTreeColor(treeRelativeFrame - 1897).getHSL();

  var radiusDampener = 0.1 + (treeRelativeFrame - 1897) / (4439 - 1897);
  for(var i = 0; i < this.tubes.length; i++) {
    var tube = this.tubes[i];
    tube.material.color.setHSL(treeColor.h, treeColor.s, treeColor.l);
    var growthIndex = [
      (treeRelativeFrame - 1897) / 20,
      (treeRelativeFrame - 2420) / 20,
      (treeRelativeFrame - 3200) / 20,
      (treeRelativeFrame - 2800) / 20,
      (treeRelativeFrame - 2900) / 20
    ][i];
    for(var j = 0; j < tube.geometry.vertices.length; j++) {
      var vertex = tube.geometry.vertices[j];
      var center = tube.geometry.centers[j];
      var radius = tube.geometry.radii[j];
      var index = tube.geometry.indexes[j];
      vertex.x = center.x + radius.x * radiusDampener * clamp(
          0, growthIndex - index / 10, 1 - center.y / 140 / this.treeScale);
      vertex.y = center.y + radius.y * radiusDampener * clamp(
          0, growthIndex - index / 10, 1 - center.y / 140 / this.treeScale);
      vertex.z = center.z + radius.z * radiusDampener * clamp(
          0, growthIndex - index / 10, 1 - center.y / 140 / this.treeScale);
    }
    tube.geometry.verticesNeedUpdate = true;

    tube.position.y = 11;
  }
};

DesertLayer.prototype.updateGrass = function(frame, relativeFrame) {
  //grow
  if (relativeFrame >= this.config.grass.startGrowthFrame
    && relativeFrame < (this.config.grass.endGrowthFrame + this.grass.maxFramesOffset)) {
    for (var i = 0; i < this.grasses.length; i++) {
      var grass = this.grasses[i];
      var offset = 0.01 * this.grass.growthDuration * i;
      var t = (relativeFrame - this.config.grass.startGrowthFrame - offset) / this.grass.growthDuration;
      grass.position.y = smoothstep(this.grass.startY, this.grass.targetY, t);
      var scale = smoothstep(0.01, grass.initScale, t - 0.25);
      grass.scale.set(scale, scale, scale);
    }
  }

  //windy
  if (relativeFrame >= this.config.grass.startGrowthFrame
    && relativeFrame < this.config.grass.windyUntilFrame) {
    for (var i = 0; i < this.grasses.length; i++) {
      this.grasses[i].rotation.x = 0.16 * Math.sin(relativeFrame * 0.033 + 1.5 * i / this.grasses.length);
    }
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
    Math.random() * 0.1 + .75,
    Math.random() * 0.05 + 0.45
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


DesertLayer.createTreeSplines = function() {
  var V = THREE.Vector3;
  var root = [new V(0, 0, 0), new V(0, 10, 0), new V(0, 20, 0)];
  var splines = [root];
  var stack = [root];

  var pContinue = 0.5;
  var pSpawn = 0.0;

  max = 200;


  while(stack.length && (max --> 0)) {
    var current = stack.pop();
    var last = current[current.length - 1];     
    var secondLast = current[current.length - 2];     
    var newest = new V(
      last.x * 2 - secondLast.x,
      last.y * 2 - secondLast.y,
      last.z * 2 - secondLast.z
    );
    newest.normalize();
    newest.add(new V((Math.random() - 0.5) * 8,
                     (Math.random() - 0.2) * 8,
                     (Math.random() - 0.5) * 8));
    newest.normalize();
    newest.multiplyScalar(1000 / current.length);
    newest.add(last);

    if(Math.random() < pContinue) {
      current.push(newest);
      stack.push(current);
    }

    if(Math.random() < pSpawn) {
      var second = new V(Math.random() - 0.5,
                         Math.random() - 0.4,
                         Math.random() - 0.5);
      second.normalize();
      second.multiplyScalar(20);
      var third = new V().copy(second);
      second.add(last);
      third.add(second);
      var newSpline = [new V().copy(last), second, third];
      stack.push(newSpline);
      splines.push(newSpline);
    }
  }

  for(var i = 0; i < splines.length; i++) {
    splines[i] = new THREE.SplineCurve3(splines[i]);
  }

  return splines;
}


DesertLayer.prototype.getTreeColor = function(relativeFrame) {
  this.greenColor = new THREE.Color(0xa3cd01).getHSL();
  this.lightBrownColor = new THREE.Color(0xc3a779).getHSL();
  this.darkBrownColor = new THREE.Color(0x4f4340).getHSL();
  this.darkBrownColor = new THREE.Color(0xffffff).getHSL();
  var firstStop = 300;
  var secondStop = 500;
  var thirdStop = 1000;

  if(relativeFrame < secondStop) {
    var fromColor = this.greenColor;
    var toColor = this.lightBrownColor;
    var from = firstStop;
    var to = secondStop;
  } else if(relativeFrame < thirdStop) {
    var fromColor = this.lightBrownColor;
    var toColor = this.darkBrownColor;
    var from = secondStop;
    var to = thirdStop;
  } else {
    var fromColor = this.darkBrownColor;
    var toColor = this.darkBrownColor;
    var from = thirdStop;
    var to = thirdStop;
  }

  var colorH = lerp(fromColor.h,
      toColor.h,
      (relativeFrame - from) / (to - from));
  var colorS = lerp(fromColor.s,
      toColor.s,
      (relativeFrame - from) / (to - from));
  var colorL = lerp(fromColor.l,
      toColor.l,
      (relativeFrame - from) / (to - from));
  var color = new THREE.Color();
  color.setHSL(colorH, colorS, colorL);
  return color;
}
