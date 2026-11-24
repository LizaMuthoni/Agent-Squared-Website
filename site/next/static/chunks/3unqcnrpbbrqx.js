(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,2810,e=>{let t=null,r=new Set;e.s(["c",0,{end:.4,railEnd:.3,labelsEnd:.12,othersOpacity:.15,ringRadiusPx:7,crossfadePx:150},"b",0,{stage:'[data-section="SessionSlowed"] .ss-stage',figure:'[data-section="SessionSlowed"] .ss-figure',radar:'[data-section="SessionSlowed"] .ss-radar',ext:130},"s",0,function(e){if(!(t&&1e-6>Math.abs(t.theta-e.theta)&&1e-6>Math.abs(t.r-e.r)))for(let a of(t=e,r))a(e)},"g",0,function(e){return r.add(e),t&&e(t),()=>{r.delete(e)}}])},76926,e=>{var t=e.i(43476),r=e.i(71645),a=e.i(17026),o=e.i(78179),i=e.i(41755),l=e.i(2810);let n=e=>{let t=String(e);return t.includes(".")||t.includes("e")?t:`${t}.0`},u=e=>`vec3(${(0,i.Y)(e).map(e=>n(Number(e.toFixed(5)))).join(", ")})`,s=(()=>{let e="float glowAt(float g) {\n";for(let t=1;t<i.t.length;t++){let[r,a]=i.t[t-1],[o,l]=i.t[t];e+=`  if (g < ${n(o)}) return mix(${n(a)}, ${n(l)}, (g - ${n(r)}) / ${n(o-r)});
`}return e+"  return 0.0;\n}\n"})(),f=`
precision highp float;
in vec3 position;
uniform vec4 uBox;
void main() {
  gl_Position = vec4(mix(uBox.xy, uBox.zw, position.xy * 0.5 + 0.5), 0.0, 1.0);
}
`,d=`
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uCenter;
uniform float uR;
uniform float uGlowR;
uniform float uDrift;
uniform float uDriftAmt;
uniform vec2 uBandFocus;  // band, amount
out vec4 fragColor;

const float TAU = 6.28318530718;
const float PI = 3.14159265359;

${s}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

// Coverage of a 1 CSS px stroke for a pixel whose center lies sd CSS px from the stroke's center line.
float stroke(float sd) {
  return clamp((0.5 - sd) * uDpr + 0.5, 0.0, 1.0);
}

float inside(float dist, float radius) {
  float aa = 0.5 / uDpr;
  return 1.0 - smoothstep(radius - aa, radius + aa, dist);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 d = p - uCenter;
  float dist = length(d);

  // Depth field: still until the study has filled in, then a very slow drift.
  float driftIn = clamp(uDrift / 6000.0, 0.0, 1.0) * uDriftAmt;
  vec2 drift = vec2(sin(uDrift * 0.000105), cos(uDrift * 0.000083) - 1.0) * 0.03 * uR * driftIn;
  float g = length(d - drift) / uGlowR;
  float grain = (hash(floor(gl_FragCoord.xy)) - 0.5) * (1.6 / 255.0);
  // Far from the radar there is only the page color: skip the rest.
  if (g > 1.05 && dist > ${n(i.$.outer)} * uR + 2.0) {
    fragColor = vec4(${u(a.F.abyss)} + grain, 1.0);
    return;
  }
  vec3 tint = mix(${u(a.F.emerald)}, ${u(a.F.teal)}, 0.22 * driftIn * (0.5 - 0.5 * cos(uDrift * 0.00004)));
  vec3 col = mix(${u(a.F.abyss)}, tint, glowAt(g));

  // Ring ramp
  float i1 = inside(dist, ${n(a.H[0])} * uR);
  float i2 = inside(dist, ${n(a.H[1])} * uR);
  float i3 = inside(dist, ${n(a.H[2])} * uR);
  float i4 = inside(dist, ${n(a.H[3])} * uR);
  col = mix(col, ${u(i.S[0].color)}, ${n(i.S[0].alpha)} * i1);
  col = mix(col, ${u(i.S[1].color)}, ${n(i.S[1].alpha)} * (i2 - i1));
  col = mix(col, ${u(i.S[2].color)}, ${n(i.S[2].alpha)} * (i3 - i2));
  col = mix(col, ${u(i.S[3].color)}, ${n(i.S[3].alpha)} * (i4 - i3));

  // Focused ring label: lift its band.
  if (uBandFocus.y > 0.0) {
    float b = uBandFocus.x;
    float inner = b < 0.5 ? 0.0 : b < 1.5 ? ${n(a.H[0])} : b < 2.5 ? ${n(a.H[1])} : b < 3.5 ? ${n(a.H[2])} : 1.04;
    float outer = b < 0.5 ? ${n(a.H[0])} : b < 1.5 ? ${n(a.H[1])} : b < 2.5 ? ${n(a.H[2])} : b < 3.5 ? 1.0 : 1.2;
    float inBand = inside(dist, outer * uR) - (inner > 0.0 ? inside(dist, inner * uR) : 0.0);
    col = mix(col, ${u(i.y.color)}, ${n(i.y.alpha)} * inBand * uBandFocus.y);
  }

  float ang = atan(d.y, d.x);
  // Ring strokes
  float rs = 0.0;
  rs = max(rs, stroke(abs(dist - ${n(a.H[0])} * uR)) * ${n(i.W.alphas[0])});
  rs = max(rs, stroke(abs(dist - ${n(a.H[1])} * uR)) * ${n(i.W.alphas[1])});
  rs = max(rs, stroke(abs(dist - ${n(a.H[2])} * uR)) * ${n(i.W.alphas[2])});
  rs = max(rs, stroke(abs(dist - ${n(a.H[3])} * uR)) * ${n(i.W.alphas[3])});
  col = mix(col, ${u(i.W.color)}, rs);

  // Slice dividers (nearest one only) and bearing ticks
  float sliceStep = radians(${n(a.V)});
  float sliceStart = radians(${n(o.h)});
  float ka = sliceStart + floor((ang - sliceStart) / sliceStep + 0.5) * sliceStep;
  vec2 dir = vec2(cos(ka), sin(ka));
  float along = dot(d, dir);
  float perp = abs(d.x * dir.y - d.y * dir.x);
  float seg = smoothstep(${n(i.A.from)} * uR, ${n(i.A.from)} * uR + 1.0, along) * (1.0 - smoothstep(${n(i.A.to)} * uR - 1.0, ${n(i.A.to)} * uR, along));
  col = mix(col, ${u(i.A.color)}, stroke(perp) * seg * ${n(i.A.alpha)});

  float tickStep = radians(${n(i.c.every)});
  float ta = (floor(ang / tickStep + 0.5)) * tickStep;
  float deg = mod(degrees(ta) + 360.0, 360.0);
  float major = abs(mod(deg + 0.5, ${n(i.c.majorEvery)}) - 0.5) < 0.6 ? 1.0 : 0.0;
  float len = mix(${n(i.c.len)}, ${n(i.c.majorLen)}, major);
  vec2 tdir = vec2(cos(ta), sin(ta));
  float talong = dot(d, tdir) - uR;
  float tperp = abs(d.x * tdir.y - d.y * tdir.x);
  float tick = stroke(tperp) * step(1.0, talong) * (1.0 - step(len + 1.0, talong));
  col = mix(col, ${u(i.c.color)}, tick * ${n(i.c.alpha)});

  // Fine static grain so the gradient never bands.
  col += grain;
  fragColor = vec4(col, 1.0);
}
`,c=`
precision highp float;
in vec3 position;
in vec4 aA; // thetaFrom, rFrom, thetaTo, rTo
in vec4 aB; // born, flight, switchDelay, flags
in vec4 aC; // winFrom, winTo, group, questionOrder

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uR;
uniform float uDotPx;
uniform float uEntryPx;
uniform vec4 uGroupAlpha;
uniform float uFullMix;
uniform vec4 uRelight;       // dim, cur, curAmt, prev
uniform float uRelightPrevAmt;
uniform vec3 uSwitch;        // start, dur, mode
uniform vec4 uSweep;         // on, angle, age, period
uniform float uHandoff;
uniform float uHover;
uniform vec2 uDim;           // x, amount

out vec2 vOff;
out float vRad;
out float vAlpha;
out float vWin;
out vec2 vRip;
out float vRing;
out float vHover;

const float TAU = 6.28318530718;

float outQuint(float t) { t = clamp(t, 0.0, 1.0); return 1.0 - pow(1.0 - t, 5.0); }
float outCubic(float t) { t = clamp(t, 0.0, 1.0); return 1.0 - pow(1.0 - t, 3.0); }
float outExpo(float t) { t = clamp(t, 0.0, 1.0); return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t); }
float inOutCubic(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float t = uTime;
  float born = aB.x;
  float flight = aB.y;
  float sdel = aB.z;
  float flags = aB.w;
  float isIntro = mod(flags, 2.0) >= 1.0 ? 1.0 : 0.0;
  float isHand = mod(floor(flags / 2.0 + 0.001), 2.0) >= 1.0 ? 1.0 : 0.0;
  float group = aC.z;
  float qOrder = aC.w;

  // Brand switch: slide along the bearing (or a 200 ms cross-fade under reduced motion).
  float th; float rr; float win; float dip = 1.0;
  if (uSwitch.z < 0.5) {
    float se = inOutCubic((t - uSwitch.x - sdel) / uSwitch.y);
    th = mix(aA.x, aA.z, se);
    rr = mix(aA.y, aA.w, se);
    win = mix(aC.x, aC.y, se);
  } else {
    float sp = clamp((t - uSwitch.x) / uSwitch.y, 0.0, 1.0);
    bool second = sp >= 0.5;
    th = second ? aA.z : aA.x;
    rr = second ? aA.w : aA.y;
    win = second ? aC.y : aC.x;
    dip = abs(sp * 2.0 - 1.0);
  }

  // Travel inward from outside the rim, no overshoot.
  bool bornYet = t >= born;
  float fp = flight > 0.0 ? clamp((t - born) / flight, 0.0, 1.0) : 1.0;
  float rStart = max(1.0, rr) + uEntryPx / max(uR, 1.0);
  float rFly = mix(rStart, rr, outQuint(fp));
  float r = bornYet ? mix(rFly, rr, uFullMix) : rr;

  // Strength tiers
  int gi = int(group + 0.5);
  float gA = gi == 0 ? uGroupAlpha.x : gi == 1 ? uGroupAlpha.y : gi == 2 ? uGroupAlpha.z : uGroupAlpha.w;
  float introA = bornYet ? gA * smoothstep(0.0, 0.12, fp) : 0.0;
  float alpha = mix(introA, ${n(o.c.rest)}, uFullMix);

  float isCur = abs(qOrder - uRelight.y) < 0.5 ? 1.0 : 0.0;
  float isPrev = abs(qOrder - uRelight.w) < 0.5 ? 1.0 : 0.0;
  float lit = max(isCur * uRelight.z, isPrev * uRelightPrevAmt);
  alpha = mix(alpha, mix(${n(o.c.relightOthers)}, 1.0, lit), uRelight.x);
  alpha *= mix(${n(o.c.bone)}, 1.0, win);

  // The sweep brightens what it passes, then lets it fade back. It skips dimmed dots.
  float since = mod(uSweep.y - th, TAU) / TAU * uSweep.w;
  float boost = uSweep.x * (since <= uSweep.z ? 1.0 : 0.0) * pow(1.0 - clamp(since / ${n(a.x.sweepDecayMs)}, 0.0, 1.0), 2.0);
  boost *= 1.0 - uRelight.x * (1.0 - lit);
  alpha = mix(alpha, 1.0, boost * ${n(o.t)} * (bornYet ? 1.0 : uFullMix));
  alpha *= dip;

  // Scroll handoff
  alpha = mix(alpha, isHand > 0.5 ? max(alpha, 0.95) : min(alpha, ${n(o.c.handoffOthers)}), uHandoff);

  vec2 pos = uCenter + vec2(cos(th), sin(th)) * r * uR;
  alpha = mix(alpha, min(alpha, ${n(o.c.underScrim)}), uDim.y * (1.0 - smoothstep(uDim.x - 40.0, uDim.x, pos.x)));

  // Settle scale and ripple: opening questions only.
  float introK = isIntro * (1.0 - uFullMix);
  float settle = clamp((t - (born + flight - ${n(a.x.settleScaleMs)})) / ${n(a.x.settleScaleMs)}, 0.0, 1.0);
  float sc = 1.0 + ${n(o.x-1)} * (1.0 - outCubic(settle)) * introK;
  float rt = (t - born - flight) / ${n(a.x.rippleMs)};
  float rippleOn = (bornYet && rt >= 0.0 && rt < 1.0) ? 1.0 : 0.0;
  float ripA = 0.6 * (1.0 - clamp(rt, 0.0, 1.0)) * rippleOn * introK;
  float ripR = ${n(o.f)} * outExpo(rt);

  vRad = uDotPx * 0.5 * sc;
  vAlpha = alpha;
  vWin = win;
  vRip = vec2(ripR, ripA);
  vRing = isHand * uHandoff;
  vHover = abs(float(gl_InstanceID) - uHover) < 0.5 ? 0.75 : 0.0;

  float half_ = vRad + 1.5;
  if (ripA > 0.0) half_ = max(half_, ripR + 1.5);
  if (vRing > 0.0) half_ = max(half_, ${n(l.c.ringRadiusPx)} + 1.5);
  if (vHover > 0.0) half_ = max(half_, 8.0);
  if (alpha < 0.003 && ripA < 0.003 && vRing < 0.003) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 px = pos + position.xy * half_;
  vOff = position.xy * half_;
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);
}
`,p=`
precision highp float;
uniform float uDpr;
in vec2 vOff;
in float vRad;
in float vAlpha;
in float vWin;
in vec2 vRip;
in float vRing;
in float vHover;
out vec4 fragColor;

float ring(float d, float r) {
  return clamp((0.5 - abs(d - r)) * uDpr + 0.5, 0.0, 1.0);
}

void main() {
  float d = length(vOff);
  float aa = 0.5 / uDpr;
  float disc = 1.0 - smoothstep(vRad - aa, vRad + aa, d);
  vec3 bone = ${u(a.F.bone)};
  vec3 phos = ${u(a.F.phosphor)};
  vec3 col = mix(bone, phos, vWin);
  float a = disc * vAlpha;
  float rip = ring(d, vRip.x) * vRip.y;
  float hr = ring(d, ${n(l.c.ringRadiusPx)}) * vRing;
  float hv = ring(d, 6.5) * vHover;
  vec3 pc = col * rip;
  float pa = rip;
  pc = pc * (1.0 - a) + col * a;
  pa = pa * (1.0 - a) + a;
  pc = pc * (1.0 - hr) + phos * hr;
  pa = pa * (1.0 - hr) + hr;
  pc = pc * (1.0 - hv) + bone * hv;
  pa = pa * (1.0 - hv) + hv;
  if (pa < 0.002) discard;
  fragColor = vec4(pc / pa, pa);
}
`,h=`
precision highp float;
uniform sampler2D uStatic;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uCenter;
uniform float uR;
uniform vec4 uSweep;      // on, angle, age, unused
uniform vec3 uBearing;    // angle, draw 0..1, alpha
out vec4 fragColor;

const float TAU = 6.28318530718;

float stroke(float sd) {
  return clamp((0.5 - sd) * uDpr + 0.5, 0.0, 1.0);
}
float inside(float dist, float radius) {
  float aa = 0.5 / uDpr;
  return 1.0 - smoothstep(radius - aa, radius + aa, dist);
}

void main() {
  vec3 col = texelFetch(uStatic, ivec2(gl_FragCoord.xy), 0).rgb;
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 d = p - uCenter;
  float dist = length(d);
  if ((uSweep.x <= 0.0 && uBearing.z <= 0.0) || dist > ${n(i.$.outer)} * uR + 2.0) {
    fragColor = vec4(col, 1.0);
    return;
  }
  float i4 = inside(dist, uR);

  // Sweep: a 24 degree wedge at 8% Jade, brightest on its leading edge. Only after the fill.
  if (uSweep.x > 0.0) {
    vec2 sdir = vec2(cos(uSweep.y), sin(uSweep.y));
    float fwd = dot(d, sdir);
    float back = sdir.y * d.x - sdir.x * d.y; // > 0 behind the leading edge (clockwise sweep)
    float w = radians(${n(a.x.sweepWedgeDeg)});
    if (fwd > 0.0 && back >= 0.0 && back < fwd * tan(w)) {
      float behind = atan(back, fwd);
      float k = 1.0 - behind / w;
      float fadeIn = clamp(uSweep.z / 1200.0, 0.0, 1.0);
      col = mix(col, ${u(i.I.color)}, ${n(i.I.alpha)} * k * i4 * fadeIn * uSweep.x);
    }
  }

  // Bearing line of the question on screen, drawn from outside the rim inward.
  if (uBearing.z > 0.0) {
    vec2 bdir = vec2(cos(uBearing.x), sin(uBearing.x));
    float bperp = abs(d.x * bdir.y - d.y * bdir.x);
    if (bperp < 2.0) {
      float balong = dot(d, bdir);
      float outer = ${n(i.$.outer)} * uR;
      float from = outer * (1.0 - uBearing.y);
      float seg = step(from, balong) * step(balong, outer) * step(0.0, balong);
      float fadeEnds = smoothstep(0.0, 0.18 * uR, balong) * (1.0 - smoothstep(outer - 0.12 * uR, outer, balong));
      col = mix(col, ${u(i.$.color)}, stroke(bperp) * seg * fadeEnds * ${n(i.$.alpha)} * uBearing.z);
    }
  }
  fragColor = vec4(col, 1.0);
}
`,m=e=>`#version 300 es
#define SHADER_TYPE ${e}
#define SHADER_NAME 
`,g=["uBox","uRes","uDpr","uCenter","uR","uGlowR","uDrift","uDriftAmt","uBandFocus"],R=["uStatic","uBox","uRes","uDpr","uCenter","uR","uSweep","uBearing"],x=["uTime","uRes","uDpr","uCenter","uR","uDotPx","uEntryPx","uGroupAlpha","uFullMix","uRelight","uRelightPrevAmt","uSwitch","uSweep","uHandoff","uHover","uDim"],A={alpha:!0,depth:!1,stencil:!1,antialias:!1,premultipliedAlpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1},v=()=>new Promise(e=>setTimeout(e,0));e.s(["default",0,function({director:e,paused:a,onReady:o,onLost:i,onRestored:l,onFrame:n}){let u=(0,r.useRef)(null),s=(0,r.useRef)(null),b=(0,r.useRef)(null),w=(0,r.useRef)({onReady:o,onLost:i,onRestored:l,onFrame:n});w.current={onReady:o,onLost:i,onRestored:l,onFrame:n};let S=(0,r.useRef)(()=>{});return(0,r.useLayoutEffect)(()=>{let t,r,a,o,i,l,n,E,F,y,$,T,D,_,C,B,P,M,U,H,L,O,I,k,N,G,V=s.current,W=u.current;if(!V||!W)return;V.setAttribute("aria-hidden","true"),V.setAttribute("tabindex","-1");let Y=!0,z=!1,X=V.getContext("webgl2",A);if(!X)return void w.current.onLost();let q=(t=null,r=null,a=null,o=[],i=null,l=new Float32Array(0),n=-1,E=null,F="",y=1,$=!1,T=(e,t)=>{let r=X.createShader(e);return X.shaderSource(r,t),X.compileShader(r),r},D=(e,t)=>{let r=T(X.VERTEX_SHADER,m("RawShaderMaterial")+e),a=T(X.FRAGMENT_SHADER,m("RawShaderMaterial")+t),o=X.createProgram();return X.attachShader(o,r),X.attachShader(o,a),X.linkProgram(o),{program:o,vs:r,fs:a,u:{},a:{}}},_=(e,t,r)=>{if(!X.getProgramParameter(e.program,X.LINK_STATUS))throw Error(`radar: program failed to link: ${X.getProgramInfoLog(e.program)} ${X.getShaderInfoLog(e.vs)} ${X.getShaderInfoLog(e.fs)}`);for(let r of t)e.u[r]=X.getUniformLocation(e.program,r);for(let t of r)e.a[t]=X.getAttribLocation(e.program,t)},C=new Float32Array([-1,1,0,1,1,0,-1,-1,0,1,-1,0]),B=new Uint16Array([0,2,1,2,3,1]),P=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),M=new Uint16Array([0,1,2,0,2,3]),U=(e,t,r)=>{let a=X.createBuffer();return X.bindBuffer(e,a),X.bufferData(e,t,r),o.push(a),a},H=e=>{let t=X.createVertexArray();X.bindVertexArray(t),U(X.ARRAY_BUFFER,C,X.STATIC_DRAW);let r=e.a.position;return r>=0&&(X.enableVertexAttribArray(r),X.vertexAttribPointer(r,3,X.FLOAT,!1,0,0)),U(X.ELEMENT_ARRAY_BUFFER,B,X.STATIC_DRAW),X.bindVertexArray(null),t},L=async()=>{let e=D(f,d),o=D(f,h),u=D(c,p),s=X.getExtension("KHR_parallel_shader_compile"),m=[e,o,u];if(s)for(;!$&&!m.every(e=>X.getProgramParameter(e.program,s.COMPLETION_STATUS_KHR));)await v();else await v();if(!$&&(_(e,g,["position"]),await v(),!$)){let s;_(o,R,["position"]),_(u,x,["position","aA","aB","aC"]),t={bp:e,cp:o,dots:u},r={bp:H(e),cp:H(o)},s=X.createVertexArray(),X.bindVertexArray(s),U(X.ARRAY_BUFFER,P,X.STATIC_DRAW),u.a.position>=0&&(X.enableVertexAttribArray(u.a.position),X.vertexAttribPointer(u.a.position,3,X.FLOAT,!1,0,0)),i=U(X.ARRAY_BUFFER,l,X.DYNAMIC_DRAW),["aA","aB","aC"].forEach((e,t)=>{let r=u.a[e];r<0||(X.enableVertexAttribArray(r),X.vertexAttribPointer(r,4,X.FLOAT,!1,48,16*t),X.vertexAttribDivisor(r,1))}),U(X.ELEMENT_ARRAY_BUFFER,M,X.STATIC_DRAW),X.bindVertexArray(null),a=s,X.disable(X.CULL_FACE),X.disable(X.DEPTH_TEST),X.disable(X.SCISSOR_TEST),X.disable(X.BLEND),X.clearColor(0,0,0,0),n=-1,F=""}},O=(e,t)=>e&&X.uniform1f(e,t),I=(e,t,r)=>e&&X.uniform2f(e,t,r),k=(e,t,r,a)=>e&&X.uniform3f(e,t,r,a),N=(e,t,r,a,o)=>e&&X.uniform4f(e,t,r,a,o),G=L(),{get ready(){return G},get dpr(){return y},setSize(e,t,r){y=r,V.width=Math.floor(e*r),V.height=Math.floor(t*r),V.style.width=`${e}px`,V.style.height=`${t}px`},render(e,o){if(!t||!r||!a||X.isContextLost())return;var u=o;if(i&&(l.length!==12*u.n&&(l=new Float32Array(12*u.n),n=-1,X.bindBuffer(X.ARRAY_BUFFER,i),X.bufferData(X.ARRAY_BUFFER,l,X.DYNAMIC_DRAW)),u.version!==n)){n=u.version;for(let e=0;e<u.n;e++){let t=4*e,r=12*e;l[r]=u.a[t],l[r+1]=u.a[t+1],l[r+2]=u.a[t+2],l[r+3]=u.a[t+3],l[r+4]=u.b[t],l[r+5]=u.b[t+1],l[r+6]=u.b[t+2],l[r+7]=u.b[t+3],l[r+8]=u.c[t],l[r+9]=u.c[t+1],l[r+10]=u.c[t+2],l[r+11]=u.c[t+3]}X.bindBuffer(X.ARRAY_BUFFER,i),X.bufferSubData(X.ARRAY_BUFFER,0,l)}let s=V.width,f=V.height;((e,t)=>{if(E&&E.w===e&&E.h===t)return;E&&(X.deleteFramebuffer(E.fb),X.deleteTexture(E.tex));let r=X.createTexture();X.bindTexture(X.TEXTURE_2D,r),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_S,X.CLAMP_TO_EDGE),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_T,X.CLAMP_TO_EDGE),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MAG_FILTER,X.NEAREST),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MIN_FILTER,X.NEAREST),X.texStorage2D(X.TEXTURE_2D,1,X.RGBA8,e,t);let a=X.createFramebuffer();X.bindFramebuffer(X.FRAMEBUFFER,a),X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,r,0),X.bindFramebuffer(X.FRAMEBUFFER,null),E={fb:a,tex:r,w:e,h:t},F=""})(s,f);let d=250*Math.floor(e.drift/250),c=Math.max(e.glowR,1.3*e.R+12),p=Math.max(-1,(e.cx-c)/e.width*2-1),h=Math.min(1,(e.cx+c)/e.width*2-1),m=Math.max(-1,1-(e.cy+c)/e.height*2),g=Math.min(1,1-(e.cy-c)/e.height*2),R=Math.round(50*e.driftAmt)/50,x=`${e.width}|${e.height}|${y}|${e.cx.toFixed(2)}|${e.cy.toFixed(2)}|${e.R.toFixed(2)}|${e.glowR.toFixed(2)}|${d}|${R}|${e.bandFocus}|${e.bandFocusAmt}`;if(x!==F&&E){F=x;let a=t.bp;X.bindFramebuffer(X.FRAMEBUFFER,E.fb),X.viewport(0,0,E.w,E.h),X.disable(X.BLEND),X.clear(X.COLOR_BUFFER_BIT),X.useProgram(a.program),N(a.u.uBox,p,m,h,g),I(a.u.uRes,e.width,e.height),O(a.u.uDpr,y),I(a.u.uCenter,e.cx,e.cy),O(a.u.uR,e.R),O(a.u.uGlowR,e.glowR),O(a.u.uDrift,d),O(a.u.uDriftAmt,R),I(a.u.uBandFocus,e.bandFocus,e.bandFocusAmt),X.bindVertexArray(r.bp),X.drawElements(X.TRIANGLES,6,X.UNSIGNED_SHORT,0),X.bindFramebuffer(X.FRAMEBUFFER,null)}X.bindFramebuffer(X.FRAMEBUFFER,null),X.viewport(0,0,s,f),X.disable(X.BLEND),X.clear(X.COLOR_BUFFER_BIT);let A=t.cp;X.useProgram(A.program),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,E?E.tex:null),A.u.uStatic&&X.uniform1i(A.u.uStatic,0),N(A.u.uBox,p,m,h,g),I(A.u.uRes,e.width,e.height),O(A.u.uDpr,y),I(A.u.uCenter,e.cx,e.cy),O(A.u.uR,e.R),N(A.u.uSweep,e.sweepOn,e.sweepAngle,e.sweepAge,0),k(A.u.uBearing,e.bearingAngle,e.bearingDraw,e.bearingAlpha),X.bindVertexArray(r.cp),X.drawElements(X.TRIANGLES,6,X.UNSIGNED_SHORT,0);let v=t.dots;X.useProgram(v.program),O(v.u.uTime,e.t),I(v.u.uRes,e.width,e.height),O(v.u.uDpr,y),I(v.u.uCenter,e.cx,e.cy),O(v.u.uR,e.R),O(v.u.uDotPx,e.dotPx),O(v.u.uEntryPx,e.entryPx),N(v.u.uGroupAlpha,e.groupAlpha[0],e.groupAlpha[1],e.groupAlpha[2],e.groupAlpha[3]),O(v.u.uFullMix,e.fullMix),N(v.u.uRelight,e.relightDim,e.relightCur,e.relightCurAmt,e.relightPrev),O(v.u.uRelightPrevAmt,e.relightPrevAmt),k(v.u.uSwitch,e.switchStart,e.switchDur,e.switchMode),N(v.u.uSweep,e.sweepOn,e.sweepAngle,e.sweepAge,e.sweepPeriod),O(v.u.uHandoff,e.handoff),O(v.u.uHover,e.hover),I(v.u.uDim,e.dimX,e.dimAmt),X.enable(X.BLEND),X.blendEquation(X.FUNC_ADD),X.blendFuncSeparate(X.SRC_ALPHA,X.ONE_MINUS_SRC_ALPHA,X.ONE,X.ONE_MINUS_SRC_ALPHA),X.bindVertexArray(a),X.drawElementsInstanced(X.TRIANGLES,6,X.UNSIGNED_SHORT,0,o.n),X.bindVertexArray(null),X.disable(X.BLEND)},restore:()=>(t=null,r=null,a=null,o=[],i=null,E=null,G=L()),dispose(){if($=!0,!X.isContextLost()){if(t)for(let e of[t.bp,t.cp,t.dots])X.deleteProgram(e.program),X.deleteShader(e.vs),X.deleteShader(e.fs);for(let e of o)X.deleteBuffer(e);r&&(X.deleteVertexArray(r.bp),X.deleteVertexArray(r.cp)),a&&X.deleteVertexArray(a),E&&(X.deleteFramebuffer(E.fb),X.deleteTexture(E.tex))}}});b.current=q;let j={w:0,h:0,dpr:0},K=()=>{let e=W.getBoundingClientRect(),t=Math.min(Math.max(1,window.devicePixelRatio??2),2);e.width<=0||e.height<=0||(e.width!==j.w||e.height!==j.h||t!==j.dpr)&&(j={w:e.width,h:e.height,dpr:t},q.setSize(e.width,e.height,t))};K();let Q=new ResizeObserver(K);Q.observe(W),S.current=t=>{z||(K(),e.tick(t),q.render(e.frame(),e.buffers),w.current.onFrame?.(t))};let J=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{Y&&w.current.onReady()}));q.ready.then(J,J);let Z=e=>{e.preventDefault(),z=!0,w.current.onLost()},ee=()=>{q.restore().then(()=>{Y&&(z=!1,w.current.onRestored())})};return V.addEventListener("webglcontextlost",Z),V.addEventListener("webglcontextrestored",ee),()=>{Y=!1,Q.disconnect(),V.removeEventListener("webglcontextlost",Z),V.removeEventListener("webglcontextrestored",ee),q.dispose(),b.current=null,S.current=()=>{}}},[e]),(0,r.useEffect)(()=>{if(a)return;let e=0,t=r=>{S.current(r),e=requestAnimationFrame(t)};return e=requestAnimationFrame(t),()=>cancelAnimationFrame(e)},[a]),(0,t.jsx)("div",{"aria-hidden":"true",style:{position:"absolute",width:"100%",height:"100%",overflow:"hidden",pointerEvents:"none",inset:0},children:(0,t.jsx)("div",{ref:u,style:{width:"100%",height:"100%"},children:(0,t.jsx)("canvas",{ref:s,style:{display:"block"}})})})}],76926)}])})();