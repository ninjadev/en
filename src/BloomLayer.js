/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.BloomPass(1.5, 25, 16, 512);
}

BloomLayer.prototype.update = function(frame) {
  if(this.config.strength != null) {
    this.shaderPass.copyUniforms.opacity.value = this.config.strength;
  } else {
  this.shaderPass.copyUniforms.opacity.value = 1 + 0.5 + 0.4 * Math.sin(
      3.141592 + 2 * 3.141592 * frame / 60 * 2);
  }
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
