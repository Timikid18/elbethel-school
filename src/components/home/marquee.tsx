const items = [
  "Fountain of Knowledge",
  "Learn with Purpose",
  "Lead with Character",
  "Serve with Humility",
  "Excellence in All Things",
  "Every Child a King & Queen",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/25 bg-royal py-5">
      <div className="marquee-track flex w-max items-center">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-medium uppercase tracking-[0.28em] text-royal-300"
          >
            <span className="px-4 text-gold" aria-hidden>
              ✦
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}