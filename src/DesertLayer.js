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

  for (var i=0; i < 40; i++) {
    for (var j=0; j < 12; j++) {
      var offset = i%2 ? 150 : 0;
      var x = offset + j * 300 - 1500;
      var z = i * 85 - 1500;

      if (new THREE.Vector2(x, z).length() < 1500) {
        var hex = Hexagon(100, x, z);
        this.waterHexes.push(hex);
        this.scene.add(hex);
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
  this.waterBG.rotation.z = Math.PI/2;
  this.scene.add(this.waterBG);

  var waterBorderGeo = new THREE.RingGeometry(1390, 1500, 6, 6);
  var waterBorderMat = new THREE.MeshBasicMaterial({
    color: 0xafd7f7
  });
  this.waterBorder = new THREE.Mesh(waterBorderGeo, waterBorderMat);
  this.waterBorder.position.y = this.config.waterAmplitude*2+2;
  this.waterBorder.rotation.x = -Math.PI/2;
  this.waterBorder.rotation.z = Math.PI/2;
  this.scene.add(this.waterBorder);

  var rectMesh = DesertGround();
  rectMesh.position.y = this.config.waterAmplitude*2+1;
  rectMesh.rotation.x = -Math.PI/2;

  var rect1 = rectMesh.clone();
  rect1.position.x = 1212.4;
  rect1.position.z = -700;
  rect1.rotation.z = Math.PI/3;
  this.scene.add(rect1);

  var rect2 = rectMesh.clone();
  rect2.position.x = 1212.4;
  rect2.position.z = 700;
  this.scene.add(rect2);

  var rect3 = rectMesh.clone();
  rect3.position.x = 0;
  rect3.position.z = 1400;
  rect3.rotation.z = -Math.PI/3;
  this.scene.add(rect3);

  var rect4 = rectMesh.clone();
  rect4.position.x = 0;
  rect4.position.z = -1400;
  rect4.rotation.z = 2*Math.PI/3;
  this.scene.add(rect4);

  var rect5 = rectMesh.clone();
  rect5.position.x = -1212.4;
  rect5.position.z = -700;
  rect5.rotation.z = Math.PI;
  this.scene.add(rect5);

  var rect6 = rectMesh.clone();
  rect6.position.x = -1212.4;
  rect6.position.z = 700;
  rect6.rotation.z = -Math.PI+Math.PI/3;
  this.scene.add(rect6);

  this.initSkybox();

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

DesertLayer.prototype.initSkybox = function() {
  var imagePrefix = "/res/skyboxes/dunes_";
  var directions  = ["right", "left", "top", "bottom", "front", "back"];
  var imageSuffix = ".jpg";
  var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);

  var materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
      map: Loader.loadTexture(imagePrefix + directions[i] + imageSuffix),
      side: THREE.BackSide
    }));
  }
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  skyBox.position.y = this.config.waterAmplitude*2;
  this.scene.add(skyBox);
  Loader.start(function(){}, function(){});
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

  for (var i=0; i < this.waterHexes.length; i++) {
    var hex = this.waterHexes[i];

    var dist = hex.position.length();
    hex.position.y = (Math.sin(relativeFrame/15+dist/1000) + 1) * this.config.waterAmplitude;

    var newColor = hex.userData.baseColor.clone();
    newColor.multiplyScalar(1 + hex.position.y / (this.config.waterAmplitude * 8));
    hex.material.color = newColor;
  }
};

function Hexagon(radius, x, z) {
  var hexGeometry = new THREE.CircleGeometry(radius, 6);
  var hex = new THREE.Mesh(
    hexGeometry, new THREE.MeshBasicMaterial({
      color: randomBlue(),
      shading: THREE.FlatShading
  }));
  hex.position = new THREE.Vector3(x, 0, z);
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

function DesertGround() {
  var rectLength = 7447.8;
  var rectWidth = 1400;

  var rectShape = new THREE.Shape();
  rectShape.moveTo(0,0);
  rectShape.lineTo(0, rectWidth);
  rectShape.lineTo(rectLength, 1400+4300);
  rectShape.lineTo(rectLength, -4300);
  rectShape.lineTo(0, 0);

  var rectGeom = new THREE.ShapeGeometry(rectShape);
  var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({
    color: 0xfff7c7
  }));
  return rectMesh;
}
