/**
 * @constructor
 */
function EndingLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.ending);
}

EndingLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

EndingLayer.prototype.start = function() {
};

EndingLayer.prototype.end = function() {
};

EndingLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.timer.value = smoothstep(0.0, 2.0, relativeFrame/100);
};
