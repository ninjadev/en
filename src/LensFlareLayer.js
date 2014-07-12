
/**
 * @constructor
 */
function LensFlareLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.lensflare);
}

LensFlareLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

LensFlareLayer.prototype.start = function() {
};

LensFlareLayer.prototype.end = function() {
};

LensFlareLayer.prototype.update = function(frame) {
    var relativeFrame = frame - this.config.startFrame;
    var endRelativeFrame = this.config.endFrame - frame; 
    this.shaderPass.uniforms.width.value = 16 * 8;
    this.shaderPass.uniforms.height.value = 9 * 8;
    this.shaderPass.uniforms.time.value = frame;
    this.shaderPass.uniforms.amount.value = lerp(0, 1.3, Math.min(Math.min(relativeFrame,endRelativeFrame) / 70, 1));
    //this.shaderPass.uniforms.sunX.value = lerp(1.0,0.3, relativeFrame/(endRelativeFrame-relativeFrame));
    if(frame<1820) {
      this.shaderPass.uniforms.sunX.value = 
          -0.2 - (1820- frame)/500;
          //0.9 - 1.5*Math.pow(endRelativeFrame/(this.config.endFrame-this.config.startFrame), 2.6);
      this.shaderPass.uniforms.sunY.value = 
          0.75 + (1820 - frame)/200;
    } else if (frame<1906) {
      this.shaderPass.uniforms.sunX.value = -0.2;
      this.shaderPass.uniforms.sunY.value = 0.75;
    } else {
      this.shaderPass.uniforms.sunX.value = -0.2  + Math.pow((frame - 1906),2.5)/Math.pow(180,2.5)*0.6;
      this.shaderPass.uniforms.sunY.value = 0.75 + Math.pow((frame - 1906),1.5)/Math.pow(180,1.5)*0.4;
    }
};
