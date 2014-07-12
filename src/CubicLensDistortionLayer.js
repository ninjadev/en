/*
 * @constructor
 */
function CubicLensDistortionLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.cubicLensDistortion);
}

CubicLensDistortionLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = smoothstep(
      0, 1, relativeFrame / 100);
};

CubicLensDistortionLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
