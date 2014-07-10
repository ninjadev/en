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
    create: function create( position, baseRadius, nlavaBalls, skittles ) {
      var lavaBallMaterial = new THREE.ShaderMaterial( SHADERS.volcano );
      var volcano = new THREE.Object3D();
      volcano.position = position.clone();

      var lavaBallFactory = new LavaBallFactory( volcano, lavaBallMaterial, skittles );

      var lavaBalls = [];
      for (var i = 0; i < nlavaBalls; i++) {
        var lavaBall = lavaBallFactory.create( 8, 10 );
        lavaBalls.push( lavaBall );
      }

      var lavaFloor = lavaBallFactory.create( baseRadius, 20 );
      lavaFloor.scale.y = 0.1;

      volcano.add( lavaFloor );
      scene.add( volcano );

      volcano.update = function update( relativeFrame ) {
        lavaBallMaterial.uniforms[ 'time' ].value = relativeFrame / 200;

        for ( var i = 0; i < lavaBalls.length; i++ ) {
          lavaBalls[ i ].update( relativeFrame );
        };
      }

      return volcano;
    }
  }
};

function LavaBallFactory( scene, material, skittles ) {
 return {
    create: function create( scale, detail ) {
      var mappedSize = clamp(5, scale / Math.random(), 50);
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
          -6 + 12 * Math.random(),
          25 + 15 * Math.random(),
          -6 + 12 * Math.random() );
      };

      lavaBall.generateDirection();

      lavaBall.update = function update( relativeFrame ) {
        var internalFrame = relativeFrame % this.period;

        if ( internalFrame < this.internalOffset ) {
          this.inScene == false;
          return;
        } else if ( this.inScene == null ) {
          scene.add( this );
          this.inScene == true;
        }

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
