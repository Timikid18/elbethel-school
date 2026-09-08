"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound, GraduationCap, HeartHandshake, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  applicationSchema,
  classOptions,
  divisionGroups,
  type ApplicationInput,
} from "@/lib/admission-schema";
import { cn } from "@/lib/utils";

const genderOptions = ["Male", "Female"];

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border pb-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="text-sm text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}

export function ApplicationForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [applicationNo, setApplicationNo] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: ApplicationInput) {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admissions", {
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
      setApplicationNo(result.applicationNo);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMsg(
        "We couldn't submit your application. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-border bg-surface p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-semibold text-ink">
          Application submitted!
        </h2>
        <p className="mt-2 text-ink-soft">
          Thank you for applying to EL-BETH-EL The Kings&apos; School. Please
          keep your application reference safe:
        </p>
        <p className="mt-4 inline-block rounded-[var(--radius)] bg-royal-100 px-5 py-2 font-mono text-lg font-semibold tracking-wide text-royal-700">
          {applicationNo}
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          Our admissions team will contact you shortly to schedule your
          child&apos;s assessment.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-[var(--radius)] border border-ash-400 bg-surface px-5 text-sm font-medium text-ink transition-colors hover:bg-ash-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-lg)] border border-border bg-surface"
    >
      <div className="border-b border-border bg-ash-100/60 px-8 py-6">
        <h2 className="font-display text-xl font-semibold text-ink">
          Admission Application Form
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Fields marked <span className="text-danger">*</span> are required.
        </p>
      </div>

      <div className="space-y-10 px-8 py-8">
        {/* Student information */}
        <section className="space-y-5">
          <SectionHeading
            icon={UserRound}
            title="Student Information"
            subtitle="Details about the child you are enrolling"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" required error={errors.firstName?.message} htmlFor="firstName">
              <Input
                id="firstName"
                autoComplete="given-name"
                invalid={!!errors.firstName}
                {...register("firstName")}
              />
            </Field>
            <Field label="Last name" required error={errors.lastName?.message} htmlFor="lastName">
              <Input
                id="lastName"
                autoComplete="family-name"
                invalid={!!errors.lastName}
                {...register("lastName")}
              />
            </Field>
            <Field label="Gender" required error={errors.gender?.message} htmlFor="gender">
              <Select id="gender" invalid={!!errors.gender} defaultValue="" {...register("gender")}>
                <option value="" disabled>
                  Select gender
                </option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date of birth" required error={errors.dateOfBirth?.message} htmlFor="dateOfBirth">
              <Input
                id="dateOfBirth"
                type="date"
                invalid={!!errors.dateOfBirth}
                {...register("dateOfBirth")}
              />
            </Field>
            <Field
              label="Previous school (if any)"
              hint="Leave blank for new entrants"
              error={errors.previousSchool?.message}
              htmlFor="previousSchool"
              className="sm:col-span-2"
            >
              <Input
                id="previousSchool"
                invalid={!!errors.previousSchool}
                {...register("previousSchool")}
              />
            </Field>
            <Field
              label="Home address"
              hint="Optional"
              error={errors.studentAddress?.message}
              htmlFor="studentAddress"
              className="sm:col-span-2"
            >
              <Textarea
                id="studentAddress"
                rows={3}
                invalid={!!errors.studentAddress}
                {...register("studentAddress")}
              />
            </Field>
          </div>
        </section>

        {/* Class of interest */}
        <section className="space-y-5">
          <SectionHeading
            icon={GraduationCap}
            title="Class of Interest"
            subtitle="Select the class for which this application is made"
          />
          <Field
            label="Applying for class"
            required
            hint="Grouped by Early Years, Primary and Secondary"
            error={errors.classApplying?.message}
            htmlFor="classApplying"
          >
            <Select id="classApplying" invalid={!!errors.classApplying} defaultValue="" {...register("classApplying")}>
              <option value="" disabled>
                Select a class
              </option>
              {divisionGroups.map((group) => (
                <optgroup key={group} label={group}>
                  {classOptions
                    .filter((c) => c.group === group)
                    .map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.value}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Select>
          </Field>
        </section>

        {/* Parent / guardian */}
        <section className="space-y-5">
          <SectionHeading
            icon={HeartHandshake}
            title="Parent / Guardian"
            subtitle="Primary contact for this application"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" required error={errors.parentFirstName?.message} htmlFor="parentFirstName">
              <Input
                id="parentFirstName"
                invalid={!!errors.parentFirstName}
                {...register("parentFirstName")}
              />
            </Field>
            <Field label="Last name" required error={errors.parentLastName?.message} htmlFor="parentLastName">
              <Input
                id="parentLastName"
                invalid={!!errors.parentLastName}
                {...register("parentLastName")}
              />
            </Field>
            <Field label="Phone number" required error={errors.parentPhone?.message} htmlFor="parentPhone">
              <Input
                id="parentPhone"
                type="tel"
                placeholder="e.g. 0803 000 0000"
                invalid={!!errors.parentPhone}
                {...register("parentPhone")}
              />
            </Field>
            <Field
              label="Email (optional)"
              error={errors.parentEmail?.message}
              htmlFor="parentEmail"
            >
              <Input
                id="parentEmail"
                type="email"
                placeholder="you@example.com"
                invalid={!!errors.parentEmail}
                {...register("parentEmail")}
              />
            </Field>
            <Field
              label="Occupation (optional)"
              error={errors.parentOccupation?.message}
              htmlFor="parentOccupation"
            >
              <Input
                id="parentOccupation"
                invalid={!!errors.parentOccupation}
                {...register("parentOccupation")}
              />
            </Field>
          </div>
        </section>

        {/* Emergency contact */}
        <section className="space-y-5">
          <SectionHeading
            icon={Phone}
            title="Emergency Contact"
            subtitle="Someone else the school can reach in an emergency (optional)"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              error={errors.emergencyContactName?.message}
              htmlFor="emergencyContactName"
            >
              <Input
                id="emergencyContactName"
                invalid={!!errors.emergencyContactName}
                {...register("emergencyContactName")}
              />
            </Field>
            <Field
              label="Phone number"
              error={errors.emergencyContactPhone?.message}
              htmlFor="emergencyContactPhone"
            >
              <Input
                id="emergencyContactPhone"
                type="tel"
                invalid={!!errors.emergencyContactPhone}
                {...register("emergencyContactPhone")}
              />
            </Field>
          </div>
        </section>

        {status === "error" && (
          <div
            role="alert"
            className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-ash-500">
            By submitting, you agree to be contacted by the school regarding this application.
          </p>
          <Button
            type="submit"
            size="lg"
            loading={status === "submitting"}
            className={cn("w-full sm:w-auto")}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </form>
  );
}