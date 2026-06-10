
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen({ onComplete }) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 200);
      },
    });

    tl.fromTo(
      textRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    )
    .fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
      "-=0.2"
    )
    .to(lineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.4,
      ease: "power3.in",
      delay: 0.2,
    })
    .to(wrapperRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    }, "-=0.3");
  }, [onComplete]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <span
        ref={textRef}
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "6px",
          textTransform: "uppercase",
          color: "var(--accent)",
          opacity: 0,
          fontFamily: "inherit",
        }}
      >
        Vix
      </span>
      <div
        ref={lineRef}
        style={{
          width: 60,
          height: 2,
          background: "var(--accent)",
          borderRadius: 1,
          opacity: 0.6,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
