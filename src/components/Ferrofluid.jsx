import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const MAX_COLORS = 8;

const hexToRGB = (hex) => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = (input) => {
  const base = (input && input.length ? input : ["#4F46E5", "#06B6D4", "#E0F2FE"]).slice(0, MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const flowVec = (d) => {
  switch (d) {
    case "up":
      return [0, 1];
    case "down":
      return [0, -1];
    case "left":
      return [-1, 0];
    case "right":
      return [1, 0];
    default:
      return [0, -1];
  }
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform int   uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = iTime * uSpeed * 0.5;
  
  vec2 st = (uv - 0.5) * uScale;
  
  // Flow direction drift
  st += uFlow * t * 0.3;
  
  // Turbulence distortion
  float n1 = fbm(st * 1.8 + t * 0.2);
  float n2 = fbm(st * 1.2 - t * 0.15 + 1.5);
  float n3 = fbm(st * 2.5 + vec2(t * 0.3, -t * 0.25));
  
  float height = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;
  height = height * uTurbulence;
  
  // Mouse magnetic spike
  if (uMouseEnabled > 0) {
    vec2 mouseUV = iMouse / iResolution.xy;
    float dist = length(uv - mouseUV);
    float spike = exp(-dist / uMouseRadius) * uMouseStrength;
    height += spike * 0.5;
  }
  
  // Rim detection via gradient magnitude
  float eps = 0.005;
  float hL = fbm(st * 1.8 + t * 0.2 + vec2(-eps, 0.0)) * 0.6 + fbm(st * 1.2 - t * 0.15 + 1.5 + vec2(-eps, 0.0)) * 0.3;
  float hR = fbm(st * 1.8 + t * 0.2 + vec2(eps, 0.0)) * 0.6 + fbm(st * 1.2 - t * 0.15 + 1.5 + vec2(eps, 0.0)) * 0.3;
  float hD = fbm(st * 1.8 + t * 0.2 + vec2(0.0, -eps)) * 0.6 + fbm(st * 1.2 - t * 0.15 + 1.5 + vec2(0.0, -eps)) * 0.3;
  float hU = fbm(st * 1.8 + t * 0.2 + vec2(0.0, eps)) * 0.6 + fbm(st * 1.2 - t * 0.15 + 1.5 + vec2(0.0, eps)) * 0.3;
  float grad = length(vec2(hR - hL, hU - hD));
  
  // Shimmer noise
  float shimmer = hash(uv * iResolution.xy + floor(t * 10.0)) * uShimmer;
  float rim = smoothstep(uRimWidth * 0.4, uRimWidth, grad - shimmer * 0.15);
  rim = pow(rim, uSharpness);
  
  // Color interpolation based on height
  float colorT = clamp((height * 0.5 + 0.5), 0.0, 1.0);
  float band = colorT * float(uColorCount - 1);
  int idx = int(floor(band));
  float frac = fract(band);
  
  vec3 col;
  if (idx == 0) col = mix(uColor0, uColor1, frac);
  else if (idx == 1) col = mix(uColor1, uColor2, frac);
  else if (idx == 2) col = mix(uColor2, uColor3, frac);
  else if (idx == 3) col = mix(uColor3, uColor4, frac);
  else if (idx == 4) col = mix(uColor4, uColor5, frac);
  else if (idx == 5) col = mix(uColor5, uColor6, frac);
  else col = mix(uColor6, uColor7, frac);
  
  // Base fluid look
  vec3 base = col * (0.15 + height * 0.1);
  
  // Rim glow
  float mouseGlow = 0.0;
  if (uMouseEnabled > 0) {
    vec2 mouseUV = iMouse / iResolution.xy;
    float md = length(uv - mouseUV);
    mouseGlow = exp(-md / (uMouseRadius * 0.5)) * uMouseStrength * 0.8;
  }
  
  vec3 rimColor = col * (uGlow + mouseGlow * 2.0);
  vec3 outColor = base + rimColor * rim;
  
  gl_FragColor = vec4(outColor, uOpacity);
}
`;

const Ferrofluid = ({
  colors = ["#c73659", "#e94560", "#ff6b81"],
  backgroundColor = "#040b14",
  speed = 0.4,
  scale = 2.5,
  turbulence = 1.0,
  fluidity = 0.1,
  rimWidth = 0.18,
  sharpness = 2.5,
  shimmer = 1.0,
  glow = 2.5,
  flowDirection = "down",
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1.2,
  mouseRadius = 0.25,
  mouseDampening = 0.12,
  mixBlendMode,
  paused = false,
  dpr,
  className = "",
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const geometryRef = useRef(null);
  const meshRef = useRef(null);
  const rafRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr || Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      premultipliedAlpha: false,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;
    container.appendChild(canvas); canvas.style.position = "absolute"; canvas.style.inset = "0"; canvas.style.width = "100%"; canvas.style.touchAction = "none";; canvas.style.height = "100%";

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uMouseColor: { value: avg },
      uFlow: { value: flowVec(flowDirection) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uTurbulence: { value: turbulence },
      uFluidity: { value: fluidity },
      uRimWidth: { value: rimWidth },
      uSharpness: { value: sharpness },
      uShimmer: { value: shimmer },
      uGlow: { value: glow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e) => {
      const rect2 = canvas.getBoundingClientRect();
      const sc = renderer.dpr || 1;
      const x = (e.clientX - rect2.left) * sc;
      const y = (rect2.height - (e.clientY - rect2.top)) * sc;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    if (mouseInteraction) {
      canvas.addEventListener("pointermove", onPointerMove);
    }

    const loop = (t) => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          // silent
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseInteraction) canvas.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        const fn = obj && obj[key];
        if (typeof fn === "function") fn.call(obj);
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr, paused, colors, speed, scale, turbulence, fluidity, rimWidth, sharpness,
    shimmer, glow, flowDirection, opacity, mouseInteraction, mouseStrength, mouseRadius, mouseDampening,
  ]);

  return (
    <div
      ref={containerRef}
      className={`ferrofluid-container ${className}`}
      style={{
        ...(mixBlendMode && { mixBlendMode }),
      }}
    />
  );
};

export default Ferrofluid;
