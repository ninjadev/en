function ScanlineLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.scanline);
}

ScanlineLayer.prototype.update = function() {
};

ScanlineLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
