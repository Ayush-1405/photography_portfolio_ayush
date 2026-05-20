import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { AwardsStrip } from "./components/AwardsStrip";
import { Stats } from "./components/Stats";
import { HorizontalStrip } from "./components/HorizontalStrip";
import { ProjectGrid } from "./components/ProjectGrid";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Loader } from "./components/Loader";
import { CustomCursor } from "./components/CustomCursor";
import { Gallery } from "./components/Gallery";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <CustomCursor />
      <AnimatePresence>{!loaded && <Loader onDone={handleDone} />}</AnimatePresence>

      <div className="min-h-screen bg-ink">
        <Nav />
        <main>
          <Hero />
          <AwardsStrip />
          <Intro />
          <Stats />
          <HorizontalStrip />
          <ProjectGrid />
          <Gallery />
          <Services />
          <Process />
          <Testimonials />
          <Contact />
        </main>
        <footer className="border-t border-white/5 px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-lg text-bone">
              Ayush<span className="text-accent">.</span>Mistry
            </p>
            <p className="font-sans text-xs text-mist">
              © {new Date().getFullYear()} Ayush Mistry — All rights reserved
            </p>
            <div className="flex gap-6 font-sans text-xs uppercase tracking-widest text-mist">
              <a href="https://www.instagram.com/theayushmistry24" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Behance</a>
              <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
