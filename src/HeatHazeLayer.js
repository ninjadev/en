
/**
 * @constructor
 */
function HeatHazeLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.heathaze);
}

HeatHazeLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

HeatHazeLayer.prototype.start = function() {
};

HeatHazeLayer.prototype.end = function() {
};

HeatHazeLayer.prototype.update = function(frame) {
    var relativeFrame = frame - this.config.startFrame;
    this.shaderPass.uniforms.width.value = 16 * 8;
    this.shaderPass.uniforms.height.value = 9 * 8;
    this.shaderPass.uniforms.time.value = frame;
    this.shaderPass.uniforms.amount.value = lerp(0, 0.3, Math.min(relativeFrame / 100, 1));
};
