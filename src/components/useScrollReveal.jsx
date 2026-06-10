import { useEffect, useRef, useState } from "react";

export default function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [exited, setExited] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setExited(false);
        } else if (!entry.isIntersecting && visible) {
          setExited(true);
        }
      },
      { threshold, rootMargin: "-10% 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, visible]);

  return [ref, visible, exited];
}
