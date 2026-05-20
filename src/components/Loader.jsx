import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 300);
          return 100;
        }
        return c + Math.floor(Math.random() * 12) + 4;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-display text-3xl text-bone tracking-tight">
        Ayush<span className="text-accent">.</span>Mistry
      </p>
      <div className="mt-10 w-48 h-px bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-accent"
          animate={{ width: `${Math.min(count, 100)}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>
      <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.35em] text-mist tabular-nums">
        {Math.min(count, 100).toString().padStart(3, "0")}
      </p>
    </motion.div>
  );
}
