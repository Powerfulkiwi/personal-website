
import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = sin(i.x + i.y * 137.0) * 43758.5453;
    float b = sin(i.x + 1.0 + i.y * 137.0) * 43758.5453;
    float c = sin(i.x + (i.y + 1.0) * 137.0) * 43758.5453;
    float d = sin(i.x + 1.0 + (i.y + 1.0) * 137.0) * 43758.5453;
    return mix(mix(fract(a), fract(b), f.x), mix(fract(c), fract(d), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = rot * p * 2.0 + shift; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = (uv - 0.5) * aspect * 2.0 + 0.5;
    st *= 3.5;
    st.x += uTime * 0.012;
    st.y += uTime * 0.018;

    float disp = 0.006;
    float nR = fbm(st);
    float nG = fbm(st + disp);
    float nB = fbm(st - disp);

    vec3 col;
    col.r = nR * 0.12 + 0.85;
    col.g = nG * 0.15 + 0.87;
    col.b = nB * 0.18 + 0.92;

    float peak = smoothstep(0.6, 0.75, nR) * 0.25;
    col += peak * vec3(0.70, 0.72, 0.80);

    float alpha = 0.015 + (nR + nG + nB) * 0.04 + peak * 0.02;
    alpha = clamp(alpha, 0.0, 0.08);


    // Starfield
    float starField = 0.0;
    for (int si = 0; si < 6; si++) {
      float sOff = float(si) * 0.17;
      vec2 starSeed = vec2(sin(sOff * 123.456 + uTime * 0.02) * 0.5 + 0.5, cos(sOff * 789.012 + uTime * 0.015) * 0.5 + 0.5);
      float starDist = length(uv - starSeed);
      float star = smoothstep(0.018, 0.0, starDist) * (0.5 + 0.5 * sin(uTime * 2.5 + float(si) * 1.7)) * 0.25;
      starField += star;
    }
    float tinyStars = smoothstep(0.82, 0.86, nR) * smoothstep(0.82, 0.86, nB) * 0.3;
    starField += tinyStars;
    col += starField * vec3(0.6, 0.72, 0.9);
    alpha += starField * 0.03;

    gl_FragColor = vec4(col * 1.5, alpha);
  }
`;

export default function GlobalBackground() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const w = window.innerWidth, h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrapper.appendChild(renderer.domElement);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0"; renderer.domElement.style.left = "0";
    renderer.domElement.style.pointerEvents = "none"; renderer.domElement.style.zIndex = "0";

    const uniforms = { uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(w, h) } };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => { const rw = window.innerWidth, rh = window.innerHeight; renderer.setSize(rw, rh); uniforms.uResolution.value.set(rw, rh); };
    window.addEventListener("resize", onResize);

    let animId; const clock = new THREE.Clock();
    function render() { uniforms.uTime.value += clock.getDelta(); renderer.render(scene, camera); animId = requestAnimationFrame(render); }
    render();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); renderer.dispose(); material.dispose(); wrapper.removeChild(renderer.domElement); };
  }, []);

  return <div ref={wrapperRef} />;
}
