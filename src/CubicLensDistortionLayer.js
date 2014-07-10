/*
 * @constructor
 */
function CubicLensDistortionLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.cubicLensDistortion);
}

CubicLensDistortionLayer.prototype.update = function() {
};

CubicLensDistortionLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
