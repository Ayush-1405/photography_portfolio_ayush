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
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
    >
      <div className="overflow-hidden">
        <motion.p 
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="font-display text-4xl text-bone tracking-tighter"
        >
          Ayush<span className="text-accent italic">.</span>Mistry
        </motion.p>
      </div>
      
      <div className="mt-8 flex items-center gap-4">
        <span className="h-[1px] w-12 bg-white/10" />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-mist tabular-nums">
          {Math.min(count, 100).toString().padStart(3, "0")}%
        </p>
        <span className="h-[1px] w-12 bg-white/10" />
      </div>
    </motion.div>
  );
}
