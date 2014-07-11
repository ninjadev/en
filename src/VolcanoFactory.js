/*
 * ####                 ####
 * #### LavaBallFactory ####
 * ####      Usage      ####
 *
 * ## In constructor of layer ###
 * var volcanoFactory = new VolcanoFactory( this.scene );
 * var volcano = volcanoFactory.create(
 *  new THREE.Vector3(0, 0, 0),
 *  100, 20, false );
 *
 * ## In update function ##
 * volcano.update( relativeFrame );
 *
 */
function VolcanoFactory( scene ) {
  SHADERS.volcano.uniforms.tExplosion.value =
      Loader.loadTexture( 'res/explosion.png' );

  return {
    create: function create( position, baseScale, maxLavaBallSize, nlavaBalls, skittles ) {
      var lavaBallMaterial = new THREE.ShaderMaterial( SHADERS.volcano );
      var volcano = new THREE.Object3D();
      volcano.position = position.clone();

      var lavaBallFactory = new LavaBallFactory( volcano, lavaBallMaterial, skittles );

      var lavaBalls = [];
      for (var i = 0; i < nlavaBalls; i++) {
        var lavaBall = lavaBallFactory.create( 10, maxLavaBallSize, 7 );
        lavaBalls.push( lavaBall );
      }

      var lavaFloor = lavaBallFactory.create( 100, 50, 20 );
      lavaFloor.scale.x = baseScale;
      lavaFloor.scale.z = baseScale;
      lavaFloor.scale.y = 0.2;

      volcano.add( lavaFloor );

      volcano.update = function update( relativeFrame ) {
        lavaBallMaterial.uniforms[ 'time' ].value = relativeFrame / 200;

        for ( var i = 0; i < lavaBalls.length; i++ ) {
          lavaBalls[ i ].update( relativeFrame );
        };
      };

      volcano.show = function show( visible ) {
        if (visible) {
          scene.add(volcano);
          for (var i = 0; i < nlavaBalls; i++) {
            scene.add(lavaBalls[i]);
          }
        } else {
          scene.remove(volcano);
          for (var i = 0; i < nlavaBalls; i++) {
            scene.remove(lavaBalls[i]);
          }
        }
      }

      return volcano;
    }
  }
};

function LavaBallFactory( scene, material, skittles ) {
 return {
    create: function create( scale, maxSize, detail ) {
      var mappedSize = clamp(5, scale / Math.random(), maxSize);
      var lavaBallGeometry = new THREE.SphereGeometry( mappedSize, detail, detail );
      var lavaBall = new THREE.Mesh(
        lavaBallGeometry,
        skittles ?
          undefined
          : material );

      lavaBall.internalOffset = Math.random() * 100;
      lavaBall.period = 60 * 7 ;
      lavaBall.generateDirection = function generateDirection() {
        this.direction = new THREE.Vector3(
          (-scale / 2 + scale * Math.random()) * 2,
          8 * scale * Math.random(),
          (-scale / 2 + scale * Math.random()) * 2 );
      };

      lavaBall.generateDirection();

      lavaBall.update = function update( relativeFrame ) {
        if (relativeFrame < 0) {
          this.position = new THREE.Vector3(0, 0, 0);
          scene.remove(this);
          return;
        }
        scene.add(this);

        var internalFrame = relativeFrame % this.period;

        this.position = this.direction.clone()
          .multiplyScalar( internalFrame - this.internalOffset )
          .add(
            new THREE.Vector3( 0, -0.8, 0 )
            .multiplyScalar( 1 / 2 )
            .multiplyScalar( Math.pow(internalFrame - this.internalOffset, 2 ) )
          )
          .add( new THREE.Vector3( 0, -10, 0 ) );
      };

      return lavaBall;
    }
  };
}
