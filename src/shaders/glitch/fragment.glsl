uniform float time;
uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float ranieyy(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
    float size = 8.;
    vec2 pos = vec2(floor(size * 2. * vUv.x + vUv.y * vUv.y * amount * cos(vUv.x * time)) / 2. / size,
                    floor(size * 18. * vUv.y * sin(time)) / 18. / size);
    float random = ranieyy(pos + time);
    vec4 img = texture2D(tDiffuse, vUv);
    vec4 left = texture2D(tDiffuse, vUv - 0.1);
    vec4 right = texture2D(tDiffuse, vUv + 0.1);
    vec4 sine = texture2D(tDiffuse, vec2(sin(vUv.x * 37.), sin(vUv.y * 23.)));
    vec4 color = vec4(1.);
    if(random < 0.333) {
        color = vec4(left.r, img.g, img.b, 1.) + sine;
    } else if(random < 0.666) {
        color = vec4(img.b, right.r, img.g, 1.) * sine;
    } else {
        color = vec4(img.r, img.g / 2., right.b + sine.b, 1.);
    }
    gl_FragColor = (1. - amount) * img + amount * color;
}
