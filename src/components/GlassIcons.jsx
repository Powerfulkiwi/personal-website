import "./GlassIcons.css";

const gradientMapping = {
  rose: "linear-gradient(135deg, #c73659, #e94560, #ff6b81)",
};

const GlassIcons = ({ items, className, activeHref }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ""}`}>
      {items.map((item, index) => {
        const isActive = activeHref === item.href;
        return (
          <button
            key={index}
            className={`icon-btn ${item.customClass || ""}${isActive ? " is-active" : ""}`}
            aria-label={item.label}
            type="button"
            onClick={() => {
              if (item.href?.startsWith("#")) {
                const el = document.getElementById(item.href.slice(1));
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span className="icon-btn__back" style={getBackgroundStyle(item.color || "rose")}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__label">{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassIcons;
