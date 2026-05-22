import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const SmoothMedia = memo(({ src, type, poster, title, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { theme } = useTheme();

  const isLightTheme = theme === "bone";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: 0.01, // Trigger as soon as a tiny bit is visible
        rootMargin: "200px" // Start loading/playing before it enters the viewport
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (type === "video" && videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, type]);

  const handleLoaded = () => setLoaded(true);

  return (
    <div 
      ref={containerRef} 
      className={`relative h-full w-full overflow-hidden bg-graphite/10 no-transition ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: loaded ? 1 : 0,
          scale: loaded ? 1 : 1.05
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full"
      >
        {type === "video" ? (
          <video
            ref={videoRef}
            src={isInView ? src : undefined}
            poster={poster}
            className={`h-full w-full object-cover transition-all duration-1000 group-hover:grayscale-0 scale-110 parallax-target ${isLightTheme ? 'grayscale-0' : 'grayscale'}`}
            muted
            loop
            playsInline
            onLoadedData={handleLoaded}
            preload="none" // Don't preload until in view
          />
        ) : (
          <img
            src={src}
            alt={title}
            onLoad={handleLoaded}
            decoding="async" // Decode off-thread
            className={`h-full w-full object-cover transition-all duration-1000 group-hover:grayscale-0 scale-110 parallax-target ${isLightTheme ? 'grayscale-0' : 'grayscale'}`}
            loading="lazy"
          />
        )}
      </motion.div>
      
      {/* Loading Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-graphite/20 animate-pulse" />
      )}
    </div>
  );
});

SmoothMedia.displayName = "SmoothMedia";

export { SmoothMedia };
