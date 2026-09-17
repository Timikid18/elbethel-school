/** Derive the school division from a class display name (e.g. "Grade 3"). */
export function inferDivision(className: string): string {
  const upper = className.toUpperCase();
  if (/JSS|SSS|SENIOR|JUNIOR/.test(upper)) return "Secondary";
  if (/NURSERY|PRE/i.test(className)) return "EarlyYears";
  return "Primary";
}