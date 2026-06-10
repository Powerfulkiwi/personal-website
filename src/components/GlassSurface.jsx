/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useId } from "react";
import "./GlassSurface.css";

const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(true);
  const containerRef = useRef(null);
  const feImageRef = useRef(null);
  const redChannelRef = useRef(null);
  const greenChannelRef = useRef(null);
  const blueChannelRef = useRef(null);
  const gaussianBlurRef = useRef(null);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);
    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    if (!feImageRef.current) return;
    feImageRef.current.setAttribute("href", generateDisplacementMap());
  };

  const updateFilters = () => {
    if (redChannelRef.current) {
      redChannelRef.current.setAttribute("scale", String(distortionScale + redOffset));
      redChannelRef.current.setAttribute("xChannelSelector", xChannel);
    }
    if (greenChannelRef.current) {
      greenChannelRef.current.setAttribute("scale", String(distortionScale + greenOffset));
      greenChannelRef.current.setAttribute("yChannelSelector", yChannel);
    }
    if (blueChannelRef.current) {
      blueChannelRef.current.setAttribute("scale", String(distortionScale + blueOffset));
      blueChannelRef.current.setAttribute("xChannelSelector", xChannel);
    }
    if (gaussianBlurRef.current) {
      gaussianBlurRef.current.setAttribute("stdDeviation", String(displace));
    }
  };

  useEffect(() => {
    try {
      updateDisplacementMap();
      updateFilters();
      setSvgSupported(true);
    } catch {
      setSvgSupported(false);
    }
  }, []);

  useEffect(() => {
    updateDisplacementMap();
  }, [borderWidth, brightness, opacity, blur, borderRadius, mixBlendMode]);

  useEffect(() => {
    updateFilters();
  }, [distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, displace]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      updateDisplacementMap();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${svgSupported ? "glass-surface--svg" : "glass-surface--fallback"} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: `${borderRadius}px`,
        "--glass-frost": backgroundOpacity,
        "--glass-saturation": saturation,
        "--filter-id": `url(#${filterId})`,
        ...style,
      }}
      data-glass-id={uniqueId}
    >
      <svg className="glass-surface__filter" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feImage ref={feImageRef} result="map" />
            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>
      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

export default GlassSurface;
