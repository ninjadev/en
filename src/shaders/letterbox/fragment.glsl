uniform sampler2D tDiffuse;
uniform float ratio;

varying vec2 vUv;

void main() {
    vec2 imageCoord = vUv;

    float h = .5-((16./9.)*ratio/2.);
    if(vUv.y > h && vUv.y <= 1.-h) {
        gl_FragColor = texture2D(tDiffuse, vUv);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
