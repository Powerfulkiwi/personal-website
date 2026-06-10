
import { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const ghostRef = useRef(null);
  const mainRef = useRef(null);
  const itemsRef = useRef(null);

  const timeline = [
    { year: "01", title: "TikTok 跨境电商 · AI 工具落地", period: "2025 – Now", desc: "完整跑通 TikTok 跨境电商全链路：直邮模式、备货模式、店铺运营、广告投放、团队管理、现金流周期。同时主导多个 AI 工作流落地：混剪系统效率提升 300%（日产 3→30 条），批量视频生成自动化，绩效考核周省 3-4 小时。" },
    { year: "02", title: "抖音自媒体运营", period: "2025", desc: "研究算法分发与内容增长策略，积累选题策划→拍摄剪辑→数据分析全链路经验，深度理解内容创作者痛点。" },
    { year: "03", title: "汽车租赁销售 & 哈啰门店店长", period: "2024 – 2025", desc: "从一线销售做到店长，管理5-8人团队，月销30万+，在客户沟通、需求洞察和团队管理中打磨出实战韧性。" },
    { year: "04", title: "嵌入式开发工程师", period: "2022 – 2024", desc: "武汉光庭信息技术 · 汽车 QNX 嵌入式开发。驱动编写、低功耗优化、通信协议（MQTT/Modbus）实现，打下严谨的系统化排障和技术分析底层功底。" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { scrub: 1 };
      gsap.fromTo(ghostRef.current, { y: 60, opacity: 0, scale: 1.04 }, { y: 0, opacity: 0.06, scale: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });
      gsap.fromTo(mainRef.current, { y: 120, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });
      if (itemsRef.current) {
        const cards = gsap.utils.toArray(itemsRef.current.children);
        if (cards.length) cards.forEach((card) => {
          gsap.fromTo(card, { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top bottom-=50", end: "top 50%", ...st } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-bg-holo" style={{ padding: "140px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 80, position: "relative", maxWidth: "1200px", margin: "0 auto 80px" }}>
          <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16, padding: "6px 14px", background: "rgba(233,69,96,0.08)", borderRadius: 4, backdropFilter: "blur(10px)" }}>
            My Journey
          </span>
          <div ref={ghostRef} style={{ position: "absolute", left: 0, top: 46, pointerEvents: "none", userSelect: "none" }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: "1px rgba(129, 140, 248, 0.3)" }}>
              From Engineer<br />to AI Solution Architect
            </h2>
          </div>
          <div ref={mainRef} style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap" }}>
              From Engineer<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to AI Solution Architect
              </span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 650, marginTop: 16, lineHeight: 1.8 }}>
              电子信息科学与技术本科 · 26岁 · 广州/深圳<br />
              工科技术底子 + 一线销售管理 + AI工具实战落地 —— 不可替代的复合能力壁垒。
            </p>
          </div>
        </div>

        <div ref={itemsRef} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 , maxWidth: 1200, margin: "0 auto" }}>
          {timeline.map((item, i) => (
            <BorderGlow key={i} glowColor="345 85 52" backgroundColor="rgba(12,14,24,0.85)" borderRadius={16} glowRadius={60} glowIntensity={1.8} coneSpread={18} colors={["#e94560","#ff6b81","#ff6b81"]} fillOpacity={0.55} edgeSensitivity={18} className="glass-card-wrapper"><div className="glass-card" style={{ padding: "32px" }}>
              <div style={{
                position: "absolute", top: -24, right: -24,
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(233, 69, 96, 0.35), 0 0 0 3px rgba(4,11,20,0.8)",
                zIndex: 2,
              }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>
                  {item.year}
                </span>
              </div>
              <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "2px", fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>{item.period}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
              </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
