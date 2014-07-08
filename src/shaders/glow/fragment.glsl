uniform sampler2D tDiffuse;
uniform float cKernel[25];
varying vec2 vUv;

void main() {
    vec2 imageCoord = vUv;
    vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);
    float kernelWeight;

    imageCoord.x -= 25.*0.0001;

    for(int i = 0; i < 25; i++) {
        sum += texture2D(tDiffuse, imageCoord) * cKernel[i];
        imageCoord.x += 0.0001;
        kernelWeight += cKernel[i];
    }

    imageCoord = vUv;
    imageCoord.x -= 25.*0.0001;
    for(int i = 0; i < 25; i++) {
        sum += texture2D(tDiffuse, imageCoord) * cKernel[i];
        imageCoord.y += 0.0001;
    }

    if(kernelWeight <= 0.0) {
        kernelWeight = 1.0;
    }

    sum /= kernelWeight;

    gl_FragColor = (texture2D(tDiffuse, vUv) + sum * 0.5);
}
