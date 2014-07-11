/*
 * @constructor
 */
function RgbShiftLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.rgbShift);
  this.shaderPass.uniforms.period.value = new THREE.Vector3();
}

RgbShiftLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = Math.tan(relativeFrame / 100) / 5000;
  this.shaderPass.uniforms.period.value.set(200, 190, 170);
};

RgbShiftLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
