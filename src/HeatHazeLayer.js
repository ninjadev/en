
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
    var endRelativeFrame = this.config.endFrame - frame; 
    this.shaderPass.uniforms.width.value = 16 * 8;
    this.shaderPass.uniforms.height.value = 9 * 8;
    this.shaderPass.uniforms.time.value = frame;
    this.shaderPass.uniforms.amount.value = lerp(0, 0.55, Math.min(Math.min(relativeFrame, endRelativeFrame) / 100, 1));
    this.shaderPass.uniforms.horizont.value = 0.85;
};
