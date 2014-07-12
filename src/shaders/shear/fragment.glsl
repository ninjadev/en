uniform float time;
uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main(void) {
    float x = vUv.x + vUv.y * amount;
    x = x - floor(x);
    float redX = vUv.x + vUv.y * amount;
    redX = redX - floor(redX);
    vec4 img = texture2D(tDiffuse, vec2(x, vUv.y));
    vec4 red = texture2D(tDiffuse, vec2(redX, vUv.y));
    vec4 original = texture2D(tDiffuse, vUv);
    gl_FragColor = vec4(red.r, img.g, img.b, 1.) * 0.5 + original * 0.5;
}
