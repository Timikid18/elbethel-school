"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

export function AnnouncementForm({ classes }: { classes: { id: string; name: string }[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [classId, setClassId] = React.useState(classes[0]?.id ?? "");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [isPinned, setIsPinned] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/change-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "CLASS_ANNOUNCEMENT",
          actionType: "CREATE",
          summary: `Announcement for ${classes.find((c) => c.id === classId)?.name ?? "class"}: ${title}`,
          payload: { title, body, classId, isPinned },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not submit");
      toast({
        type: "success",
        title: "Submitted for approval",
        message: "An administrator will review your announcement shortly.",
      });
      setTitle("");
      setBody("");
      setIsPinned(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      <Field label="Class" required htmlFor="tc-class">
        <Select id="tc-class" value={classId} onChange={(e) => setClassId(e.target.value)} disabled={classes.length === 0}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </Field>
      <Field label="Title" required htmlFor="tc-title">
        <Input
          id="tc-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Homework for Monday"
        />
      </Field>
      <Field label="Message" required htmlFor="tc-body">
        <Textarea
          id="tc-body"
          required
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the class announcement…"
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="h-4 w-4 accent-royal"
        />
        Pin to top of the class feed
      </label>
      <Button type="submit" loading={busy} className="w-full sm:w-auto">
        Submit for approval
      </Button>
    </form>
  );
}