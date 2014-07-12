/**
 * @constructor
 */
function DesertLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;
  this.scene.add(this.camera);

  this.WATER_CENTER_X = 900;
  this.WATER_CENTER_Z = -300;

  //light
  this.ambientLight = new THREE.AmbientLight(0x555555);
  this.light1 = new THREE.PointLight(0xFFEAC3, .7);
  this.light2 = new THREE.PointLight(0xFFEAC3, .3);
  this.light3 = new THREE.PointLight(0xFFEAC3, .3);
  this.light4 = new THREE.PointLight(0xFFEAC3, .3);
  this.light5 = new THREE.PointLight(0xFFEAC3, .3);
  this.directionalLight = new THREE.DirectionalLight( 0xFFCC79, 0.4 );
  this.light1.position = new THREE.Vector3(this.WATER_CENTER_X, 1000, this.WATER_CENTER_Z);
  this.light2.position = new THREE.Vector3(this.WATER_CENTER_X + 1500, 1000, this.WATER_CENTER_Z);
  this.light3.position = new THREE.Vector3(this.WATER_CENTER_X, 1000, this.WATER_CENTER_Z + 1500);
  this.light4.position = new THREE.Vector3(this.WATER_CENTER_X - 1500, 1000, this.WATER_CENTER_Z);
  this.light5.position = new THREE.Vector3(this.WATER_CENTER_X, 1000, this.WATER_CENTER_Z - 1500);
  this.directionalLight.position = new THREE.Vector3(this.WATER_CENTER_X, 1000, this.WATER_CENTER_Z);
  this.scene.add(this.ambientLight);
  this.scene.add(this.light1);
  this.scene.add(this.light2);
  this.scene.add(this.light3);
  this.scene.add(this.light4);
  this.scene.add(this.light5);
  this.scene.add(this.directionalLight);

  var volcanoFactory = new VolcanoFactory( this.scene );
  this.volcano = volcanoFactory.create(
    new THREE.Vector3( 920.5, -5,-272.03 ),
    28, // Base scale
    100, // Max lava ball size
    120, // Number of lava balls
    false // Party mode
    );

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

  var rocketHexGeo = new THREE.CylinderGeometry(1500, 1500, 5000, 6);
  this.rocketStartPosition = -10000; 

  var rocketHex = new THREE.Mesh(
    rocketHexGeo, new THREE.MeshLambertMaterial({
      color: 0xbb8855,
      shading: THREE.FlatShading
  }));
  rocketHex.receiveShadow = true;
  rocketHex.position = new THREE.Vector3(900, -10000, -189);
  rocketHex.rotation.y = Math.PI / 6;

  this.rocketHex = rocketHex;
  this.scene.add(rocketHex);
  this.rocketStart = 4870;

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

  this.waterPond.position.x = this.WATER_CENTER_X;
  this.waterPond.position.z = this.WATER_CENTER_Z;
  this.waterPond.rotation.y = Math.PI/3;
  this.scene.add(this.waterPond);

  this.desertHexStart = -4980;
  this.desertHexes = [];
  for (var i=0; i < 17; i++) {
    for (var j=0; j < 5; j++) {
      var offset = i%2 ? 2100 : 0;
      var x = offset + j * 4200 - 7500;
      var z = i * 1212.4 - 7500;

      if (new THREE.Vector2(x, z).length() >= 1500) {
        var hex = DesertHexagon(
            1400,
            x,
            this.desertHexStart,
            z,
            randomDesertColor()
            );
        this.desertHexes.push(hex);
        this.scene.add(hex);
      }
    }
  }
  // Change this to change the entire timing of the  desert floor falling out animation.
  this.hexagonFallingBase = 3090;

  this.hexagonFallingTimings = {}
  this.hexagonFallingTimings[0] = this.hexagonFallingBase + 120;
  this.hexagonFallingTimings[5] = this.hexagonFallingBase + 130;
  this.hexagonFallingTimings[1] = this.hexagonFallingBase + 140;
  this.hexagonFallingTimings[6] = this.hexagonFallingBase + 150;
  this.hexagonFallingTimings[17] = this.hexagonFallingBase + 150;
  this.hexagonFallingTimings[2] = this.hexagonFallingBase + 160;
  this.hexagonFallingTimings[7] = this.hexagonFallingBase + 170;
  this.hexagonFallingTimings[3] = this.hexagonFallingBase + 180;
  this.hexagonFallingTimings[8] = this.hexagonFallingBase + 190;


  this.hexagonFallingTimings[11] = this.hexagonFallingBase + 150;
  this.hexagonFallingTimings[21] = this.hexagonFallingBase + 160;
  this.hexagonFallingTimings[31] = this.hexagonFallingBase + 170;
  this.hexagonFallingTimings[40] = this.hexagonFallingBase + 180;
  this.hexagonFallingTimings[50] = this.hexagonFallingBase + 190;
  this.hexagonFallingTimings[60] = this.hexagonFallingBase + 200;

  // Follow this rising with camera
  this.hexagonFallingTimings[51] = 5370
  this.hexagonFallingTimings[41] = 3200 + 140;
  this.hexagonFallingTimings[25] = 3200 + 140;
  this.hexagonFallingTimings[34] = 3200 + 145;
  this.hexagonFallingTimings[44] = 3200 + 145;

  this.hexagonFallingTimings[18] = this.hexagonFallingBase + 0;
  this.hexagonFallingTimings[23] = this.hexagonFallingBase + 40;
  this.hexagonFallingTimings[27] = this.hexagonFallingBase + 80;

  var waterBorderGeo = new THREE.TorusGeometry(1450, 150, 6, 6);
  var waterBorderMat = new THREE.MeshBasicMaterial({
    color: 0x539cc6
  });

  this.waterBorder = new THREE.Mesh(waterBorderGeo, waterBorderMat);
  this.waterBorder.position.x = this.WATER_CENTER_X;
  this.waterBorder.position.z = this.WATER_CENTER_Z;
  this.waterBorder.position.y = this.config.waterAmplitude*2+2;
  this.waterBorder.rotation.x = -Math.PI/2;
  this.waterBorder.rotation.z = Math.PI/3;
  this.scene.add(this.waterBorder);

  this.skyBox = this.createSkybox('res/skyboxes/dunes_');
  this.scene.add(this.skyBox);
  this.doomSkyBox = this.createSkybox('res/skyboxes/dunes_doom_');
  this.doomSkyBox.scale.set(0.99, 0.99, 0.99);
  this.scene.add(this.doomSkyBox);

  this.initDandelionSeeds();
  this.initGrass();
  this.initWaterPlants();

  this.initShadowLight(this.dandelionSeed);

  this.Z = 10;

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


  // TODO: Functioning, has to be moved somewhere visible.
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
  this.barkTexture = Loader.loadTexture('res/bark.jpg');
  this.barkTexture.wrapS = this.barkTexture.wrapT = THREE.RepeatWrapping;
  this.barkTexture.repeat.set(12, 4);
  this.barkNormalMap = Loader.loadTexture('res/bark-normalmap.jpg');
  this.barkNormalMap.wrapS = this.barkNormalMap.wrapT = THREE.RepeatWrapping;
  this.barkNormalMap.repeat.set(12, 4);
  if(!window.FILES){
    Loader.start(function(){}, function(){});
  }

  this.tubes = [];
  this.tubeContainer = new THREE.Object3D();
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
    this.tubeContainer.add(this.tubes[i]);
  }

  var leafFactory = new LeafFactory();
  this.leaves = [];
  for(var i = 0; i < this.tubes.length; i++) {
    var tube = this.tubes[i];

    var lenVertices = tube.geometry.vertices.length;
    for (var j = Math.floor(lenVertices / 2); j < lenVertices; j += 150) {
      var center = tube.geometry.centers[j];
      var leaf = leafFactory.createDouble(96);
      leaf.position = center.clone();
      this.leaves.push(leaf);
      this.tubeContainer.add(leaf);
    }
  }

  this.scene.add(this.tubeContainer);
  this.tubeContainer.position = new THREE.Vector3(-800.27, 0,-55.13);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.initSmokeColumns();
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
  skyBox.position.y = 1500;
  return skyBox;
};

DesertLayer.prototype.initDandelionSeeds = function() {
  this.dandelionSeedMaterials = {
    wing: new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.75, transparent: true}),
    body: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedBodyTexture.png')
    }),
    seed: new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/seedTexture.png')
    })
  };

  //the one dandelion seed that matters (the camera follows it and it turns into a tree)
  this.dandelionSeed = DandelionSeed(this, true, 50);
  this.dandelionSeed.position.copy(this.config.dandelion.start);
  this.scene.add(this.dandelionSeed);

  //more flying dandelion seed
  this.fakeDandelionSeeds = [];
  var numFakeDandelionSeeds = 15;
  Math.seedrandom('so-many-wow');
  for (var i = 0; i < numFakeDandelionSeeds; i++) {
    var fakeDandelionSeed = DandelionSeed(this, false, 20);
    fakeDandelionSeed.position.copy(this.config.dandelion.start);
    fakeDandelionSeed.position.x += 1000 * Math.random();
    fakeDandelionSeed.position.y += 800 * Math.random();
    fakeDandelionSeed.position.z += 1000 * Math.random();
    fakeDandelionSeed.userData.initPos = {
      x: fakeDandelionSeed.position.x,
      y: fakeDandelionSeed.position.y,
      z: fakeDandelionSeed.position.z
    };
    this.fakeDandelionSeeds.push(fakeDandelionSeed);
    this.scene.add(fakeDandelionSeed);
  }
};

DesertLayer.prototype.initGrass = function() {
  this.grasses = [];
  this.numGrasses = 100;
  this.grass = {
    growthDuration: this.config.grass.endGrowthFrame - this.config.grass.startGrowthFrame,
    startY: -180,
    targetY: this.config.waterAmplitude * 2 + 10
  };
  this.grass.maxFramesOffset = 0.01 * this.grass.growthDuration * (this.numGrasses - 1);

  var that = this;

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: Loader.loadTexture('res/textures/grass_diffuse.png'),
    normalMap: Loader.loadTexture('res/textures/grass_normal.png'),
    shininess: 15,
    side: THREE.DoubleSide
  });

  Loader.loadAjax('res/objects/Grass_01.obj', function(text) {
    var objLoader = new THREE.OBJLoader();
    var object = objLoader.parse(text);
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
      clonedObject.position.x = that.WATER_CENTER_X + randomRadius * Math.cos(randomAngle);
      clonedObject.position.y = that.grass.startY;
      clonedObject.position.z = that.WATER_CENTER_Z + randomRadius * Math.sin(randomAngle);
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

DesertLayer.prototype.initShadowLight = function(parrent) {
  this.danderlight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
  this.danderlight.target.position.set( -803, 60, -61 );

  this.danderlight.castShadow = true;

  this.danderlight.shadowCameraNear = 10;
  this.danderlight.shadowCameraFar = 2500;
  this.danderlight.shadowCameraFov = 50;

  this.danderlight.shadowCameraVisible = false;

  this.danderlight.shadowBias = 0.0001;
  this.danderlight.shadowDarkness = 0.5;

  this.danderlight.shadowMapWidth = 2048;
  this.danderlight.shadowMapHeight = 1024;

  this.scene.add(this.danderlight);
}

DesertLayer.prototype.updateShadowLight = function() {
  this.danderlight.position = new THREE.Vector3( -25,200,100).add(this.dandelionSeed.position);
}

DesertLayer.prototype.initSmokeColumns = function() {
  this.smokeColumns = new Array();
  this.smokeBirthTimes = new Array();
  /*new THREE.MeshBasicMaterial({
      map: Loader.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide,
      transparent: true
    }));*/
  this.particleTexture = Loader.loadTexture( 'res/smokeparticle.png' );
  if(!window.FILES) {
    Loader.start( function(){}, function(){});
  }
  this.spriteMaterial = new THREE.SpriteMaterial({
    map: this.particleTexture,
    useScreenCoordinates: false,
    color: 0xffffff,
    sizeAttenuation: true
  });
};

DesertLayer.prototype.addSmokeColumn = function(x,y,z,frame,imgScale,radiusRange,totalParticles) {

  this.smokeColumns.push( new THREE.Object3D() );
  var smokeColumn = this.smokeColumns[this.smokeColumns.length-1];

  smokeColumn.particleAttributes = { startSize: [], startPosition: [], randomness: [] };

  var totalParticles = 4;
  var radiusRange = 90;
  for(var i=0; i < totalParticles; i++) {
    smokeColumn.add(new THREE.Sprite(this.spriteMaterial));
    smokeColumn.children[i].scale.set(imgScale, imgScale, 1.0); // imageWidth, imageHeight
    smokeColumn.children[i].position.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
        );
    smokeColumn.children[i].position.setLength(
        radiusRange * (Math.random() * 0.1 + 0.9)
        );
    smokeColumn.children[i].material.color.setHSL(120, 0, 1); 
    smokeColumn.children[i].material.blending = THREE.AlphaBlending; // "glowing" particles
    smokeColumn.particleAttributes.startPosition.push(smokeColumn.children[i].position.clone());
    smokeColumn.particleAttributes.randomness.push(Math.random());
  }

  smokeColumn.position.set(x,y,z);
  this.scene.add(smokeColumn);
  this.smokeBirthTimes.push(frame);
};

DesertLayer.prototype.updateSmoke = function(frame) {
  for(var i=0;i<this.smokeColumns.length; i++) {
    if(frame-this.smokeBirthTimes[i]>540 || frame-this.smokeBirthTimes[i]<-1) {
      console.log(this.smokeColumns);
      this.scene.remove(this.smokeColumns[i]);
      delete this.smokeColumns[i];
      this.smokeColumns.splice(i,1);
      this.smokeBirthTimes.splice(i,1);
    }
  }
  for(var i=0;i<this.smokeColumns.length; i++) {
    this.updateSmokeColumn(this.smokeColumns[i], i, frame);
  }
};
DesertLayer.prototype.updateSmokeColumn = function(updateParticleGroup, age, frame){

  for (var c=0; c < updateParticleGroup.children.length; c++) {
    var particle = updateParticleGroup.children[c];
    var attributes = updateParticleGroup.particleAttributes;
    var a = attributes.randomness[c] + 1;
    var pulseFactor = Math.sin(a * 0.01 * frame * 1000 / 60) * 0.1 + 0.9;
    var downscaling = 1 -  (frame - this.smokeBirthTimes[age] + 1) / 200;
    particle.position.x = attributes.startPosition[c].x * pulseFactor * downscaling;
    particle.position.y = attributes.startPosition[c].y * pulseFactor + (frame - this.smokeBirthTimes[age]);
    particle.position.z = attributes.startPosition[c].z * pulseFactor * downscaling;
  }

  updateParticleGroup.rotation.y = frame * 1000 / 60 * 0.00075;
};

DesertLayer.prototype.initWaterPlants = function() {
  this.waterPlants = [];
  this.numWaterPlants = 20;
  this.config.waterPlants.growthDuration = this.config.waterPlants.endGrowthFrame - this.config.waterPlants.startGrowthFrame;
  this.config.waterPlants.startY = -150;
  this.config.waterPlants.targetY = this.config.waterAmplitude * 2 + 60;
  this.config.waterPlants.maxFramesOffset = 0.01 * this.grass.growthDuration * (this.numWaterPlants - 1);

  var that = this;
  var duckweedMaterial = new THREE.MeshLambertMaterial({
    color: 0x105107,
    side: THREE.FrontSide
  });
  var outerLotusMaterial = new THREE.MeshLambertMaterial({
    color: 0xF4E9DC,
    side: THREE.DoubleSide
  });
  var middleLotusMaterial = new THREE.MeshLambertMaterial({
    color: 0xF2D863,
    side: THREE.DoubleSide
  });
  var innerLotusMaterial = new THREE.MeshLambertMaterial({
    color: 0xF88832,
    side: THREE.DoubleSide
  });

  var numComponents = 4;
  var loadedCounter = 0;
  var group = new THREE.Object3D();

  var addObjects = function() {

    Math.seedrandom('solskogen');
    for (var i = 0; i < that.numWaterPlants; i++) {
      var waterPlant = group.clone();
      var randomAngle = Math.random() * 2 * Math.PI;
      var randomRadius = 910 * Math.sqrt(Math.sqrt(Math.random()));
      var randomScale = 30 + 40 * Math.random();
      waterPlant.position.x = that.WATER_CENTER_X + randomRadius * Math.cos(randomAngle);
      waterPlant.position.y = that.config.waterPlants.startY;
      waterPlant.position.z = that.WATER_CENTER_Z + randomRadius * Math.sin(randomAngle);
      waterPlant.rotation.y = Math.sin(randomRadius);
      waterPlant.userData.initPos = {
        x: waterPlant.position.x,
        y: waterPlant.position.y,
        z: waterPlant.position.z
      };
      waterPlant.userData.initRot = {x: 0, y: waterPlant.rotation.y, z: 0};
      waterPlant.userData.targetScale = randomScale;
      that.scene.add(waterPlant);
      that.waterPlants.push(waterPlant);
    }
  };

  var loadObject = function (objPath, material) {
    var objLoader = new THREE.OBJLoader();
    Loader.loadAjax(objPath, function(text) {
      var object = objLoader.parse(text);
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      group.add(object);
      loadedCounter++;
      if (loadedCounter >= numComponents) {
        addObjects();
      }
    });
  };

  var prefix = 'res/objects/';
  loadObject(prefix + 'duckweed.obj', duckweedMaterial);
  loadObject(prefix + 'lotus_outer.obj', outerLotusMaterial);
  loadObject(prefix + 'lotus_middle.obj', middleLotusMaterial);
  loadObject(prefix + 'lotus_inner.obj', innerLotusMaterial);
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

  if (frame < 4600) {
    this.scene.remove(this.volcano);
    this.waterPond.position.y = 0;
  } else {
    this.waterPond.position.y = -10000;
    this.scene.add(this.volcano);
    this.volcano.update( frame - 4800 );
    this.volcano.position.y = clamp(-10, -10 + (frame - 4600) / 27, 20);
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

  this.updateDandelionSeeds(frame, relativeFrame);

  this.updateShadowLight();

  this.updateTree(frame, relativeFrame);

  this.updateLeaves(frame, relativeFrame);

  this.updateSmoke(frame, relativeFrame);

  this.updateGrass(frame, relativeFrame);

  this.updateWaterPlants(frame, relativeFrame);

  this.updateDoomHexagons(relativeFrame);

  for(var i = 0; i < this.doomSkyBox.material.materials.length; i++) {
    var material = this.doomSkyBox.material.materials[i];
    material.opacity = smoothstep(0, 1, (frame - 4400) / (4440 - 4400));
  }

  if(frame > 4250 && frame < 5500) {
    this.addSmokeColumn( 
        4500,
        -450,
        -1413,
        frame,
        256,
        400,
        4
    );
  }

  var t = clamp(0, relativeFrame - this.rocketStart, 999999);
  this.rocketHex.position.y = this.rocketStartPosition + t * 100;
};

DesertLayer.prototype.updateDoomHexagons = function(relativeFrame) {

  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[0], 0, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[5], 5, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[1], 1, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[6], 6, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[2], 2, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[7], 7, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[3], 3, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[8], 8, {direction: 'fall'});

  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[11], 11, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[21], 21, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[31], 31, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[40], 40, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[50], 50, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[60], 60, {direction: 'fall'});

  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[17], 17, {direction: 'up', speed: 30, maxHeight: 4000});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[51], 51, {direction: 'up', speed: 15, maxHeight: 8000});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[41], 41, {direction: 'up', speed: 20, maxHeight: 3000});

  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[25], 25, {direction: 'up', speed: 20, maxHeight: 3000});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[34], 34, {direction: 'up', speed: 20, maxHeight: 3500});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[44], 44, {direction: 'up', speed: 20, maxHeight: 4000});

  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[18], 18, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[23], 23, {direction: 'fall'});
  this.updateDoomHexagon(relativeFrame, this.hexagonFallingTimings[27], 27, {direction: 'fall'});
};

DesertLayer.prototype.updateDandelionSeeds = function(frame, relativeFrame) {
  for (var i = 0; i < this.dandelionSeed.wingCylinders.length; i++) {
    var wingCylinder = this.dandelionSeed.wingCylinders[i];
    wingCylinder.rotation.z = wingCylinder.initialRotation.z + Math.PI / 8 * Math.sin(wingCylinder.rotation.z) * (0.5 + 0.02 * i) * 0.8 * Math.sin(relativeFrame * 0.036);
    wingCylinder.rotation.y = wingCylinder.initialRotation.y + Math.sin(i) * 0.3 * Math.sin(relativeFrame * 0.022);
  }

  var options = this.config.dandelion;
  var groundLevel = this.config.waterAmplitude * 2 + 100;
  var actualGroundHitTime = 954;
  this.dandelionSeed.position.y = options.start.y + options.speed * relativeFrame;
  if (this.dandelionSeed.position.y > groundLevel) {
    var t = relativeFrame / 60 * options.rotationSpeed;
    this.dandelionSeed.position.x = options.start.x + Math.sin(t) * options.rotationRadius;
    this.dandelionSeed.position.z = options.start.z + Math.cos(t) * options.rotationRadius;

    this.dandelionSeed.rotation.x = 0.25 * Math.sin(relativeFrame * 0.0321 + 5);
    this.dandelionSeed.rotation.y = 0.018 * relativeFrame + 0.15 * Math.sin(relativeFrame * 0.035);
    this.dandelionSeed.rotation.z = 0.28 * Math.cos(relativeFrame * 0.03);
  } else if (relativeFrame >= actualGroundHitTime) {
    this.dandelionSeed.position.y = groundLevel + options.speed * (actualGroundHitTime - 944) - (relativeFrame - actualGroundHitTime);
  }

  if (relativeFrame < 1500) {
    for (var i = 0; i < this.fakeDandelionSeeds.length; i++) {
      var fakeDandelionSeed = this.fakeDandelionSeeds[i];
      fakeDandelionSeed.position.x = fakeDandelionSeed.userData.initPos.x + 600 * Math.sin(relativeFrame * 0.006 + 7 * i)
      fakeDandelionSeed.position.y = fakeDandelionSeed.userData.initPos.y + options.speed * relativeFrame;
      fakeDandelionSeed.position.z = fakeDandelionSeed.userData.initPos.z + 600 * Math.cos(relativeFrame * 0.007 + 3 * i)
    }
  } else {
    if (this.fakeDandelionSeeds.length) {
      for (var i = 0; i < this.fakeDandelionSeeds.length; i++) {
        var fakeDandelionSeed = this.fakeDandelionSeeds[i];
        this.scene.remove(this.fakeDandelionSeeds[i]);
      }
      this.fakeDandelionSeeds.length = 0;
    }
  }
}

DesertLayer.prototype.updateTree = function(frame, relativeFrame) {
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

DesertLayer.prototype.updateLeaves = function(frame, relativeFrame) {
  for (var i = 0; i < this.leaves.length; i++) {
    var leaf = this.leaves[i];
    leaf.update(frame - 3000);
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

DesertLayer.prototype.updateWaterPlants = function(frame, relativeFrame) {
  if (relativeFrame > 3040) {
    for (var i = 0; i < this.waterPlants.length; i++) {
      this.scene.remove(this.waterPlants[i]);
    }
    this.waterPlants.length = 0;
    return false;
  }

  //grow
  if (relativeFrame >= this.config.waterPlants.startGrowthFrame
    && relativeFrame < (this.config.waterPlants.endGrowthFrame + this.grass.maxFramesOffset)) {
    for (var i = 0; i < this.waterPlants.length; i++) {
      var waterPlant = this.waterPlants[i];
      var offset = 0.01 * this.config.waterPlants.growthDuration * i;
      var t = (relativeFrame - this.config.waterPlants.startGrowthFrame - offset) / this.config.waterPlants.growthDuration;
      waterPlant.position.y = smoothstep(this.config.waterPlants.startY, this.config.waterPlants.targetY, t);
      var scale = smoothstep(0.01, waterPlant.userData.targetScale, t - 0.25);
      waterPlant.scale.set(scale, scale, scale);
    }
  }

  //windy
  if (relativeFrame >= this.config.waterPlants.startGrowthFrame
    && relativeFrame < this.config.waterPlants.windyUntilFrame) {
    for (var i = 0; i < this.waterPlants.length; i++) {
      var waterPlant = this.waterPlants[i];
      waterPlant.rotation.y = waterPlant.userData.initRot.y
        + 0.12 * Math.sin(5 + relativeFrame * 0.035 + 1.8 * i / this.waterPlants.length);
      waterPlant.position.x = waterPlant.userData.initPos.x
        + 10 * Math.sin(10 + relativeFrame * 0.03 + 1.8 * i / this.waterPlants.length);
      waterPlant.position.z = waterPlant.userData.initPos.z
        + 15 * Math.cos(10 + relativeFrame * 0.038 + 1.8 * i / this.waterPlants.length);
    }
  }
};

DesertLayer.prototype.updateDoomHexagon = function (relativeFrame, startFrame, hexagonIndex, options) {
  var hex = this.desertHexes[hexagonIndex];
  var t = clamp(0, relativeFrame - startFrame, 999999);
  if (options.direction === 'up') {
    hex.position.y = this.desertHexStart + options.speed * t < this.desertHexStart + options.maxHeight ? 
                                                               this.desertHexStart + options.speed * t :  
                                                               this.desertHexStart + options.maxHeight;
  } else if (options.direction === 'fall') {
    var acceleration = -5;
    hex.position.y = this. desertHexStart + 0.5 * acceleration * t * t;

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
  hex.rotation.x = -Math.PI / 2;
  hex.userData.baseColor = hex.material.color;
  return hex;
}

function DesertHexagon(radius, x, y, z, color) {
  var hexGeometry = new THREE.CylinderGeometry(radius, radius, 10000, 6);
  var hex = new THREE.Mesh(
    hexGeometry, new THREE.MeshLambertMaterial({
      color: color,
      shading: THREE.FlatShading
  }));
  hex.receiveShadow = true;
  hex.position = new THREE.Vector3(x, y, z);
  hex.rotation.y = Math.PI / 6;
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
 * @returns {THREE.Object3D}
 * @constructor
 */
function DandelionSeed(layer, castShadow, numColumns) {
  var seedSphereGeometry, bodyCylinderGeometry, wingCylinderGeometry, //geometries
    dandelionSeed, seedSphere, topSphere, bodyCylinder, // meshes
    WING_LENGTH = 125; //constants

  seedSphereGeometry = new THREE.SphereGeometry(12, 12, 20);
  bodyCylinderGeometry = new THREE.CylinderGeometry(2, 2, 240, 8);
  wingCylinderGeometry = new THREE.CylinderGeometry(0.7, 1.2, WING_LENGTH, 8);
  wingCylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, WING_LENGTH / 2, 0));

  dandelionSeed = new THREE.Object3D();

  seedSphere = new THREE.Mesh(seedSphereGeometry, layer.dandelionSeedMaterials.seed);
  seedSphere.scale.y = 2.9;
  seedSphere.position.y = -240;
  seedSphere.castShadow = castShadow;

  bodyCylinder = new THREE.Mesh(bodyCylinderGeometry, layer.dandelionSeedMaterials.body);
  bodyCylinder.position.y = -120;
  bodyCylinder.castShadow = castShadow;

  dandelionSeed.wingCylinders = [];

  Math.seedrandom("iverjo-is-sexy");
  for (var i = 0; i < numColumns; i++) {
    var wingCylinder = new THREE.Mesh(wingCylinderGeometry, layer.dandelionSeedMaterials.wing);
    wingCylinder.castShadow = castShadow;

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

  var scale = 0.2;
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
