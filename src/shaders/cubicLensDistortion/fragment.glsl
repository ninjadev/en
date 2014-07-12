uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;


void main(void) {

    // lens distortion coefficient
    float k = -0.15 * amount;

    // cubic distortion value
    float kcube = 0.1 * amount;

    // rgb shift amount
    float shift = 0.015 * amount;

    float r2 = (vUv.x - 0.5) * (vUv.x - 0.5) +
               (vUv.y - 0.5) * (vUv.y - 0.5);
    float f = 1. + r2 * (k + kcube * sqrt(r2));
    vec2 xy = vec2(f * (vUv.x - 0.5) + 0.5,
                   f * (vUv.y - 0.5) + 0.5);

    float fDist = 1. + r2 * ((k - shift) + kcube * sqrt(r2));
    vec2 xyDist = vec2(fDist * (vUv.x - 0.5) + 0.5,
                   fDist * (vUv.y - 0.5) + 0.5);

    vec4 distortion = texture2D(tDiffuse, xyDist);
    vec4 regular = texture2D(tDiffuse, xy);

    gl_FragColor = vec4(distortion.r, regular.g, regular.b, 1.);
}

