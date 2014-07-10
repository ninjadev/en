
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
    this.shaderPass.uniforms.amount.value = lerp(0, 1.0, Math.min(relativeFrame / 100, 1));
    //this.shaderPass.uniforms.sunX.value = lerp(1.0,0.3, relativeFrame/(endRelativeFrame-relativeFrame));
    this.shaderPass.uniforms.sunX.value = 1.4 - relativeFrame/(this.config.endFrame-this.config.startFrame);
    this.shaderPass.uniforms.sunX.value = 0.4 + 1.5*Math.pow(endRelativeFrame/(this.config.endFrame-this.config.startFrame), 2.6);
    this.shaderPass.uniforms.sunY.value = 0.95;
};
