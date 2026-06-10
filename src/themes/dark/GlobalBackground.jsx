import { useEffect, useRef } from "react";
import * as THREE from "three";

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

export default function GlobalBackground() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06060f);
    wrapper.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.touchAction = "none";

    const circleTex = createCircleTexture();
    const palette = [
      new THREE.Color("#ff6b9d"), new THREE.Color("#c084fc"),
      new THREE.Color("#f472b6"), new THREE.Color("#a855f7"),
      new THREE.Color("#fb7185"), new THREE.Color("#e879f9"),
    ];

    // Cloud particles
    const cloudCount = 600;
    const cloudGeom = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    const cloudColors = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2.5;
      cloudPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      cloudPositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      cloudPositions[i * 3 + 2] = Math.cos(phi) * r * 0.5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      cloudColors[i * 3] = c.r; cloudColors[i * 3 + 1] = c.g; cloudColors[i * 3 + 2] = c.b;
    }
    cloudGeom.setAttribute("position", new THREE.BufferAttribute(cloudPositions, 3));
    cloudGeom.setAttribute("color", new THREE.BufferAttribute(cloudColors, 3));
    const cloudMat = new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, map: circleTex,
      blending: THREE.AdditiveBlending, depthWrite: false,
      transparent: true, opacity: 0.7,
    });
    const cloud = new THREE.Points(cloudGeom, cloudMat);
    scene.add(cloud);

    // Sparkles
    const sCount = 120;
    const sGeom = new THREE.BufferGeometry();
    const sPos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 6;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    sGeom.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      size: 0.04, color: 0xffffff, map: circleTex,
      blending: THREE.AdditiveBlending, depthWrite: false,
      transparent: true, opacity: 0.6,
    });
    const sparkles = new THREE.Points(sGeom, sMat);
    scene.add(sparkles);

    let animId;
    const clock = new THREE.Clock();
    function render() {
      const dt = clock.getDelta();
      cloud.rotation.y += dt * 0.08;
      cloud.rotation.x += dt * 0.03;
      sparkles.rotation.y += dt * 0.25;
      const arr = sparkles.geometry.attributes.position.array;
      for (let i = 0; i < sCount; i++) {
        arr[i * 3 + 1] += dt * 0.35;
        if (arr[i * 3 + 1] > 3.5) arr[i * 3 + 1] = -3.5;
      }
      sparkles.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    }
    render();

    const onResize = () => {
      const rw = window.innerWidth, rh = window.innerHeight;
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      wrapper.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={wrapperRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />;
}