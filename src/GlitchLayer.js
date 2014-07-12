/*
 * @constructor
 */

function GlitchLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.glitch);
}

GlitchLayer.prototype.update = function(frame, relativeFrame) {

  this.shaderPass.uniforms.amount.value = 0.0;
  this.shaderPass.uniforms.time.value = 0;
  
  /*
  if(frame >= 7170 && frame < 7200) {
    this.shaderPass.uniforms.amount.value = (frame - 7170) / 30;
    this.shaderPass.uniforms.time.value = frame;
  }
  */

  if(frame >= 5400 && frame < 6227) {
    this.shaderPass.uniforms.amount.value = 0.1;
    this.shaderPass.uniforms.time.value = frame;
  }

  if(frame >= 6227 && frame < 6355) {
    this.shaderPass.uniforms.amount.value = smoothstep(
        0.25, 0, (frame - 6227) / (6355 - 6227));
    this.shaderPass.uniforms.time.value = frame;
  }

  if(frame >= 7620 && frame < 7650) {
    this.shaderPass.uniforms.amount.value = smoothstep(
        0.25, 0, (frame - 7620) / 30);
    this.shaderPass.uniforms.time.value = frame;
  }

  if(frame >= 8160 && frame < 8190) {
    this.shaderPass.uniforms.amount.value = 1;
    this.shaderPass.uniforms.time.value = frame;
  }


};

GlitchLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
