uniform float time;
uniform float amount;
uniform sampler2D tDiffuse;
uniform float width;
uniform float height;
varying vec2 vUv;

#define distortFocus .56

void main(void)
{
    float horizontDistance = abs(vUv.y - distortFocus);
    float smallWaves = sin((vUv.y+time*.0003)*45.)*.06;
    float horizontalRipples = smallWaves / (horizontDistance*horizontDistance*1000. + 1.);


    float squiglyVerticalPoints = vUv.x + smallWaves*.08;
    float verticalRipples = sin((squiglyVerticalPoints+time*.0003)*60.) * .005;

    //vec4 img = texture2D(tDiffuse, vec2(vUv.x , vUv.y));
    vec4 img = texture2D(tDiffuse, vec2(vUv.x + verticalRipples, vUv.y + horizontalRipples));
    //gl_FragColor = vec4(mod(time/100.,1.),1.,1.,1.);
    gl_FragColor = img;
}
