/*
 * @constructor
 */
function MultiplyLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.tDiffuse
}

MultiplyLayer.prototype.update = function(frame, relativeFrame) {
  if (relativeFrame > 327) {
    var t = 1 - (relativeFrame - 327) / 50;
  } else {
    var t = (relativeFrame - 230) / 60;
  }
  this.shaderPass.uniforms.amount.value = smoothstep(0, -50, t);
};

MultiplyLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
