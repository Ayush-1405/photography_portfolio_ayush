import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

const YOUR_EMAIL = "ayushmistry1405@gmail.com"; // ← change this

export function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio Inquiry${form.subject ? ` — ${form.subject}` : ""}${form.name ? ` from ${form.name}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Project Type: ${form.subject || "Not specified"}`,
        ``,
        `Message:`,
        form.message,
      ].join("\n"),
    );
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("success");
  };

  return (
    <section id="contact" className="px-4 py-20 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-graphite to-void">
        <div className="grid lg:grid-cols-2">
          {/* ── Left column ── */}
          <div className="p-8 sm:p-10 lg:p-14 border-b border-white/10 lg:border-b-0 lg:border-r">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent">
                Contact
              </p>
              <h2 className="mt-4 font-display text-3xl text-bone sm:text-4xl lg:text-5xl leading-tight">
                Let&apos;s build something cinematic together.
              </h2>
              <p className="mt-5 font-sans text-sm leading-relaxed text-mist">
                Tell me about your timeline, location, and the feeling you want
                the images to carry. I reply within two business days.
              </p>

              <dl className="mt-8 space-y-4 font-sans text-sm">
                <div className="flex items-start gap-3">
                  <dt className="text-[10px] uppercase tracking-widest text-mist w-16 sm:w-20 pt-0.5 shrink-0">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${YOUR_EMAIL}`}
                      className="text-bone hover:text-accent transition-colors break-all"
                    >
                      {YOUR_EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="text-[10px] uppercase tracking-widest text-mist w-16 sm:w-20 pt-0.5 shrink-0">
                    Based in
                  </dt>
                  <dd className="text-bone">Ahmedabad, India</dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="text-[10px] uppercase tracking-widest text-mist w-16 sm:w-20 pt-0.5 shrink-0">
                    Available
                  </dt>
                  <dd className="flex items-center gap-2 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    Open for commissions
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: "Instagram", href: "https://www.instagram.com/theayushmistry24/" },
                  { label: "Behance", href: "#" },
                  { label: "LinkedIn", href: "#" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="font-sans text-[10px] uppercase tracking-widest text-mist border border-white/10 px-4 py-2 hover:text-accent hover:border-accent transition-all duration-300"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right column (Form) ── */}
          <div className="p-8 sm:p-10 lg:p-14 bg-ink/30">
            <AnimatePresence mode="wait">
              {status === "idle" ? (
                <motion.form
                  key="form"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="font-sans text-[10px] uppercase tracking-widest text-mist">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-void border-white/10 px-4 py-3 text-bone font-sans text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-widest text-mist">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-void border-white/10 px-4 py-3 text-bone font-sans text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="font-sans text-[10px] uppercase tracking-widest text-mist">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-void border-white/10 px-4 py-3 text-bone font-sans text-sm focus:border-accent outline-none transition-colors appearance-none"
                    >
                      <option value="">Select service</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Landscape">Landscape & Travel</option>
                      <option value="Portrait">Portrait & Lifestyle</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="font-sans text-[10px] uppercase tracking-widest text-mist">
                      Message
                    </label>
                    <textarea
                      required
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full bg-void border-white/10 px-4 py-3 text-bone font-sans text-sm focus:border-accent outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-3 bg-bone px-8 py-4 font-sans text-xs uppercase tracking-[0.3em] text-void transition-all hover:bg-accent"
                  >
                    Send message
                    <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center text-center p-6"
                >
                  <div className="h-16 w-16 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center mb-6">
                    <span className="text-2xl text-accent">✓</span>
                  </div>
                  <h3 className="font-display text-2xl text-bone">Message prepped.</h3>
                  <p className="mt-3 font-sans text-sm text-mist max-w-xs mx-auto">
                    Your email client should open shortly. If not, feel free to email me directly at {YOUR_EMAIL}.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 font-sans text-[10px] uppercase tracking-widest text-accent hover:text-bone transition-colors"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
