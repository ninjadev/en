/*
 * @constructor
 */
function WallLayer(layer) {
  Math.seedrandom("cristea");
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.cameraZ = 8000;
  this.cameraY = -750;
  this.camera.position.z = this.cameraZ;
  this.camera.position.y = this.cameraY;
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.fontLoaded = false;

  this.hexes = [];
  this.hexesStartPosition = [];
  this.hexesPosition = [];
  this.textures = [];
  this.pictures = [
    { name: "ninjadev", picOptions: { picX: 170, picY: 600 } },
    { name: "solskogen", picOptions: { picX: 120, picY: 580 } },
    { name: "presents", picOptions: { picX: 170, picY: 570 } },
    { name: "a-demo-called", picOptions: { picX: 140, picY: 535 } },
    { name: "inakuwa", picOptions: { picX: 125, picY: 560 } },
    { name: "no-picture", picOptions: { picX: 0, picY: 0 } }
  ];

  var backgroundTexture = Loader.loadTexture('res/wallpaper.png');
  backgroundTexture.wrapS = backgroundTexture.wrapT = THREE.RepeatWrapping;
  backgroundTexture.repeat.set(100,100);
  var backgroundGeometry = new THREE.PlaneGeometry(100000, 100000);
  this.background = new THREE.Mesh(
    backgroundGeometry,
    new THREE.MeshBasicMaterial({
      map: backgroundTexture
    }));

  var hexLength = this.layer.config.hexColor.length;
  for(var i = 0; i < hexLength; i++) {
    var factor = i % 2;
    var rand = this.randomNum(5);
    if(i == 0 || i == 1) {
      var sizeRandomness = 0.35 - 0.15*i;
    } else {
      var sizeRandomness = 0.1*rand*factor*(factor>1? -1 : 1);
    }
    if(i == hexLength-1) {
      var pos = { x:2500*(i+1), y: -260, z: 500*factor*(i%2==0?-2:1) };
    } else {
      var pos = { x:2500*i, y: 1600*factor*(i%2==0?2:-1), z: 500*factor*(i%2==0?-2:1) };
    }
    var startPos = { x: pos.x*2, y: pos.y, z: pos.z};
    this.hexesPosition.push(pos);
    this.hexesStartPosition.push(startPos);
    this.hexes.push(this.createHexagon({
      index:i,
      radius: 1000 + 1000*sizeRandomness,
      position: {x:0, y:0, z:0 },
      color: this.layer.config.hexColor[i].inner,
      pic: this.pictures[i].name,
      picOptions: this.pictures[i].picOptions
    }));
  }

  this.scene.add(this.background); 
  this.scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(50, 50, 50);
  this.scene.add(light);
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 100;
  pointLight.position.y = 500;
  pointLight.position.z = 1300;
  this.scene.add(pointLight);
}

WallLayer.prototype.createHexagon = function(options) {
  var index = options.index || 0;
  var pos = options.position || { x:0, y:0, z:0 };

  var hexGeometry = new THREE.TorusGeometry(options.radius || 1000, 50, 4, 6);
  var material = new THREE.MeshBasicMaterial({
    color: +this.layer.config.hexColor[index].outer || 0x00ff00,
    shading: THREE.FlatShading
  });

  var hex = new THREE.Mesh(hexGeometry, material);
  hex.position = pos;

  var innerHexGeometry = new THREE.CircleGeometry(options.radius || 1000,  6);
  var isText = options.pic !== undefined;

  if(isText) {
    if(options.pic == "honey" || options.pic == "tunl") {
      var texture = Loader.loadTexture('res/pic/' + options.pic + '.png');
    } else {
      var texture = new THREE.Texture(
          this.generateTextSprite(options.pic, options.color, options.picOptions)
        );
    }
    this.textures.push(texture);
    var innerMaterial = new THREE.MeshBasicMaterial({
      map: texture
    });
    texture.needsUpdate = true;
  } else {
    var innerMaterial = new THREE.MeshLambertMaterial({
      color: +this.layer.config.hexColor[index].inner || 0xff0000,
      shading: THREE.FlatShading
    });
  }

  var innerHex = new THREE.Mesh(innerHexGeometry, innerMaterial);
  innerHex.position = pos;

  hex.scale.set(0.001, 0.001, 0.001);
  innerHex.scale.set(0.001, 0.001, 0.001);

  this.scene.add(hex);
  this.scene.add(innerHex);

  return { outer: hex, inner: innerHex };
}

WallLayer.prototype.randomNum = function(threshold) {
  return Math.floor((Math.random() * threshold) + 1);
}

WallLayer.prototype.generateTextSprite = function(pic, bgColor, picOptions) {
  var canvas = document.createElement('canvas');
  var size = picOptions.size || 2048;
  var picX = picOptions.picX || 819;
  var picY = picOptions.picY || 819;
  canvas.width = size;
  canvas.height = size;

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  if(pic !== "no-picture") {
    var that = this;
    var imgTexture = Loader.loadTexture('res/pic/' + pic + '.png', function() {
      ctx.drawImage(imgTexture.image, picX, picY, imgTexture.image.width*0.9, imgTexture.image.height*0.9);
      that.updateTextures();
    });
  }

  return canvas;
}

WallLayer.prototype.updateTextures = function() {
  for(var i = 0; i < this.textures.length; i++) {
    this.textures[i].needsUpdate = true;
  }
}

WallLayer.prototype.moveHexagons = function() {
  // If the circlegeometry is not rendered on camera it will sometimes fail
  // Not really sure why this happens, but this is a hackathon - DEAL WITH IT!
  for(var i = 0; i < this.hexes.length; i++) {
    this.hexes[i].inner.position = this.hexesStartPosition[i];
    this.hexes[i].outer.position = this.hexesStartPosition[i];
  }
}

WallLayer.prototype.update = function(frame, relativeFrame) {
  if(relativeFrame == 1) {
    this.moveHexagons();
  }
  if(relativeFrame < 440) {
    return;
  }

  if(relativeFrame > 650 && relativeFrame <= 1150) {
    this.camera.position.x = (relativeFrame - 650)*15;
  }

  if(relativeFrame > 440 && relativeFrame < 650) {
    this.camera.position.z = smoothstep(this.cameraZ, 3800, (relativeFrame - 440)/100);
    this.camera.position.y = smoothstep(this.cameraY, 200, (relativeFrame - 440)/100);
  }

  if(relativeFrame > 650 && relativeFrame < 850) {
    this.camera.position.z = smoothstep(3800, this.cameraZ, (relativeFrame - 650)/100);
    this.camera.position.y = smoothstep(200, this.cameraY, (relativeFrame - 650)/100);
  }

  if(relativeFrame > 1000 && relativeFrame < 1300) {
    this.camera.position.z = smoothstep(this.cameraZ, 1800, (relativeFrame - 1000)/100);
    this.camera.position.y = smoothstep(this.cameraY, 1, (relativeFrame - 1000)/100);
    this.camera.position.x = smoothstep(5250, 10000, (relativeFrame - 1000)/100);
  }

  if(relativeFrame > 1300) {
    this.camera.position.z = smoothstep(1800, 1500, (relativeFrame - 1300)/100);
    this.camera.position.y = smoothstep(1, -260, (relativeFrame - 1300)/100);
    this.camera.position.x = smoothstep(10000, 15000, (relativeFrame - 1300)/100);
  }

  for(var i = 0; i < this.hexes.length; i++) {
    var hex = this.hexes[i];
    var startPos = hex.inner.position;
    var finishPos = this.hexesPosition[i];
    var scaleNow = hex.inner.scale;
    var rot = hex.inner.rotation.z;

    if(hex.inner.x == finishPos.x && hex.inner.y == finishPos.y && hex.inner.z == finishPos.z) {
      continue;
    } else {
      if((finishPos.x - this.camera.position.x) < 3000) {
        var newPos = new THREE.Vector3(
            startPos.x + 0.1*(finishPos.x - startPos.x),
            startPos.y + 0.1*(finishPos.y - startPos.y),
            startPos.z + 0.1*(finishPos.z - startPos.z)
          );
        var newScale = new THREE.Vector3(
            scaleNow.x + 0.03*(1.0 - scaleNow.x),
            scaleNow.y + 0.03*(1.0 - scaleNow.y),
            scaleNow.z + 0.03*(1.0 - scaleNow.z)
          );

        var newRot = rot + 0.1*(Math.PI*2 - rot);
        hex.inner.position = newPos.clone();
        hex.inner.scale.set(newScale.x, newScale.y, newScale.z);
        hex.inner.rotation.z = newRot;
        hex.outer.position = newPos.clone();
        hex.outer.scale.set(newScale.x, newScale.y, newScale.z);
        hex.outer.rotation.z = newRot;
      }
    }
  }
};

WallLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
