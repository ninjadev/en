varying mediump vec2 vUv;
uniform sampler2D tDiffuse;
uniform float red;
uniform float green;
uniform float blue;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    gl_FragColor = vec4(color.r * red, color.g * green, color.b * blue , 1.);
}
