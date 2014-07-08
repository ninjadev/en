/*
 * @constructor
 */
function WallLayer(layer) {
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

  for(var i = 0; i < this.layer.config.hexColor.length; i++) {
    this.hexes.push(this.createHexagon({
      index:i,
      radius: 100 + 0.1*i,
      radusBottom: 40 + 0.1*i,
      position: {x: 250*i, y: 0, z: 0}
    }));
  }

  this.scene.add(this.background); 
  this.scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 50, 50, 50 );
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
  var hex = new THREE.Mesh(
    hexGeometry, new THREE.MeshLambertMaterial({
      color: +this.layer.config.hexColor[index].outer || 0x00ff00,
      shading: THREE.FlatShading
    }));
  hex.position = pos;

  var innerHexGeometry = new THREE.CylinderGeometry(options.radius || 100, options.radiusBottom || 40, 1, 6, 1);
  var innerHex = new THREE.Mesh(
    innerHexGeometry,
    new THREE.MeshLambertMaterial({
      color: +this.layer.config.hexColor[index].inner || 0xff0000,
    shading: THREE.FlatShading
    }));
  innerHex.position = pos;

  innerHex.rotation.x = 0.5 * Math.PI;
  innerHex.rotation.y = 1 / 6 * Math.PI;

  this.scene.add(hex);
  this.scene.add(innerHex);

  return { outer: hex, inner: innerHex };
}

WallLayer.prototype.update = function(frame, currentFrame) {
  this.camera.position.z = 600;
  this.camera.position.x = currentFrame;
};

WallLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
