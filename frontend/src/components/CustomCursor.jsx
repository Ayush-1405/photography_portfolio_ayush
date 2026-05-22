import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [cursorType, setCursorType] = useState(null); // null, 'hover', 'play', 'view'

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    document.body.style.cursor = "none";

    let rx = 0, ry = 0;
    let mx = 0, my = 0;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
      }
    };

    const lerp = () => {
      rx += (mx - rx) * 0.06; // Lower factor for more "liquid" trail
      ry += (my - ry) * 0.06;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx - 24}px, ${ry - 24}px)`;
      }
      raf = requestAnimationFrame(lerp);
    };

    const onMouseOver = (e) => {
      const target = e.target.closest("a, button, [data-cursor]");
      if (target) {
        const type = target.getAttribute("data-cursor");
        if (type) {
          setCursorType(type);
        } else {
          setCursorType("hover");
        }
      } else {
        setCursorType(null);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onMouseOver);
    raf = requestAnimationFrame(lerp);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  const getRingClasses = () => {
    const base = "pointer-events-none fixed left-0 top-0 z-[199] h-10 w-10 rounded-full border flex items-center justify-center text-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";
    switch (cursorType) {
      case "play":
      case "view":
        return `${base} scale-[2.5] border-accent bg-accent/5 backdrop-blur-[1px]`;
      case "hover":
        return `${base} scale-[1.5] border-accent bg-transparent`;
      case "drag":
        return `${base} scale-[1.8] border-accent/50 bg-accent/10 border-dashed`;
      default:
        return `${base} scale-100 border-white/10 bg-transparent`;
    }
  };

  const getDotClasses = () => {
    const base = "pointer-events-none fixed left-0 top-0 z-[200] h-1 w-1 rounded-full bg-accent transition-all duration-300";
    if (cursorType === "play" || cursorType === "view") {
      return `${base} scale-0 opacity-0`;
    }
    return `${base} scale-100 opacity-100`;
  };

  return (
    <>
      <div
        ref={dot}
        className={getDotClasses()}
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className={getRingClasses()}
        style={{ 
          willChange: "transform",
        }}
      >
        {(cursorType === "play" || cursorType === "view") && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-accent font-light select-none">
              {cursorType}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
