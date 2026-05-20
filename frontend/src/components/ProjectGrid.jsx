import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fetchProjects } from "../api";
import { ScrollReveal } from "./ScrollReveal";
import { Lightbox } from "./Lightbox";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export function ProjectGrid() {
  const reduce = useReducedMotion();
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        if (data && Array.isArray(data)) setProjects(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const projectKey = (p) => p._id || p.id;
  const driveLink = "https://drive.google.com/drive/folders/19LcsP9ay1-SMdxQ4jfXTnaMJpuBjgJwj";

  const DriveButton = ({ large = false }) => (
    <motion.a
      href={driveLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center gap-3 ${
        large ? "py-6 text-sm" : "py-5 text-[10px]"
      } bg-accent text-void font-sans uppercase tracking-[0.3em] hover:bg-white transition-colors duration-300 rounded-sm sm:w-auto sm:px-12`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      View All Projects
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </motion.a>
  );

  return (
    <section id="work" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <ScrollReveal>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">Projects</p>
        <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">Recent work</h2>
        <p className="mt-4 max-w-lg font-sans text-sm text-mist">
          Commissions and personal series — click any image to expand.
        </p>
      </ScrollReveal>

      {/* ── Loading skeleton ── */}
      {loading ? (
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm bg-graphite overflow-hidden animate-pulse">
              <div className="aspect-[4/3] sm:aspect-[16/11] bg-white/5" />
              <div className="p-6 space-y-3">
                <div className="h-2 bg-white/5 rounded w-1/3" />
                <div className="h-5 bg-white/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-6xl justify-center py-20">
          <DriveButton large />
        </div>
      ) : (
        <>
          <motion.ul
            className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:gap-8"
            variants={reduce ? undefined : container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {projects.map((p) => (
              <motion.li
                key={projectKey(p)}
                variants={reduce ? undefined : itemVariant}
                className="group relative overflow-hidden rounded-sm bg-graphite cursor-pointer"
                onClick={() => setActiveProject({ src: p.src, type: p.type, poster: p.poster })}
              >
                <div className="aspect-[4/3] sm:aspect-[16/11] relative">
                  {p.type === "video" ? (
                    <video
                      src={p.src}
                      poster={p.poster || undefined}
                      className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <motion.img
                      src={p.src}
                      alt={p.title || ""}
                      className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                      loading="lazy"
                      whileHover={reduce ? undefined : { scale: 1.04 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}

                  {p.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:border-accent/80 group-hover:bg-black/60 transition-all duration-300">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-90" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-accent/90">
                    {p.category} · {p.year}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-bone sm:text-3xl">{p.title}</h3>
                  <p className="mt-2 max-w-md font-sans text-sm text-mist opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {p.description}
                  </p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-sans text-[9px] uppercase tracking-widest text-bone bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                    {p.type === "video" ? "Play" : "View"}
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <div className="mx-auto mt-20 flex max-w-6xl justify-center">
            <DriveButton />
          </div>
        </>
      )}

      {/* Wrapping the Lightbox properly so unmounting animations execute */}
      <AnimatePresence>
        {activeProject && (
          <Lightbox
            src={activeProject.src}
            type={activeProject.type}
            poster={activeProject.poster}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}