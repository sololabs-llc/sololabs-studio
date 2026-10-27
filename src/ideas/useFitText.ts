import { useLayoutEffect, useRef } from "react";

// Scales an inline-block element's font size so it spans its parent's content width.
export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    const parent = el.parentElement!;
    const fit = () => {
      const cs = getComputedStyle(parent);
      const available =
        parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = "100px";
      el.style.fontSize = `${(100 * available) / el.offsetWidth}px`;
    };
    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return ref;
}
