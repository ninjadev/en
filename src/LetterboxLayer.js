/**
 * @constructor
 */
function LetterboxLayer(layer) {
 this.shaderPass = new THREE.ShaderPass(SHADERS.letterbox);
}

LetterboxLayer.prototype.getEffectComposerPass = function() {
    return this.shaderPass;
};

LetterboxLayer.prototype.start = function() {
};

LetterboxLayer.prototype.end = function() {
};

LetterboxLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.ratio.value = (16/9)/(16/(
        smoothstep(3.6, 9, (relativeFrame - 1357)/150)
       ));
};
