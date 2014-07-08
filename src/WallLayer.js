/*
 * @constructor
 */
function WallLayer(layer) {
  Math.seedrandom("cristea-is-sexy");
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.hexes = [];

  var backgroundGeometry = new THREE.PlaneGeometry(10000, 10000);
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
    var pos = { x:250*i, y: 160*factor*(i%2==0?2:-1), z: 50*factor*(i%2==0?-2:1) };
    this.hexes.push(this.createHexagon({
      index:i,
      radius: 100 + 100*sizeRandomness,
      radusBottom: 40 + 40*sizeRandomness,
      position: pos
    }));
  }

  this.hexes.push(this.createHexagon({
    index: hexLength-1,
    radius: 150,
    radiusBottom: 80,
    position: { x: 250*(hexLength + 2), y:0, z:0 },
    text: "Hello"
  }));

  this.scene.add(this.background); 
  this.scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set(50, 50, 50);
  this.scene.add(light);
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);
}

WallLayer.prototype.createHexagon = function(options) {
  var index = options.index || 0;
  var pos = options.position || { x:0, y:0, z:0 };

  var hexGeometry = new THREE.TorusGeometry(options.radius || 100, 10, 4, 6);
  var material = new THREE.MeshLambertMaterial({
    color: +this.layer.config.hexColor[index].outer || 0x00ff00,
    shading: THREE.FlatShading
  });

  var hex = new THREE.Mesh(hexGeometry, material);
  hex.position = pos;

  var isText = options.text !== undefined;
  if(isText) {
    var innerHexGeometry = new THREE.CircleGeometry(options.radius || 100,  6);
    var texture = new THREE.Texture(this.generateTextSprite(options.text, '#ffffff', '#456787', 256));
    var innerMaterial = new THREE.MeshLambertMaterial({
      map: texture
    });
    texture.needsUpdate = true;
  } else {
    var innerHexGeometry = new THREE.CylinderGeometry(options.radius || 100, options.radiusBottom || 40, 1, 6, 1);
    var innerMaterial = new THREE.MeshLambertMaterial({
      color: +this.layer.config.hexColor[index].inner || 0xff0000,
      shading: THREE.FlatShading
    });
  }

  var innerHex = new THREE.Mesh(innerHexGeometry, innerMaterial);
  innerHex.position = pos;

  if(!isText) {
    innerHex.rotation.x = 0.5 * Math.PI;
    innerHex.rotation.y = 1 / 6 * Math.PI;
  }

  this.scene.add(hex);
  this.scene.add(innerHex);

  return { outer: hex, inner: innerHex };
}

WallLayer.prototype.randomNum = function(threshhold) {
  return Math.floor((Math.random() * threshhold) + 1);
}

WallLayer.prototype.generateTextSprite = function(text, textColor, bgColor, size) {
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = textColor;
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  if(typeof(text) !== 'string') text += "";
  ctx.fillText(text, size/2, size/2);

  return canvas;
}

WallLayer.prototype.update = function(frame, currentFrame) {
  this.camera.position.z = 600;
  this.camera.position.y = -75;
  this.camera.position.x = currentFrame;
};

WallLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
