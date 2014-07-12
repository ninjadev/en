/**
 * @constructor
 */
function ColorGradingLayer(layer) {
 this.shaderPass = new THREE.ShaderPass(SHADERS.colorgrading);
}

ColorGradingLayer.prototype.getEffectComposerPass = function() {
    return this.shaderPass;
};


ColorGradingLayer.prototype.update = function(frame) {
  this.shaderPass.uniforms.red.value = 1;
  this.shaderPass.uniforms.green.value = 1;
  this.shaderPass.uniforms.blue.value = 1;
  if(frame >= 4380 && frame < 4440 ) {
    var step = (frame - 4380) / (4440 - 4380);
    this.shaderPass.uniforms.green.value = lerp(1, 0.7, step);
    this.shaderPass.uniforms.blue.value = lerp(1, 0.4, step);
  }
  if(frame >= 4440  && frame < 6230) {
    var step = (frame - 4440) / (6230 - 4440);
    this.shaderPass.uniforms.green.value = lerp(0.7, 0.4, step);
    this.shaderPass.uniforms.blue.value = lerp(0.4, 0.1, step);
  }
  if(frame >= 6230  && frame < 6500) {
    var step = (frame - 6230) / (6500 - 6230);
    this.shaderPass.uniforms.green.value = lerp(0.4, 1, step);
    this.shaderPass.uniforms.blue.value = lerp(0.1, 1, step);
  }
};
