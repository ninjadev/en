/**
 * @constructor
 */
function FadeInLayer(layer) {
 this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
 this.shaderPass.uniforms.amount.value = 1.0;
}

FadeInLayer.prototype.getEffectComposerPass = function() {
    return this.shaderPass;
};

FadeInLayer.prototype.start = function() {
};

FadeInLayer.prototype.end = function() {
};

FadeInLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.amount.value = -(relativeFrame - 440)/(440 - 400);
};
