import { useEffect, useRef, useCallback } from "react";

const EvilEye = ({
  eyeColor = "#c305fa",
  intensity = 0.5,
  size = 200,
  pupilSize = 0.35,
  irisDetail = 8,
  glowColor,
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const resolvedGlow = glowColor || eyeColor;

  const getSize = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 200;
    return wrapper.clientWidth || 200;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = getSize();
    const w = s;
    const h = s;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = s * dpr;
    canvas.height = s * dpr;
    canvas.style.width = s + "px";
    canvas.style.height = s + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 8;

    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.08;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.08;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06;

    const dx = currentRef.current.x - cx;
    const dy = currentRef.current.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = radius * 0.22;
    const clampedDist = Math.min(dist, maxOffset);
    const angle = Math.atan2(dy, dx);
    const pupilOffX = dist > 0 ? Math.cos(angle) * clampedDist : 0;
    const pupilOffY = dist > 0 ? Math.sin(angle) * clampedDist : 0;

    ctx.clearRect(0, 0, w, h);

    // Outer glow
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius + 16);
    glowGrad.addColorStop(0, "transparent");
    glowGrad.addColorStop(0.6, resolvedGlow + "22");
    glowGrad.addColorStop(1, resolvedGlow + Math.round(intensity * 80).toString(16).padStart(2, "0"));
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 16, 0, Math.PI * 2);
    ctx.fill();

    // Sclera
    const scleraGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
    scleraGrad.addColorStop(0, "#fafafa");
    scleraGrad.addColorStop(0.7, "#e8e8e8");
    scleraGrad.addColorStop(1, "#c0c0c0");
    ctx.fillStyle = scleraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Iris
    const irisGrad = ctx.createRadialGradient(cx + pupilOffX * 0.3, cy + pupilOffY * 0.3, radius * 0.05, cx, cy, radius * 0.6);
    irisGrad.addColorStop(0, eyeColor);
    irisGrad.addColorStop(0.5, eyeColor + "cc");
    irisGrad.addColorStop(1, eyeColor + "44");
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(cx + pupilOffX * 0.15, cy + pupilOffY * 0.15, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Iris fibers
    for (let i = 0; i < irisDetail * 3; i++) {
      const a = (i / (irisDetail * 3)) * Math.PI * 2;
      ctx.strokeStyle = "rgba(255,255,255," + (0.06 + Math.random() * 0.04) + ")";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx + pupilOffX * 0.15, cy + pupilOffY * 0.15);
      ctx.lineTo(cx + pupilOffX * 0.15 + Math.cos(a) * radius * 0.55, cy + pupilOffY * 0.15 + Math.sin(a) * radius * 0.55);
      ctx.stroke();
    }

    // Inner ring
    const innerRingGrad = ctx.createRadialGradient(cx + pupilOffX * 0.2, cy + pupilOffY * 0.2, radius * 0.12, cx + pupilOffX * 0.2, cy + pupilOffY * 0.2, radius * 0.2);
    innerRingGrad.addColorStop(0, eyeColor);
    innerRingGrad.addColorStop(1, "transparent");
    ctx.fillStyle = innerRingGrad;
    ctx.beginPath();
    ctx.arc(cx + pupilOffX * 0.2, cy + pupilOffY * 0.2, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    const pupilR = radius * pupilSize;
    const px = cx + pupilOffX;
    const py = cy + pupilOffY;
    const pupilGrad = ctx.createRadialGradient(px, py, 0, px, py, pupilR);
    pupilGrad.addColorStop(0, "#000000");
    pupilGrad.addColorStop(0.7, "#0a0a0a");
    pupilGrad.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = pupilGrad;
    ctx.beginPath();
    ctx.arc(px, py, pupilR, 0, Math.PI * 2);
    ctx.fill();

    // Corneal reflections
    const reflX = px - pupilR * 0.5;
    const reflY = py - pupilR * 0.5;
    const reflGrad = ctx.createRadialGradient(reflX, reflY, 0, reflX, reflY, pupilR * 0.35);
    reflGrad.addColorStop(0, "rgba(255,255,255,0.9)");
    reflGrad.addColorStop(0.5, "rgba(255,255,255,0.3)");
    reflGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = reflGrad;
    ctx.beginPath();
    ctx.arc(reflX, reflY, pupilR * 0.35, 0, Math.PI * 2);
    ctx.fill();

    const refl2X = px - pupilR * 0.2;
    const refl2Y = py - pupilR * 0.65;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.arc(refl2X, refl2Y, pupilR * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Eyelid shadow
    const lidGrad = ctx.createLinearGradient(cx, cy - radius, cx, cy);
    lidGrad.addColorStop(0, "rgba(0,0,0,0.25)");
    lidGrad.addColorStop(0.3, "rgba(0,0,0,0.05)");
    lidGrad.addColorStop(1, "transparent");
    ctx.fillStyle = lidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 1.1, Math.PI * 1.9);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();

    rafRef.current = requestAnimationFrame(draw);
  }, [eyeColor, intensity, pupilSize, irisDetail, resolvedGlow, getSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    // Responsive: redraw on resize
    const onResize = () => {};
    const resizeObs = new ResizeObserver(() => {});
    if (wrapperRef.current) resizeObs.observe(wrapperRef.current);
    window.addEventListener("resize", onResize);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", onResize);
      resizeObs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={canvasRef} style={{ display: "block", borderRadius: "50%", pointerEvents: "none", touchAction: "none" }} />
    </div>
  );
};

export default EvilEye;
