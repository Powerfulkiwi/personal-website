
import { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Strengths() {
  const sectionRef = useRef(null);
  const ghostRef = useRef(null);
  const mainRef = useRef(null);
  const cardsRef = useRef(null);

  const strengths = [
    {
      num: "01",
      title: "不可替代的复合能力壁垒",
      desc: "工科技术底子（嵌入式 C/RTOS）+ 一线销售管理（客户洞察）+ AI 工具实战落地（工作流搭建），完美契合 AI 售前「技术翻译 + 价值传递」的核心定位。能听懂技术、聊透业务、搞定客户。",
      tags: ["嵌入式开发", "销售管理", "AI 工作流", "客户沟通"],
    },
    {
      num: "02",
      title: "极强的业务落地思维",
      desc: "从需求调研到方案撰写，始终围绕「降本增效、投入产出比」展开。站在客户决策者角度思考，而非堆砌技术术语——这是 AI 售前成单最核心也最难培训的能力。",
      tags: ["需求分析", "ROI 评估", "方案撰写", "商业思维"],
    },
    {
      num: "03",
      title: "AI 技术栈实战能力",
      desc: "大模型 API 调用、Python 自动化脚本、FFmpeg 视频处理、工作流编排（混剪/批量生成/数据抓取）。了解 RAG、向量数据库、微调等概念，持续跟踪 Sora/可灵等前沿技术。",
      tags: ["Python", "LLM API", "FFmpeg", "RAG", "Prompt Engineering"],
    },
    {
      num: "04",
      title: "跨领域适应力与韧性",
      desc: "从技术到销售、从管理到自媒体、从运营到 AI——每次跨界都是主动寻找更大的价值创造空间。基层销售做到店长的经历，证明了项目型岗位最看重的抗压品质。",
      tags: ["跨行业适应", "团队管理", "自驱成长", "抗压韧性"],
    },
    {
      num: "05",
      title: "售前核心实操能力",
      desc: "需求调研 10 问（决策人/预算/时间节点/竞品）、标准 AI 解决方案 8 模块（痛点→架构→案例→报价→风控）。业务敏感度拉满，擅长量化成果表述。",
      tags: ["需求调研", "解决方案架构", "客户演示", "风险管控"],
    },
    {
      num: "06",
      title: "求职动机与远见",
      desc: "对 AI 时代的个人发展有深度思考——不做单一专才，做跨域通才。「趁着年轻拼上限」的心态，远超同年龄段候选人。目标岗位：AI 售前 / FDE，广州或深圳。",
      tags: ["AI 售前", "FDE", "广州/深圳", "腾讯/华为生态"],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { scrub: 1 };
      gsap.fromTo(ghostRef.current, { y: 60, opacity: 0, scale: 1.04 }, { y: 0, opacity: 0.06, scale: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });
      gsap.fromTo(mainRef.current, { y: 120, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: mainRef.current, start: "top bottom-=100", end: "top 45%", ...st } });
      if (cardsRef.current) {
        const cards = gsap.utils.toArray(cardsRef.current.children);
        if (cards.length) cards.forEach((card) => {
          gsap.fromTo(card, { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top bottom-=50", end: "top 50%", ...st } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="strengths" className="section-bg-holo" style={{ padding: "140px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 80, position: "relative", maxWidth: "1200px", margin: "0 auto 80px" }}>
          <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 16, padding: "6px 14px", background: "rgba(233,69,96,0.08)", borderRadius: 4, backdropFilter: "blur(10px)" }}>
            Core Strengths & Skills
          </span>
          <div ref={ghostRef} style={{ position: "absolute", left: 0, top: 46, pointerEvents: "none", userSelect: "none" }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: "1px rgba(192, 132, 252, 0.3)" }}>
              Why I Stand<br />at the Intersection
            </h2>
          </div>
          <div ref={mainRef} style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.15, whiteSpace: "nowrap" }}>
              Why I Stand<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                at the Intersection
              </span>
            </h2>
          </div>
        </div>

        <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 , maxWidth: 1200, margin: "0 auto" }}>
          {strengths.map((s, i) => (
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
                  {s.num}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.tags.map((t) => (
                  <span key={t} style={{ padding: "3px 10px", borderRadius: 16, background: "rgba(233,69,96,0.08)", color: "var(--accent)", fontSize: 11, fontWeight: 500 }}>{t}</span>
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
