import { awards } from "../data";

export function AwardsStrip() {
  const repeated = [...awards, ...awards, ...awards, ...awards];

  return (
    <div className="overflow-hidden border-y border-white/5 py-6 sm:py-8">
      <div
        className="flex gap-16 sm:gap-24 whitespace-nowrap animate-marquee"
        style={{ width: "max-content" }}
      >
        {repeated.map((a, i) => (
          <span
            key={i}
            className="font-mono text-[10px] sm:text-xs-mono uppercase text-mist/60 inline-flex items-center gap-6 sm:gap-10 tracking-[0.3em]"
          >
            <span className="text-accent/40 text-[8px] sm:text-[10px]">✦</span>
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
