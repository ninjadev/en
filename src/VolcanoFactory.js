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
function VolcanoFactory( scene, fireFactory) {
  SHADERS.volcano.uniforms.tExplosion.value =
      Loader.loadTexture( 'res/explosion.png' );

  return {
    create: function create( position, baseScale, maxLavaBallSize, nlavaBalls, skittles ) {
      var lavaBallMaterial = new THREE.ShaderMaterial( SHADERS.volcano );
      var volcano = new THREE.Object3D();
      volcano.position = position.clone();

      var lavaBallFactory = new LavaBallFactory( volcano, lavaBallMaterial, skittles, fireFactory );

      var lavaBalls = [];
      for (var i = 0; i < nlavaBalls; i++) {
        var lavaBall = lavaBallFactory.create( 20, maxLavaBallSize, 7 );
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
        if ( visible ) {
          scene.add( volcano );
          for ( var i = 0; i < nlavaBalls; i++ ) {
            scene.add( lavaBalls[ i ] );
            scene.add( lavaBalls[ i ].fire );
          }
        } else {
          scene.remove( volcano );
          for ( var i = 0; i < nlavaBalls; i++ ) {
            scene.remove( lavaBalls[ i ] );
            scene.remove( lavaBalls[ i ].fire );
          }
        }
      }
      
      return volcano;
    }
  }
};

function LavaBallFactory( scene, material, skittles, fireFactory ) {

 return {
    create: function create( scale, maxSize, detail ) {
      var mappedSize = clamp( 10, scale / Math.random(), maxSize );
      var lavaBallGeometry = new THREE.SphereGeometry( mappedSize, detail, detail );
      var lavaBall = new THREE.Mesh(
        lavaBallGeometry,
        skittles ?
          undefined
          : material );

      //lavaBall.fire = fireFactory.create(lavaBall.position.clone(),100,800,500);
      lavaBall.internalOffset = Math.random() * 100;
      lavaBall.period = 60 * 7 ;
      lavaBall.generateDirection = function generateDirection() {
        this.direction = new THREE.Vector3(
          ( -scale / 2 + scale * Math.random() ) * 2,
          10 + 8 * scale * Math.random(),
          ( -scale / 2 + scale * Math.random() ) * 2 );
      };

      lavaBall.generateDirection();
      lavaBall.acceleration = new THREE.Vector3( 0, -0.8, 0 );
      lavaBall.airTime =  - 2 * lavaBall.direction.y / lavaBall.acceleration.y;
      lavaBall.fire = fireFactory.create(lavaBall.position, mappedSize, mappedSize * 5, mappedSize/2);

      lavaBall.update = function update( relativeFrame ) {
        if ( relativeFrame < 0 ) {
          this.position = new THREE.Vector3( 0, 0, 0 );
          scene.remove( this );
          scene.remove(this.fire);
          return;
        }
        scene.add( this );
        scene.add( this.fire );
        var internalFrame = relativeFrame % this.period;

        if ( internalFrame > ( this.airTime + this.internalOffset ) ) {
          if ( this.userData.yIntercept == null ) {
            this.userData.yIntercept = this.position.y;
          }

          this.scale.y = smoothstep( 1.0, 0.4,
            ( internalFrame
              - ( this.airTime
                + this.internalOffset ) ) / ( scale * 3 ) );
          this.position.y = this.userData.yIntercept
            - 0.5 * ( internalFrame - ( this.airTime + this.internalOffset ) );
        } else {
          this.scale.y = 1.0;
          this.userData.yIntercept = null;

          this.position = this.direction.clone()
            .multiplyScalar( internalFrame - this.internalOffset )
            .add(
              this.acceleration.clone()
              .multiplyScalar( 1 / 2 )
              .multiplyScalar( Math.pow(internalFrame - this.internalOffset, 2 ) )
            )
            .add( new THREE.Vector3( 0, -10, 0 ) );
        }

        this.fire.position = this.position;
        this.fire.update(internalFrame);
      };

      return lavaBall;
    }
  };
}
