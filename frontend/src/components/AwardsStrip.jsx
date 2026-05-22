import { awards } from "../data";

export function AwardsStrip() {
  const repeated = [...awards, ...awards, ...awards];

  return (
    <div className="overflow-hidden border-y border-white/5 bg-void py-3">
      <div
        className="flex gap-16 whitespace-nowrap animate-marquee"
        style={{ width: "max-content" }}
      >
        {repeated.map((a, i) => (
          <span
            key={i}
            className="font-mono text-xs-mono uppercase text-mist inline-flex items-center gap-6"
          >
            <span className="text-accent/60">✦</span>
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
