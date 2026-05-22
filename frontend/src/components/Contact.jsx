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
    <section id="contact" ref={sectionRef} className="relative z-10 bg-void px-6 py-20 lg:py-32 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* Left Column: Typography */}
          <div className="lg:col-span-7">
            <p className="contact-header-text font-mono text-xs-mono sm:text-sm-mono uppercase text-accent mb-4 sm:mb-6 tracking-[0.4em] sm:tracking-[0.5em]">Inquiries</p>
            <h2 className="contact-header-text font-display text-5xl sm:text-7xl lg:text-[8vw] text-bone tracking-tighter leading-[0.85] mb-8 sm:mb-10">
              Let's create<br />
              <span className="italic pl-8 sm:pl-32">Magic.</span>
            </h2>
            
            <div className="max-w-md space-y-8 sm:space-y-10">
              <p className="contact-header-text font-sans text-base sm:text-lg text-mist leading-relaxed">
                Currently accepting new commissions for editorial, fashion, and commercial projects. If you have a vision that requires a cinematic eye and high-end execution, I'd love to hear from you.
              </p>
              
              <div className="contact-header-text space-y-4 sm:space-y-5">
                <a 
                  href={`mailto:${YOUR_EMAIL}`}
                  className="block font-display text-2xl sm:text-3xl lg:text-5xl text-bone hover:text-accent transition-colors break-words"
                >
                  {YOUR_EMAIL}
                </a>
                <p className="font-mono text-[10px] sm:text-xs-mono uppercase text-mist tracking-widest">
                  Worldwide Commissions
                </p>
              </div>

              {/* <div className="contact-header-text flex flex-wrap gap-6 sm:gap-10 pt-8 sm:pt-10 border-t border-white/5">
                {["Instagram", "Behance", "LinkedIn"].map((social) => (
                  <a key={social} href="#" className="font-mono text-[10px] sm:text-xs-mono uppercase text-mist hover:text-accent transition-colors tracking-widest">
                    {social}
                  </a>
                ))}
              </div> */}
            </div>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="lg:col-span-5 pt-10 lg:pt-20">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-lg text-bone focus:outline-none focus:border-accent transition-colors placeholder:text-mist/30"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-lg text-bone focus:outline-none focus:border-accent transition-colors placeholder:text-mist/30"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject / Project Type"
                  className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-lg text-bone focus:outline-none focus:border-accent transition-colors placeholder:text-mist/30"
                />
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your vision..."
                  className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-lg text-bone focus:outline-none focus:border-accent transition-colors placeholder:text-mist/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group/btn relative inline-flex items-center gap-8 font-mono text-sm-mono uppercase text-bone overflow-hidden"
              >
                <span>Send Message</span>
                <span className="h-[1px] w-12 bg-accent transition-all duration-500 group-hover/btn:w-24" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
