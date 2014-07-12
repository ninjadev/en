/*
 * @constructor
 */
function VignetteLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.vignette);
}

VignetteLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = smoothstep(
      0, 1, relativeFrame / 100);
};

VignetteLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
