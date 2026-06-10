import { useEffect, useRef } from "react";

export default function Marquee() {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const sectionRef = useRef(null);

  const keywords = [
    "AI Workflow", "LLM Integration", "Automation", "TikTok Commerce",
    "Video Generation", "Performance Analytics", "Python", "FFmpeg",
    "GPT API", "Workflow Orchestration", "Prompt Engineering",
    "Cross-border E-commerce", "Content Creation", "Data Visualization",
    "Embedded Systems", "STM32", "RTOS", "IoT",
    "Sales & Communication", "Team Management", "Client Discovery",
  ];

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.25;
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tileStyle = (i) => ({
    flexShrink: 0,
    padding: "6px 18px",
    borderRadius: 20,
    border: "1px solid rgba(233, 69, 96, 0.15)",
    background: "rgba(233, 69, 96, 0.06)",
    color: "var(--text-secondary)",
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: "nowrap",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  });

  const duplicated = [...keywords, ...keywords, ...keywords];

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "32px 0",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
        background: "linear-gradient(180deg, transparent 0%, rgba(4,11,20,0.6) 40%, rgba(4,11,20,0.8) 100%)",
        borderTop: "1px solid rgba(233, 69, 96, 0.06)",
        borderBottom: "1px solid rgba(233, 69, 96, 0.06)",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(233,69,96,0.04) 0%, transparent 70%)",
      }} />
      <div ref={row1Ref} style={{ display: "flex", gap: 10, marginBottom: 10, willChange: "transform", width: "max-content" }}>
        {duplicated.slice(0, duplicated.length / 2).map((k, i) => (
          <span key={i} style={tileStyle(i)}>{k}</span>
        ))}
      </div>
      <div ref={row2Ref} style={{ display: "flex", gap: 10, willChange: "transform", width: "max-content" }}>
        {duplicated.slice(duplicated.length / 2).map((k, i) => (
          <span key={i} style={tileStyle(i + duplicated.length / 2)}>{k}</span>
        ))}
      </div>
    </section>
  );
}