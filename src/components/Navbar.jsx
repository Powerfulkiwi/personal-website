
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Detect which section is in view
      const sections = ["hero", "about", "projects", "strengths", "contact"];
      const viewHeight = window.innerHeight;
      let current = "";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section is "active" when its top is in the upper 40% of viewport
        if (rect.top <= viewHeight * 0.4 && rect.bottom >= viewHeight * 0.1) {
          current = id;
        }
      }
      // Fallback to last visible section
      if (!current) {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < viewHeight && rect.bottom > 0) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle = (id) => ({
    textTransform: "capitalize",
    transition: "var(--transition)",
    color: activeSection === id ? "var(--text-primary)" : "var(--text-secondary)",
    fontWeight: activeSection === id ? 600 : 400,
    position: "relative",
    paddingBottom: 4,
  });

  const linkLabel = (id) =>
    id === "about" ? "About" :
    id === "projects" ? "Projects" :
    id === "strengths" ? "Expertise" :
    id === "contact" ? "Contact" : id;

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "var(--nav-height)", display: "flex", alignItems: "center",
        transition: "var(--transition)",
        background: scrolled ? "rgba(248,247,245,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div style={{
        maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 40px",
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#hero" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
          Vix<span style={{ color: "var(--accent)" }}>.</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14 }}>
          {["about", "projects", "strengths", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              style={linkStyle(id)}
              onMouseEnter={(e) => { if (activeSection !== id) e.target.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (activeSection !== id) e.target.style.color = "var(--text-secondary)"; }}
            >
              {linkLabel(id)}
              {activeSection === id && (
                <span style={{
                  position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
                }} />
              )}
            </a>
          ))}
          <a href="#contact" style={{
            padding: "8px 20px", borderRadius: 20, background: "var(--accent)", color: "#fff",
            fontWeight: 600, fontSize: 13, transition: "var(--transition)",
          }}>
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  );
}
