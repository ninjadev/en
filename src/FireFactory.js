/*
 * ####                 ####
 * #### FireFactory     ####
 * ####      Usage      ####
 *
 * ## In constructor of layer ###
 *
 * ## In update function ##
 */
function FireFactory( scene ) {
  var firetexture = Loader.loadTexture('res/textures/fireparticle.png');
  return {
    create: function create(pos, girth, height, number){
      var particles = new THREE.Geometry();
      for(var i = 0; i < number; i++){
        var particle = new THREE.Vector3((Math.random() - 0.5 ) * girth, 
                                        0,
                                        (Math.random() - 0.5 ) * girth)
        particle.initPos = new THREE.Vector3(particle);
        particle.endPos = Math.random() * height;
        particle.speed = Math.random()*15;
        particles.vertices.push(particle);
      }
      var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0x502305, size: 500, map: firetexture, 
        alphaTest:0.5, blending: THREE.AdditiveBlending, transparent: true });
      var fire = new THREE.ParticleSystem(particles, particleMaterial);
      fire.sortParticles = true;

      fire.position = pos;
      fire.lastPos  = pos.clone();

      fire.update = function(relativeFrame){
        
        var dp = this.position.clone();
        dp.sub(this.lastPos);
        this.lastPos = this.position;

        dp.multiplyScalar(-1);
        if(dp.lengthSq() < 0.1){
          dp.y = 1;
        }

        var particles = this.geometry.vertices;
        for(var i = 0; i < particles.length; i++){
          var particle = particles[i];
          particle.y += particle.speed*dp.y;

          particle.y = particle.y % particle.endPos;
        }

        //this.lookAt(new THREE.Vector3().addVectors(this.position, dp));
      }
      fire.resetParticles = function(){
        var particles = this.geometry.vertices;
        for(var i = 0; i < particles.length; i++){
          particle.y = 0;
        }
      }
      return fire;
    }
  }
};

