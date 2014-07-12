/*
 * @constructor
 */
function ShearLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.shear);
}

ShearLayer.prototype.update = function(frame, relativeFrame) {

  this.shaderPass.uniforms.amount.value = 0.0;
  this.shaderPass.uniforms.time.value = 0;
  
  if(frame >= 7165 && frame < 7170) {
    this.shaderPass.uniforms.amount.value = smoothstep(0, 100, (frame - 7165) / 15);
    this.shaderPass.uniforms.time.value = frame;
  }
  if(frame >= 7170 && frame < 7200) {
    this.shaderPass.uniforms.amount.value = smoothstep(0, 100, 1-(frame - 7170) / 20);
    this.shaderPass.uniforms.time.value = frame;
  }
};

ShearLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
