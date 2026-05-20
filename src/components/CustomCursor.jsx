import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    document.body.style.cursor = "none";

    let rx = 0, ry = 0;
    let raf;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      }
      rx += (x - rx) * 0.12;
      ry += (y - ry) * 0.12;
    };

    const lerp = () => {
      if (ring.current) {
        ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      }
      raf = requestAnimationFrame(lerp);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(lerp);

    const onEnterLink = () => ring.current?.classList.add("scale-[2.5]", "border-accent");
    const onLeaveLink = () => ring.current?.classList.remove("scale-[2.5]", "border-accent");

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[199] h-10 w-10 rounded-full border border-white/40 transition-[transform,border-color] duration-300"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
