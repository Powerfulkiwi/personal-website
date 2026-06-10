import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./PillNav.css";
import GlassIcons from "./GlassIcons";

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#040b14",
  pillColor = "#c73659",
  hoveredPillTextColor = "#040b14",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  const toggleMobileMenu = () => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (!isMobileMenuOpen) {
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(
        menu,
        { opacity: 0, scaleY: 0.9, y: -8 },
        {
          opacity: 1,
          scaleY: 1,
          y: 0,
          duration: 0.5,
          ease: "power4.out",
        }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        scaleY: 0.9,
        y: -8,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`pill-nav-container ${className}`}
      style={{
        "--base": baseColor,
        "--pill-bg": pillColor,
        "--pill-text": resolvedPillTextColor,
        "--hover-text": hoveredPillTextColor,
        position: "fixed",
        top: "1em",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <nav className="pill-nav">
        {logo && (
          <a href="/" className="pill-logo" ref={logoRef}>
            <img ref={logoImgRef} src={logo} alt={logoAlt} />
          </a>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <GlassIcons
            items={items.map((item) => ({
              label: item.label, href: item.href,
            }))}
            activeHref={activeHref}
          />
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-button mobile-only"
          ref={hamburgerRef}
          onClick={() => {
            toggleMobileMenu();
            onMobileMenuClick?.();
          }}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile popover */}
      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {items.map((item, index) => (
            <li key={item.href || index}>
              <a
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? " is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  gsap.to(mobileMenuRef.current, {
                    opacity: 0,
                    scaleY: 0.9,
                    y: -8,
                    duration: 0.35,
                    ease: "power3.in",
                    onComplete: () => {
                      gsap.set(mobileMenuRef.current, { visibility: "hidden" });
                    },
                  });
                  const href = item.href;
                  if (href?.startsWith("#")) {
                    const el = document.getElementById(href.slice(1));
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
