import { useState, useEffect } from "react";
import PillNav from "./components/PillNav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Projects from "./components/Projects";
import Strengths from "./components/Strengths";
import Contact from "./components/Contact";
import GlobalBackground from "./themes/dark/GlobalBackground.jsx";
import LoadingScreen from "./components/LoadingScreen";

if (typeof window !== "undefined") {
  window.__DARK_THEME__ = true;
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Expertise", href: "#strengths" },
  { label: "Contact", href: "#contact" },
];

export default function AppDark() {
  const [loading, setLoading] = useState(true);
  const [activeHref, setActiveHref] = useState("#hero");

  useEffect(() => {
    const onScroll = () => {
      const sections = ["hero", "about", "projects", "strengths", "contact"];
      const viewHeight = window.innerHeight;
      let current = "#hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewHeight * 0.4 && rect.bottom >= viewHeight * 0.1) {
          current = "#" + id;
        }
      }
      if (current === "#hero" && window.scrollY > 100) {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < viewHeight && rect.bottom > 0 && id !== "hero") {
            current = "#" + id;
          }
        }
      }
      setActiveHref(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <GlobalBackground />
      <PillNav
        items={navItems} activeHref={activeHref} baseColor="#040b14"
        pillColor="#c73659" hoveredPillTextColor="#040b14"
        pillTextColor="#edf4fc" initialLoadAnimation={!loading}
      />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  );
}