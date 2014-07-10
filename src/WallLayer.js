/*
 * @constructor
 */
function WallLayer(layer) {
  Math.seedrandom("cristea");
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.fontLoaded = false;

  this.hexes = [];
  this.hexesPosition = [];
  this.textures = [];

  var backgroundGeometry = new THREE.PlaneGeometry(100000, 100000);
  this.background = new THREE.Mesh(
    backgroundGeometry,
    new THREE.MeshLambertMaterial({
      color: 0xdbd5c9
    }));

  var hexLength = this.layer.config.hexColor.length;
  for(var i = 0; i < hexLength; i++) {
    var factor = i % 2;
    var rand = this.randomNum(5);
    var sizeRandomness = 0.1*rand*factor*(factor>1? -1 : 1);
    var pos = { x:2500*i, y: 1600*factor*(i%2==0?2:-1), z: 500*factor*(i%2==0?-2:1) };
    this.hexesPosition.push(pos);
    this.hexes.push(this.createHexagon({
      index:i,
      radius: 1000 + 1000*sizeRandomness,
      position: {x:0, y:0, z:0 }
    }));
  }

  this.hexes.push(this.createHexagon({
    index: hexLength-1,
    radius: 1500,
    position: {x:0, y:0, z:0},
    color: '#473517',
    text: "ninjadev",
    textOptions: {
      textX: 500,
      textY: 240
    }
  }));
  this.hexesPosition.push({ x:2500*(hexLength+0), y:-1300, z:100 });

  this.hexes.push(this.createHexagon({
    index: hexLength-1,
    radius: 1500,
    color: '#472823',
    position: {x:0, y:0, z:0},
    text: "solskogen",
    textOptions: {
      textX: 500,
      textY: 740
    }
  }));
  this.hexesPosition.push({ x:2500*(hexLength+1), y:1500, z:100 });

  this.hexes.push(this.createHexagon({
    index: hexLength-1,
    radius: 1500,
    position: {x:0, y:0, z:0},
    color: '#472D01',
    text: "inakuwa",
    textOptions: {
      textX: 300,
      textY: 840
    }
  }));
  this.hexesPosition.push({ x:2500*(hexLength+2), y:-300, z:100 });

  this.hexes[2] = this.hexes.splice(this.hexes.length-2, 1, this.hexes[2])[0];
  this.hexes[5] = this.hexes.splice(this.hexes.length-3, 1, this.hexes[5])[0];

  this.scene.add(this.background); 
  this.scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(500, 500, 500);
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
  var isText = options.text !== undefined;

  if(isText) {
    var texture = new THREE.Texture(
        this.generateTextSprite(options.text, options.color, options.textOptions)
      );
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

  this.scene.add(hex);
  this.scene.add(innerHex);

  return { outer: hex, inner: innerHex };
}

WallLayer.prototype.randomNum = function(threshold) {
  return Math.floor((Math.random() * threshold) + 1);
}

WallLayer.prototype.generateTextSprite = function(text, bgColor, textOptions) {
  var canvas = document.createElement('canvas');
  var size = textOptions.size || 2048;
  var textX = textOptions.textX || 819;
  var textY = textOptions.textY || 819;
  canvas.width = size;
  canvas.height = size;

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  var that = this;
  var imgTexture = Loader.loadTexture('/res/text/' + text + '.png', function() {
    ctx.drawImage(imgTexture.image, textX, textY, imgTexture.image.width * 0.3, imgTexture.image.height * 0.3);

    console.log(size*0.4);
    that.updateTextures();
  });

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
    this.hexes[i].inner.position = this.hexesPosition[i];
    this.hexes[i].outer.position = this.hexesPosition[i];
  }
}

WallLayer.prototype.update = function(frame, relativeFrame) {
  if(relativeFrame == 1) {
    this.moveHexagons();
  }
  this.camera.position.z = 6000;
  this.camera.position.y = -750;
  this.camera.position.x = relativeFrame*10;
};

WallLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
