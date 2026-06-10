import { useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import GlassSurface from './GlassSurface';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const ghostRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    let animId;
    const particles = [];
    const count = 50;
    const resize = () => { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; };
    resize();
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.3, opacity: Math.random() * 0.35 + 0.05, hue: [192, 196, 200][Math.floor(Math.random() * 3)] });
    }
    function draw() {
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1; ctx2d.beginPath(); ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx2d.fillStyle = `hsla(${p.hue}, 85%, 70%, ${p.opacity})`; ctx2d.fill(); });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { scrub: 1 };
      gsap.fromTo(ghostRef.current, { y: 60, opacity: 0, scale: 1.04 }, { y: 0, opacity: 0.06, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top 35%', ...st } });
      gsap.fromTo(mainRef.current, { y: 80, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top 35%', ...st } });
      gsap.fromTo(contentRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top 35%', ...st } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section-bg-holo" style={{ position: "relative", minHeight: "100vh", padding: "100px 0", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--border)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}><canvas ref={canvasRef} style={{ display: "block" }} /></div>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 700, padding: "0 40px" }}>
        <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 24, padding: "6px 14px", background: "rgba(233, 69, 96, 0.1)", borderRadius: 4, backdropFilter: "blur(10px)" }}>
          Let&apos;s Connect
        </span>
        <div style={{ position: "relative", marginBottom: 24 }}>
          <div ref={ghostRef} style={{ position: "absolute", left: 0, top: 0, width: "100%", pointerEvents: "none", userSelect: "none" }}>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-2.5px", lineHeight: 1.1, color: "transparent", WebkitTextStroke: "1px rgba(233, 69, 96, 0.35)" }}>
              Ready to build<br />something great?
            </h2>
          </div>
          <div ref={mainRef} style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-2.5px", lineHeight: 1.1 }}>
              Ready to build<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>something great?</span>
            </h2>
          </div>
        </div>

        <div ref={contentRef}>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 48 }}>能听懂技术、聊透业务、搞定客户 —— 如果你在找这样的 AI 售前/FDE 工程师，<br />欢迎联系。目标岗位：AI 售前 / FDE，广州或深圳，可接受出差。</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <GlassSurface width={200} height={56} borderRadius={30} backgroundOpacity={0.15} saturation={1.5} blur={10} displace={2} distortionScale={-160}
              style={{ background: "linear-gradient(135deg, #c73659 0%, #e94560 50%, #ff6b81 100%)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 4px 20px rgba(233, 69, 96, 0.3)" }}>
              <a href="mailto:1004825282@qq.com" style={{ color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                Send Email <span>&rarr;</span>
              </a>
            </GlassSurface>
          </div>
          
        {/* Testimonials */}
        <div style={{ marginTop: 64, marginBottom: 48 }}>
          <span style={{ display: "inline-block", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600, marginBottom: 32, padding: "6px 14px", background: "rgba(233, 69, 96, 0.1)", borderRadius: 4, backdropFilter: "blur(10px)" }}>
            What People Say
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: "1200px", margin: "0 auto" }}>
            {[
              {
                text: "Vix 在光庭信息做汽车 QNX 嵌入式开发的时候就展现了很强的系统化思维——驱动编写、低功耗优化、协议实现都做得很扎实。后来他跨界做销售、做管理、做跨境电商 AI 工具，每一次转身都很快。底层技术功底加上跨域适应力，这样的人不多见。",
                name: "前上司 · 武汉光庭信息技术 蔡总",
              },
              {
                text: "Vix 在机场门店做店长的第一年，运营的加盟商 GMV 位列全国第 2 名。从一线销售到管理岗只用了一年时间。这种快速成长能力，加上对客户需求的精准判断，放在哪个行业都是稀缺的。",
                name: "前上司 · 哈啰租车区域经理 朱鹏",
              },
              {
                text: "Vix 跟着我从零完整跑通了 TikTok 跨境电商全链路——直邮模式、备货模式、店铺运营、广告投放、团队管理、现金流周期。他不仅学得快，还在每个环节主动找提效点：自己搭工具把视频日产出从 3 条拉到了 30 条。既懂业务全貌又能用技术落地，执行力极强。",
                name: "前上司 · TikTok 跨境电商总经理 谢总",
              },
            ].map((t, i) => (
              <BorderGlow key={i} glowColor="345 85 52" backgroundColor="rgba(4,20,40,0.85)" borderRadius={16} glowRadius={60} glowIntensity={1.8} coneSpread={18} colors={["#c73659","#ff6b81","#e94560"]} fillOpacity={0.55} edgeSensitivity={18} className="glass-card-wrapper"><div className="glass-card" style={{ padding: "32px" }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.5px" }}>
                  {t.name}
                </div>
              </div>
                </BorderGlow>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 80, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: 14, color: "var(--text-tertiary)" }}>
            <span>邮箱：1004825282@qq.com</span><span style={{ color: "var(--border-light)" }}>·</span><span>广州 / 深圳</span><span style={{ color: "var(--border-light)" }}>·</span><span>电话：18986301884</span>
          </div>
          <p style={{ marginTop: 60, fontSize: 12, color: "var(--text-tertiary)" }}>© 2026 Vix. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
