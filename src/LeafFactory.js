/*
 * ####                 ####
 * ####   LeafFactory   ####
 * ####      Usage      ####
 *
 * ## In constructor of layer ###
 * var leafFactory = new LeafFactory();
 * var leafSingle = leafFactory.createSingle(128);
 *
 * ## In update function ##
 * leafSingle.update( relativeFrame );
 *
 * ## To toggle leaf yellow on / off
 * leafSingle.yellowOrGreen(true);
 *
 */
function LeafFactory() {
  var leaves_green_1 = Loader.loadTexture("res/textures/leaves_green_1.png");
  var leaves_green_2 = Loader.loadTexture("res/textures/leaves_green_2.png");
  var leaves_yellow_1 = Loader.loadTexture("res/textures/leaves_yellow_1.png");
  var leaves_yellow_2 = Loader.loadTexture("res/textures/leaves_yellow_2.png");

  return {
    createSingle: function createSingle(width) {
      var materialGreen = new THREE.MeshBasicMaterial({
        map: Math.random > 0.5 ? leaves_green_1 : leaves_green_2,
        alphaTest: 0.5,
        // https://stackoverflow.com/questions/11827968/three-js-transparent-maps-issue
        side: THREE.DoubleSide,
        color: 0x888888
      });

      var materialYellow = new THREE.MeshBasicMaterial({
        map: Math.random > 0.5 ? leaves_yellow_1 : leaves_yellow_2,
        alphaTest: 0.5,
        side: THREE.DoubleSide,
        color: 0x888888
      });

      var leaf = new THREE.Mesh(
        new THREE.PlaneGeometry(width, width),
        materialGreen);

      var leafContainer = new THREE.Object3D();
      leaf.position.x = - width / 2;
      leafContainer.add(leaf);

      leafContainer.update = function update(activationFrame) {
        leafContainer.scale.x = smoothstep(0.01, 1,
          (activationFrame - 100) / 20 );
        leafContainer.scale.y = smoothstep(0.01, 1,
          (activationFrame - 110) / 30 );
      };

      leafContainer.yellowOrGreen = function yellowOrGreen(yellow) {
        leaf.material = yellow ? materialYellow : materialGreen;
      };

      leafContainer.rotation.x = Math.random() * Math.PI;
      leafContainer.rotation.z = Math.random() * Math.PI / 3;

      return leafContainer;
    },
    createDouble: function createDouble(width) {
      var leafLeft = this.createSingle(width);
      leafLeft.rotation.x = Math.PI;
      leafLeft.rotation.y = Math.PI;

      var leafRight = this.createSingle(width);
      var leafDoubleContainer = new THREE.Object3D();
      leafDoubleContainer.add(leafLeft);
      leafDoubleContainer.add(leafRight);

      leafDoubleContainer.update = function update(activationFrame) {
        leafLeft.update(activationFrame);
        leafRight.update(activationFrame);
      }

      leafDoubleContainer.yellowOrGreen = function yellowOrGreen(yellow) {
        leafLeft.yellowOrGreen(yellow);
        leafRight.yellowOrGreen(yellow);
      };

      return leafDoubleContainer;
    }
  }
}
