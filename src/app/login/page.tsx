import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { LogoMark } from "@/components/ui/logo";
import { auth } from "@/lib/auth";
import { getDashboardRoute } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { ArrowLeft, GraduationCap, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the EL-BETH-EL The Kings' School portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(getDashboardRoute(session.user.role));
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-royal p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c6a55c 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <Link href="/" className="relative flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div className="leading-tight">
            <p className="font-display text-lg font-bold">EL-BETH-EL</p>
            <p className="text-xs uppercase tracking-[0.2em] text-royal-300">
The Kings&apos; School
            </p>
          </div>
        </Link>

        <div className="relative max-w-md">
          <p className="font-display text-4xl font-semibold leading-tight">
            Fountain of Knowledge
          </p>
          <p className="mt-4 text-base text-royal-300">
            Sign in to your portal to access academic records, results,
            attendance, and more — all in one secure place.
          </p>
          <div className="mt-8 space-y-3 text-sm text-royal-300">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-gold" />
              Student learning, progress & results
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gold" />
              Parent access to your child&apos;s journey
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-gold" />
              Staff & administration tools
            </div>
          </div>
        </div>

        <p className="relative text-xs text-royal-300">
          © {new Date().getFullYear()} EL-BETH-EL The Kings&apos; School. All
          rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>

          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2.5">
              <LogoMark />
              <div className="leading-tight">
                <p className="font-display text-base font-bold text-ink">
                  EL-BETH-EL
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-ash-500">
                  The Kings&apos; School
                </p>
              </div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Enter your details to continue to your portal.
          </p>

          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
