import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { LogoMark } from "../ui/logo";

const socials = [
  { label: "Facebook", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

function BrandIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Facebook: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    "X (Twitter)": (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
    Instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
    YouTube: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      {paths[name]}
    </svg>
  );
}

const explore = [
  { label: "About Us", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Student Life", href: "/student-life" },
  { label: "News & Events", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const quickLinks = [
  { label: "Apply Now", href: "/admissions" },
  { label: "Parent Portal", href: "/login" },
  { label: "Student Portal", href: "/login" },
  { label: "Staff Portal", href: "/login" },
  { label: "Academic Calendar", href: "/academics#calendar" },
];

export function PublicFooter() {
  return (
    <footer className="bg-royal text-white">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="shell flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              Begin your child&apos;s journey with us
            </h2>
            <p className="mt-2 text-royal-300">
              Applications are open. Give your child the gift of a
              knowledge-filled, character-led education.
            </p>
          </div>
          <Link
            href="/admissions"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-[var(--radius-md)] bg-gold px-7 text-base font-semibold text-royal shadow-sm transition-all hover:bg-gold/90 active:scale-[0.98]"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="shell grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <div className="leading-tight">
              <p className="font-display text-lg font-bold">EL-BETH-EL</p>
              <p className="text-xs uppercase tracking-[0.2em] text-royal-300">
                The Kings&apos; School
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-royal-300">
            “Fountain of Knowledge”
          </p>
          <p className="mt-3 max-w-xs text-sm text-royal-300">
            A place where knowledge meets character, excellence meets
            opportunity, and every child is prepared for a brighter future.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <BrandIcon name={s.label} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-royal-300 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm text-royal-300 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-royal-300">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>No 12, Ija Road, Egan, Igando, Lagos</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>0809 876 2044 / 0903 191 7478</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="break-all">vadeyemo24@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-royal-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} EL-BETH-EL The Kings&apos; School. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
