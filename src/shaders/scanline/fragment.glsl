varying mediump vec2 vUv;
uniform sampler2D tDiffuse;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    float s = sin(vUv.y * 160. * .8 * 3.14159265);
    color *= 1. - (1. + s) * 0.01;
    gl_FragColor = color;
}
