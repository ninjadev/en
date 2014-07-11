uniform sampler2D tDiffuse;
uniform float amount;
uniform vec3 period;
varying vec2 vUv;

void main(void)
{
    vec4 r = texture2D(tDiffuse, vUv + vec2(cos(vUv.y * period.r) * amount, 0.));
    vec4 g = texture2D(tDiffuse, vUv + vec2(cos(vUv.y * period.g) * amount, 0.));
    vec4 b = texture2D(tDiffuse, vUv + vec2(cos(vUv.y * period.b) * amount, 0.));
    gl_FragColor = vec4(r.r, g.g, b.b, 1.);
}
