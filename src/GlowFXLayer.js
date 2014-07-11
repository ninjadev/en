/**
 * @constructor
 */
function GlowFXLayer(layer) {
 this.shaderPass = new THREE.ShaderPass(SHADERS.glow);
}

GlowFXLayer.prototype.getEffectComposerPass = function() {
    return this.shaderPass;
};

GlowFXLayer.prototype.start = function() {
};

GlowFXLayer.prototype.end = function() {
};

GlowFXLayer.prototype.update = function(frame) {
};
