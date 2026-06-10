
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
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = sin(i.x + i.y * 137.0) * 43758.5453;
    float b = sin(i.x + 1.0 + i.y * 137.0) * 43758.5453;
    float c = sin(i.x + (i.y + 1.0) * 137.0) * 43758.5453;
    float d = sin(i.x + 1.0 + (i.y + 1.0) * 137.0) * 43758.5453;
    return mix(mix(fract(a), fract(b), f.x), mix(fract(c), fract(d), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = uv * aspect * 2.5;

    st.x += uTime * 0.025;
    st.y += uTime * 0.035;

    // Mouse ripple
    vec2 mouse = uMouse * aspect * 2.5;
    float distToMouse = length(st - mouse);
    float ripple = sin(distToMouse * 7.0 - uTime * 2.5) * 0.5 + 0.5;
    ripple *= smoothstep(1.5, 0.0, distToMouse) * 0.9;

    // Prismatic dispersion: offset R/G/B channels slightly
    float disp = 0.008;
    float nR = fbm(st * 1.2 + ripple * 0.3 + uTime * 0.01);
    float nG = fbm(st * 1.25 + ripple * 0.3 + 0.3);
    float nB = fbm(st * 1.15 + ripple * 0.3 + 0.6);

    // Each channel has its own color range
    float r = nR * 0.6 + ripple * 0.3;
    float g = nG * 0.5 + ripple * 0.25;
    float b = nB * 0.55 + ripple * 0.35;

    // Prismatic glass color
    vec3 col;
    col.r = r * 0.15 + 0.82;
    col.g = g * 0.18 + 0.85;
    col.b = b * 0.22 + 0.90;

    // Highlights on peaks
    float peak = smoothstep(0.62, 0.74, nR) * 0.24;
  float warmG = nG * smoothstep(0.5, 0.65, nR) * 0.12;
    col += peak * vec3(0.72, 0.74, 0.82);
  col += warmG * vec3(0.02, 0.02, 0.05);

    // Brightness + contrast
    float alpha = 0.05 + (r + g + b) * 0.12 + peak * 0.05;
    alpha = clamp(alpha, 0.0, 0.22);

  


    gl_FragColor = vec4(col * 1.8, alpha);
  }
`;

export default function HeroBackground() {
  const wrapperRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrapper.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.pointerEvents = "none";

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Particle system — colored floating dots
    const particleCount = 300;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color("#3a3a50"),
      new THREE.Color("#4a4080"),
      new THREE.Color("#6058a0"),
      new THREE.Color("#7a7090"),
      new THREE.Color("#505060"),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
      positions[i * 3 + 2] = 0;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 5 + 2;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.35,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);


    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX / width, y: 1.0 - e.clientY / height };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    let animId;
    const clock = new THREE.Clock();
    function render() {
      const dt = clock.getDelta();
      uniforms.uTime.value += dt;
      const time = uniforms.uTime.value;
      uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.04
      );

      // Animate particles — slow float + color pulse
      const pos = particles.geometry.attributes.position.array;
      const col = particles.geometry.attributes.color.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 0.7 + i * 0.3) * 0.0006;
        pos[i * 3] += Math.cos(time * 0.55 + i * 0.2) * 0.0005;
        // Wrap around
        if (pos[i * 3 + 1] > 1.55) pos[i * 3 + 1] = -1.55;
        if (pos[i * 3 + 1] < -1.55) pos[i * 3 + 1] = 1.55;
        if (pos[i * 3] > 1.55) pos[i * 3] = -1.55;
        if (pos[i * 3] < -1.55) pos[i * 3] = 1.55;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.material.opacity = 0.35 + Math.sin(time * 0.5) * 0.12;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      wrapper.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={wrapperRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}
