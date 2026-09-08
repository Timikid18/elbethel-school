"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { RefreshCw, Plus, Pin, PinOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal, ConfirmationDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  audience: string;
  isPinned: boolean;
  createdAt: Date | string;
  class: { id: string; name: string } | null;
};

export type ClassOption = { id: string; name: string };

const AUDIENCE_TONE: Record<string, "royal" | "golden" | "success" | "warning" | "neutral" | "info" | "danger"> = {
  EVERYONE: "royal",
  STUDENTS: "info",
  PARENTS: "golden",
  TEACHERS: "neutral",
  CLASS: "warning",
};

export function AnnouncementsTable({
  announcements,
  classes,
}: {
  announcements: AnnouncementRow[];
  classes: ClassOption[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<AnnouncementRow | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const defaultForm = { title: "", body: "", audience: "EVERYONE", classId: "", isPinned: false };
  const [form, setForm] = React.useState(defaultForm);

  function setFormField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not create announcement");
      toast({ type: "success", title: "Published", message: form.title });
      setCreateOpen(false);
      setForm(defaultForm);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create announcement");
    } finally {
      setBusy(false);
    }
  }

  async function onTogglePin(a: AnnouncementRow) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !a.isPinned }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast({ type: "success", title: a.isPinned ? "Unpinned" : "Pinned", message: a.title });
      router.refresh();
    } catch {
      toast({ type: "error", title: "Update failed" });
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/announcements/${confirmDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast({ type: "success", title: "Deleted", message: confirmDelete.title });
      setConfirmDelete(null);
      router.refresh();
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err instanceof Error ? err.message : undefined });
      setConfirmDelete(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {announcements.length} announcement{announcements.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            New announcement
          </Button>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink">No announcements yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            Create your first announcement — it will appear on the public news page instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-[var(--radius)] border border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={AUDIENCE_TONE[a.audience] ?? "royal"}>{a.audience}</Badge>
                    {a.class && <Badge tone="neutral">{a.class.name}</Badge>}
                    {a.isPinned && (
                      <Badge tone="golden" dot>Pinned</Badge>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium text-ink">{a.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{a.body}</p>
                  <p className="mt-2 text-xs text-ink-soft">
                    {format(new Date(a.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={a.isPinned ? "Unpin" : "Pin"}
                    disabled={busy}
                    onClick={() => onTogglePin(a)}
                  >
                    {a.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete announcement"
                    disabled={busy}
                    onClick={() => setConfirmDelete(a)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New announcement"
        description="Appears immediately for the selected audience."
        hideClose={busy}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" form="new-announcement-form" loading={busy}>
              Publish
            </Button>
          </>
        }
      >
        <form id="new-announcement-form" onSubmit={onCreate} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          <Field label="Title" required htmlFor="an-title">
            <Input
              id="an-title"
              autoFocus
              required
              value={form.title}
              onChange={(e) => setFormField("title", e.target.value)}
            />
          </Field>
          <Field label="Message" required htmlFor="an-body">
            <Textarea
              id="an-body"
              required
              rows={5}
              value={form.body}
              onChange={(e) => setFormField("body", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Audience" required htmlFor="an-audience">
              <Select
                id="an-audience"
                value={form.audience}
                onChange={(e) => setFormField("audience", e.target.value)}
              >
                <option value="EVERYONE">Everyone (public news page)</option>
                <option value="STUDENTS">All students</option>
                <option value="PARENTS">All parents</option>
                <option value="TEACHERS">All teachers</option>
                <option value="CLASS">A specific class</option>
              </Select>
            </Field>
            {form.audience === "CLASS" ? (
              <Field label="Class" required htmlFor="an-class">
                <Select
                  id="an-class"
                  value={form.classId}
                  onChange={(e) => setFormField("classId", e.target.value)}
                >
                  <option value="">Select a class…</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
            ) : (
              <Field label="Pin to top" hint="Pinned posts appear first on the news page.">
                <label className="flex h-11 items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setFormField("isPinned", e.target.checked)}
                    className="h-4 w-4 accent-royal"
                  />
                  Pin this announcement
                </label>
              </Field>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={onDelete}
        title="Delete announcement"
        message={confirmDelete ? `Delete "${confirmDelete.title}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        loading={busy}
      />
    </div>
  );
}