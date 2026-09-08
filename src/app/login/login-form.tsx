"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { LogoMark } from "@/components/ui/logo";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [showDemoHint] = React.useState(
    process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true",
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const redirectTo =
    searchParams.get("callbackUrl")?.replace(/^\//, "") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError(
          "We couldn't sign you in. Please check your email and password and try again.",
        );
        setLoading(false);
        return;
      }
      // Route to the portal where the server resolves the role dashboard.
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-[var(--radius)] border border-danger-soft bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Field label="Email address" required htmlFor="email">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-500" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="pl-10"
            required
          />
        </div>
      </Field>

      <Field label="Password" required htmlFor="password">
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-500" />
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="pl-10 pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ash-500 hover:text-ink"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {loading ? "Signing you in…" : "Sign in"}
      </Button>

      {/* Demo hint (hidden in production unless NEXT_PUBLIC_SHOW_DEMO_LOGIN=true) */}
      {showDemoHint && (
        <div className="rounded-[var(--radius)] border border-dashed border-ash-300 bg-ash-100/50 p-3 text-xs text-ink-soft">
          <p className="font-semibold text-ink">Demo accounts</p>
          <p className="mt-1">
            admin@elbethel.edu · teacher@elbethel.edu · student@elbethel.edu ·
            parent@elbethel.edu — password: <code className="rounded bg-ash-200 px-1 py-0.5">Password123!</code>
          </p>
          <p className="mt-1">Your role determines which portal you are taken to.</p>
        </div>
      )}
    </form>
  );
}
