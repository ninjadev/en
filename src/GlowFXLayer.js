/**
 * @constructor
 */
function GlowFXLayer(config) {
 this.config = config;
 this.shaderPass = new THREE.ShaderPass(SHADERS.glow);
}

GlowFXLayer.prototype.getEffectComposerPass = function() {
    return this.shaderPass;
};

GlowFXLayer.prototype.start = function() {
};

GlowFXLayer.prototype.end = function() {
  this.shaderPass = null;
  this.config = null;
};

GlowFXLayer.prototype.update = function(frame) {
};
