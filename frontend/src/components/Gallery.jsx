import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lightbox } from "./Lightbox";
import { fetchGallery } from "../api";

const mediaItems = [
  {
    id: "g1",
    type: "video",
    src: "https://drive.google.com/uc?export=download&id=1Ylxt3PEqaz62nezVnDPvaNvjD-V2-dtK",
    span: "tall",
    caption: "Dynamic flow",
  },
  {
    id: "g2",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1Msu62CwmDFcTtk8xZOb54ZD1dcToofUh",
    span: "tall",
    caption: "Urban perspective",
  },
  {
    id: "g3",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1C47pewr8QMAs-Cj6yyPVBUda5eOHM_hS",
    span: "tall",
    caption: "Still life",
  },
  {
    id: "g4",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=143AFsKLLnffyuXCEfcv9Uvr1RLeARy70",
    span: "tall",
    caption: "City lights",
  },
  {
    id: "g5",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1jQPk5v8RkoxIQBINgJOI1oiG-Ey1MrTz",
    span: "tall",
    caption: "Architectural detail",
  },
  {
    id: "g6",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1_ZD9K4jsY6lQ4Qn_0IDPDmD3C2j1jaQI",
    span: "wide",
    caption: "Shadow play",
  },
  {
    id: "g7",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1ijz1ksHgO8ch1Ly7BmC6_epJIHAoLUKY",
    span: "tall",
    caption: "Minimalist frame",
  },
  {
    id: "g8",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1NwrfVCMmTlFdkSRISQvGXPAM6JbcW6S2",
    span: "tall",
    caption: "Horizon line",
  },
  {
    id: "g10",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1bgPj3POi8RxtU61ekOaGefnZTs5F7yyC",
    span: "tall",
    caption: "Reflections",
  },
  {
    id: "g11",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=13HWdVktzIyi3q-wRthFon04A5-eSsB0V",
    span: "tall",
    caption: "Soft focus",
  },
  {
    id: "g12",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1PHBfIDbVol1WzLXEo6enO2SSjk9tYsXw",
    span: "tall",
    caption: "Coastal morning",
  },
  {
    id: "g13",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=19IZHth1KqYT95kx0idE6jOQ3drVLIcdm",
    span: "tall",
    caption: "Abstract geometry",
  },
  {
    id: "g14",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1dELhEU6clw6vZ4_OIZ-jsUfdeCP69Yb2",
    span: "tall",
    caption: "Vertical ascent",
  },
  {
    id: "g15",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1BW0uoPYAwD4L-adiH0e_dunqgMzpTz7D",
    span: "large",
    caption: "Street candid",
  },
  {
    id: "g16",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1JOeYqi9gZzaMDwhGRMTIy8tJovfEVRWZ",
    span: "tall",
    caption: "Industrial rhythm",
  },
  {
    id: "g17",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1ti8crm6oEcDOkQRkw_NGqJyoyuCl86wQ",
    span: "tall",
    caption: "Quiet corner",
  },
  {
    id: "g18",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1IYmHK2-Ac_2rO0QMyCcMiHceYsyvc1B8",
    span: "wide",
    caption: "Vibrant escape",
  },
  {
    id: "g19",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1XrbQnr6ciStgA7uVe9cncx-QQLtcLT1j",
    span: "tall",
    caption: "Summer light",
  },
  {
    id: "g20",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1r6Vorejv3Fe6fpvSPMuyj7jaacWNCXkF",
    span: "tall",
    caption: "Autumn mood",
  },
  {
    id: "g21",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1lPKA_XQ36oCG2l5hPSsKkwKG95IkvpBK",
    span: "tall",
    caption: "Winter stillness",
  },
  {
    id: "g22",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1EQCxwpW-q5vb3MAUR7aQ-RRbiqHqAQh0",
    span: "tall",
    caption: "Dawn break",
  },
  {
    id: "g23",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1_8Em0QVUARfg1L3YRuyzQgxCWfS37FJF",
    span: "tall",
    caption: "Morning dew",
  },
  {
    id: "g24",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1DHEcK5sBDnDDjvWlQy6Nz1Z3QMDW8Cd7",
    span: "tall",
    caption: "Noon sun",
  },
  {
    id: "g25",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1KrzdQhR2z8znXQJexdwNTdLBwo42iER9",
    span: "tall",
    caption: "Afternoon haze",
  },
  {
    id: "g26",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1VfzfCDHl5JOvwYIwnjGyTN5o6iuUX4hn",
    span: "tall",
    caption: "Landscape HDR",
  },
  {
    id: "g27",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1r_E2Oc2phWiB6iI1XNNCqVZUzwLrRl10",
    span: "tall",
    caption: "Mountain peak",
  },
  {
    id: "g28",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1yEmYS1o8pjpRIittdVB5InR_d_EsJhi-",
    span: "tall",
    caption: "Sunset clouds",
  },
  {
    id: "g29",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1Zz_VTZ53i9mU6Qo6tVoNZbBn5ImQ3J2X",
    span: "tall",
    caption: "Twilight hours",
  },
  {
    id: "g30",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1ScJdtcct7sx8xAzWHBFDRkktwHB6rU8l",
    span: "tall",
    caption: "Forest light",
  },
  {
    id: "g31",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=1itNX4SyV2i3Ca1Vestor6EO1EPLmr9Cp",
    span: "tall",
    caption: "Spring bloom",
  },
  {
    id: "g32",
    type: "image",
    src: "https://drive.google.com/uc?export=view&id=12tjENB1xmQhfWHdlNECldZtw6cniiLgG",
    span: "tall",
    caption: "Valley mist",
  },
  {
    id: "g34",
    type: "video",
    src: "https://drive.google.com/uc?export=download&id=15RNcRtFL2zsGYu8oWxXS5Pw7Sb_d8o5X",
    span: "tall",
    caption: "Cinematic sequence",
  },
  {
    id: "g35",
    type: "video",
    src: "/project/the-last-day.mp4",
    span: "tall",
    caption: "The Last Day — Short Film",
  },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

const desktopSpanClass = {
  normal: "md:col-span-1 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
  large: "md:col-span-2 md:row-span-2",
};

const mobileAspect = {
  normal: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  large: "aspect-[4/3]",
};

export function Gallery() {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(null);
  const items = mediaItems;

  useEffect(() => {
    fetchGallery().then((data) => {
      if (data && data.length > 0) setItems(data);
    });
  }, []);

  const shuffledItems = useMemo(() => {
    return [...items].sort(() => Math.random() - 0.5);
  }, [items]);

  return (
    <section id="gallery" className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">
            Gallery
          </p>
          <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">
            Visual archive
          </h2>
          <p className="mt-4 max-w-lg font-sans text-sm text-mist">
            A curated mix of stills and motion — tap any frame to expand.
          </p>
        </motion.div>

        <div
          className={[
            "mt-14 gap-3 sm:gap-4",
            "grid grid-cols-2",
            "md:grid-cols-4 md:auto-rows-[200px] md:[grid-auto-flow:dense]",
          ].join(" ")}
        >
          {shuffledItems.map((item, i) => (
            <motion.div
              key={item.id}
              className={[
                "group relative overflow-hidden rounded-sm bg-graphite cursor-pointer",
                isMobile ? mobileAspect[item.span] : "",
                desktopSpanClass[item.span],
              ].join(" ")}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.04, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() =>
                setActive({
                  src: item.src,
                  type: item.type,
                  poster: item.poster,
                  caption: item.caption,
                })
              }
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="auto"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.caption ?? ""}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 sm:transition-opacity sm:duration-400" />

              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:border-accent/80 group-hover:bg-black/60 transition-all duration-300">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {item.caption && (
                <div
                  className={[
                    "absolute inset-x-0 bottom-0 p-2.5 sm:p-4",
                    "sm:translate-y-2 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:transition-all sm:duration-300",
                    "bg-gradient-to-t from-void/80 to-transparent",
                  ].join(" ")}
                >
                  <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-bone/90 leading-snug line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              )}

              {item.type === "video" && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-bone bg-black/50 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 border border-white/10">
                  Video
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <Lightbox
            src={active.src}
            type={active.type}
            poster={active.poster}
            alt={active.caption}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
