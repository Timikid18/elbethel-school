const items = [
  "Fountain of Knowledge",
  "Learn with Purpose",
  "Lead with Character",
  "Serve with Humility",
  "Excellence in All Things",
  "Every Child a King & Queen",
];

const separators = ["✦", "✎", "★", "✿", "♫", "◆"];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/30 bg-royal py-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-play-sun/10 via-transparent to-play-sky/10" aria-hidden />
      <div className="marquee-track relative flex w-max items-center">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap text-sm font-bold uppercase tracking-[0.26em] text-royal-300"
          >
            <span
              className="px-3 text-lg"
              style={{ color: ["#ffc83d", "#47b6ea", "#ff7a6b", "#2fc39b", "#8b7be8", "#63bd45"][i % 6] }}
              aria-hidden
            >
              {separators[i % separators.length]}
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
