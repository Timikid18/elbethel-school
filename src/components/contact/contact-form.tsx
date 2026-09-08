"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Enter a subject"),
  message: z.string().trim().min(10, "Message should be at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: ContactInput) {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMsg(
        "We couldn't send your message. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-lg)] border border-border bg-surface p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold text-ink">
          Message sent!
        </h2>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Thank you for reaching out. Our team will get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-lg)] border border-border bg-surface p-8"
    >
      <h2 className="font-display text-xl font-semibold text-ink">
        Send us a message
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        We would love to hear from you. Fill out the form and we will respond promptly.
      </p>

      <div className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name?.message} htmlFor="name">
            <Input id="name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message} htmlFor="phone">
            <Input id="phone" type="tel" invalid={!!errors.phone} {...register("phone")} />
          </Field>
        </div>
        <Field label="Email" required error={errors.email?.message} htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field label="Subject" required error={errors.subject?.message} htmlFor="subject">
          <Input id="subject" invalid={!!errors.subject} {...register("subject")} />
        </Field>
        <Field label="Message" required error={errors.message?.message} htmlFor="message">
          <Textarea
            id="message"
            rows={5}
            invalid={!!errors.message}
            {...register("message")}
          />
        </Field>

        {status === "error" && (
          <div
            role="alert"
            className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={status === "submitting"}
          rightIcon={status !== "submitting" ? <Send className="h-4 w-4" /> : undefined}
          className="w-full sm:w-auto"
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}