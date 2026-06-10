
import { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const ghostRef = useRef(null);
  const mainRef = useRef(null);
  const containerRef = useRef(null);

  const projects = [
    {
      num: "01", tag: "AI Workflow", title: "AI 混剪工作流",
      desc: "多段素材 + 文案 → 自动生成多版本短视频。单日产能从 3 条提升至 30 条，效率提升 300%，节省 2 个人力。赋能 TikTok 跨境电商内容矩阵。",
      tech: ["Python", "FFmpeg", "LLM API", "自动化脚本"],
      metric: "效率 ↑ 300%",
      color: "#5c5cf0",
    },
    {
      num: "02", tag: "Automation", title: "批量视频生成系统",
      desc: "基于大模型 API 自动生成脚本、配音、字幕和画面，实现准自动化内容生产流水线。日产能稳定 50+ 条。",
      tech: ["GPT API", "TTS", "视频合成", "工作流编排"],
      metric: "日产 50+ 条",
      color: "#7c6ff0",
    },
    {
      num: "03", tag: "Data & Analytics", title: "绩效考核统计工作流",
      desc: "自动拉取多平台运营数据，生成可视化绩效报表。节省每周 3-4 小时人工统计时间，数据准确率 100%。",
      tech: ["数据抓取", "可视化", "自动化报表", "Python"],
      metric: "周省 3-4h",
      color: "#9b8af0",
    },
    {
      num: "04", tag: "Exploration", title: "AI 视频生成 & 厂商生态探索",
      desc: "跟踪 Sora / 可灵 / 华为盘古 / 腾讯混元等前沿 AI 技术，在实际业务场景中验证可用性。掌握 RAG（检索增强生成）、向量数据库、模型微调等概念。",
      tech: ["Sora", "可灵", "盘古大模型", "混元大模型", "RAG"],
      metric: "厂商生态",
      color: "#b8aef0",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { scrub: 1 };
      gsap.fromTo(ghostRef.current, { y: 60, opacity: 0, scale: 1.04 }, { y: 0, opacity: 0.06, scale: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });
      gsap.fromTo(mainRef.current, { y: 120, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });

      if (containerRef.current) {
        const cards = gsap.utils.toArray(containerRef.current.children);
        if (cards.length) cards.forEach((card) => {
          gsap.set(card, { position: "sticky", top: 32 + 0 * 28, zIndex: 0 });
          gsap.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top bottom-=50", end: "top 55%", ...st } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="section-bg-holo" style={{ padding: "140px 0 200px", background: "var(--bg-primary)" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 80, position: "relative", maxWidth: "1200px", margin: "0 auto 80px" }}>
          <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16, padding: "6px 14px", background: "rgba(233,69,96,0.08)", borderRadius: 4, backdropFilter: "blur(10px)" }}>
            Selected Projects
          </span>
          <div ref={ghostRef} style={{ position: "absolute", left: 0, top: 46, pointerEvents: "none", userSelect: "none" }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: "1px rgba(167, 139, 250, 0.3)" }}>
              What I&apos;ve<br />Built & Shipped
            </h2>
          </div>
          <div ref={mainRef} style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap" }}>
              What I&apos;ve<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Built & Shipped
              </span>
            </h2>
          </div>
        </div>

        <div ref={containerRef} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, position: "relative" , maxWidth: 1200, margin: "0 auto" }}>
          {projects.map((p, i) => (
            <BorderGlow key={i} glowColor="345 85 52" backgroundColor="rgba(12,14,24,0.85)" borderRadius={16} glowRadius={60} glowIntensity={1.8} coneSpread={18} colors={["#e94560","#ff6b81","#ff6b81"]} fillOpacity={0.55} edgeSensitivity={18} className="glass-card-wrapper"><div className="glass-card" style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <div style={{
                    position: "absolute", top: -24, right: -24,
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 24px rgba(233, 69, 96, 0.35), 0 0 0 3px rgba(4,11,20,0.8)",
                    zIndex: 2,
                  }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>
                      {p.num}
                    </span>
                  </div>
                  <div>
                    <span style={{ display: "inline-block", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: p.color, fontWeight: 600, marginBottom: 4 }}>{p.tag}</span>
                    <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>{p.title}</h3>
                  </div>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", padding: "8px 18px", borderRadius: 24,
                  background: "rgba(233,69,96,0.1)", color: "var(--accent)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px",
                  border: "1px solid rgba(92,92,240,0.2)",
                }}>
                  {p.metric}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24, marginTop: 20 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.tech.map((t) => (
                  <span key={t} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(129,140,248,0.06)", backdropFilter: "blur(10px)", color: "var(--text-secondary)", fontSize: 12, border: "1px solid var(--glass-border)" }}>{t}</span>
                ))}
              </div>
            </div>
              </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
