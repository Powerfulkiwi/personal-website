import { useEffect, useRef } from "react";
import gsap from "gsap";
import GlassSurface from "./GlassSurface";
import EvilEye from "./EvilEye";
// import HeroBackgroundLight from "./HeroBackground";
// import HeroBackgroundDark from "../themes/dark/HeroBackground.jsx";
// HeroBackground disabled

export default function Hero() {
  const heroRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);
  const ghostRef = useRef(null);
  const portraitElRef = useRef(null);
  const portraitWrapperRef = useRef(null);
  const navRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = portraitElRef.current;
    const wrapper = portraitWrapperRef.current;
    if (!el || !wrapper) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    const handleMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const strengthX = 5;
      const strengthY = 5;
      let tx = dx / strengthX;
      let ty = dy / strengthY;
      const maxDistX = 200;
      const maxDistY = 80;
      tx = Math.max(-maxDistX, Math.min(maxDistX, tx));
      ty = Math.max(-maxDistY, Math.min(maxDistY, ty));
      targetX = tx;
      targetY = ty;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(overlayRef.current, { opacity: 0, duration: 1.2, ease: "power2.inOut" })
      .fromTo(ghostRef.current, { opacity: 0 }, { opacity: 0.06, duration: 1.5, ease: "power4.out" }, "-=0.8")
      .fromTo(portraitElRef.current, { y: 80, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power4.out" }, "-=1.1")
      .fromTo(headingRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }, "-=0.8")
      .fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4");
  }, []);

  return (
    <section ref={heroRef} id="hero" style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div ref={overlayRef} style={{ position: "absolute", inset: 0, background: "#050e1a", zIndex: 10, pointerEvents: "none" }} />
      {/* HeroBackground disabled */}

      <div ref={ghostRef} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", userSelect: "none", zIndex: 0, opacity: 0 }}>
        <h1 style={{ fontSize: "clamp(120px, 22vw, 340px)", fontWeight: 900, letterSpacing: "-10px", lineHeight: 0.8, color: "transparent", WebkitTextStroke: "1px rgba(233, 69, 96, 0.12)", textTransform: "uppercase", whiteSpace: "nowrap" }}>VIX</h1>
      </div>

      <div ref={portraitWrapperRef} style={{ position: "relative", zIndex: 2, marginBottom: 40, padding: 40 }}>
        <div ref={portraitElRef} style={{
          opacity: 0, willChange: "transform",
          position: "relative",
        }}>
          <div style={{ width: "clamp(120px, 28vw, 200px)", aspectRatio: "1" }}><EvilEye eyeColor="#e94560" intensity={0.5} size={"100%"} pupilSize={0.33} irisDetail={10} /></div>
          <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid rgba(233, 69, 96, 0.4)", animation: "avatarRing 3s ease-in-out infinite", pointerEvents: "none" }} />
        </div>
      </div>

      <div ref={headingRef} style={{ position: "relative", zIndex: 2, textAlign: "center", opacity: 0 }}>
        <p style={{ fontSize: 12, letterSpacing: "5px", textTransform: "uppercase", color: "#fff", fontWeight: 600, marginBottom: 16 }}>
          Field Application Engineer
        </p>
        <h1 style={{ fontSize: "clamp(44px, 7vw, 100px)", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.05, marginBottom: 20 }}>
          Bridging AI<br />
          <span style={{ background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            &amp; Human Needs
          </span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.6 }}>
          每一个看似毫不费力的瞬间，都是千锤百炼后的锋芒。&nbsp;&nbsp;—&nbsp;VIX</p>
        <div ref={navRef} style={{ display: "flex", gap: 16, justifyContent: "center", opacity: 0 }}>
          <GlassSurface width={170} height={50} borderRadius={30} backgroundOpacity={0.15} saturation={1.5} blur={10} displace={2} distortionScale={-160}
            style={{ background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 4px 20px rgba(233, 69, 96, 0.3)" }}>
            <a href="#projects" style={{ color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              Explore Work <span>&rarr;</span>
            </a>
          </GlassSurface>
          <GlassSurface width={150} height={50} borderRadius={30} backgroundOpacity={0.1} saturation={1.2} blur={8} displace={2} distortionScale={-140}
            style={{ background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 4px 20px rgba(233, 69, 96, 0.3)" }}>
            <a href="#contact" style={{ color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Contact Me
            </a>
          </GlassSurface>
        </div>
      </div>

      <div ref={scrollRef} style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0 }}>
        <span style={{ color: "#fff", fontSize: 11, letterSpacing: "4px", textTransform: "uppercase", fontWeight: 600, animation: "scrollLine 2s ease-in-out infinite" }}>Scroll</span>
        <div style={{ width: 2, height: 48, borderRadius: 1, background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.4), transparent)", boxShadow: "0 0 12px rgba(255, 255, 255, 0.25)", animation: "scrollLine 2s ease-in-out infinite 0.3s" }} />
      </div>
    </section>
  );
}