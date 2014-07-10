/*
 * @constructor
 */
function VignetteLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.vignette);
}

VignetteLayer.prototype.update = function() {

};

VignetteLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
