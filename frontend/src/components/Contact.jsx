import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const YOUR_EMAIL = "ayushmistry1405@gmail.com";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-header-text", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
  };

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 px-[var(--content-px-mobile)] lg:px-[var(--content-px)] py-[var(--section-py)] overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Typography */}
          <div className="lg:col-span-6">
            <p className="contact-header-text font-mono text-xs-mono uppercase text-accent mb-4 tracking-[0.4em]">Inquiries</p>
            <h2 className="contact-header-text font-display text-5xl sm:text-7xl lg:text-8xl text-bone tracking-tighter leading-[0.9] mb-10 sm:mb-12">
              Let's create<br />
              <span className="italic pl-8 sm:pl-20 text-accent">Magic.</span>
            </h2>
            
            <div className="max-w-md space-y-8 sm:space-y-12">
              <p className="contact-header-text font-sans text-base sm:text-lg text-mist leading-relaxed opacity-70">
                Currently accepting new commissions for editorial, fashion, and commercial projects. If you have a vision that requires a cinematic eye and high-end execution, I'd love to hear from you.
              </p>
              
              <div className="contact-header-text space-y-4">
                <a 
                  href={`mailto:${YOUR_EMAIL}`}
                  className="block font-display text-2xl sm:text-3xl lg:text-4xl text-bone hover:text-accent transition-all duration-500 break-words tracking-tight"
                >
                  {YOUR_EMAIL}
                </a>
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-6 bg-accent/20" />
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase text-mist/30 tracking-[0.3em]">
                    Worldwide Commissions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="lg:col-span-6 pt-10 lg:pt-16">
            <form onSubmit={handleSubmit} className="space-y-12 lg:space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
                <div className="relative group">
                  <label className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-mist/20 transition-colors group-focus-within:text-accent">01. Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Identify yourself"
                    className="w-full bg-transparent border-b border-white/5 py-4 font-sans text-base text-bone focus:outline-none focus:border-accent/40 transition-all duration-500 placeholder:text-mist/10"
                  />
                </div>
                <div className="relative group">
                  <label className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-mist/20 transition-colors group-focus-within:text-accent">02. Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Where to reach you"
                    className="w-full bg-transparent border-b border-white/5 py-4 font-sans text-base text-bone focus:outline-none focus:border-accent/40 transition-all duration-500 placeholder:text-mist/10"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <label className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-mist/20 transition-colors group-focus-within:text-accent">03. Context</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject / Project Type"
                  className="w-full bg-transparent border-b border-white/5 py-4 font-sans text-base text-bone focus:outline-none focus:border-accent/40 transition-all duration-500 placeholder:text-mist/10"
                />
              </div>

              <div className="relative group">
                <label className="absolute -top-5 left-0 font-mono text-[8px] uppercase tracking-widest text-mist/20 transition-colors group-focus-within:text-accent">04. Vision</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your vision..."
                  className="w-full bg-transparent border-b border-white/5 py-4 font-sans text-base text-bone focus:outline-none focus:border-accent/40 transition-all duration-500 placeholder:text-mist/10 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group/btn relative inline-flex items-center gap-8 font-mono text-[10px] uppercase text-bone overflow-hidden py-3"
              >
                <span className="relative z-10">Initialize Transmission</span>
                <span className="h-[1px] w-8 bg-accent transition-all duration-700 group-hover/btn:w-20" />
                <div className="absolute inset-0 -z-10 bg-accent/5 scale-x-0 origin-left transition-transform duration-700 group-hover/btn:scale-x-100" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
