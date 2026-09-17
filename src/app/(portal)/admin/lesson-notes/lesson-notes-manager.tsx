"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Upload, Trash2, FileText, Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal, ConfirmationDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { LessonNoteRow } from "./page";

type PendingUpload = {
  file: File;
  className: string;
  subject: string;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function LessonNotesManager({
  notes,
  classNames,
}: {
  notes: LessonNoteRow[];
  classNames: string[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [pending, setPending] = React.useState<PendingUpload | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState<LessonNoteRow | null>(null);
  const [busy, setBusy] = React.useState(false);

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = Array.from(e.target.files ?? []).find((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
    if (!file) {
      toast({ type: "warning", title: "Please choose a PDF file" });
      return;
    }
    setPending({ file, className: classNames[0] ?? "", subject: file.name.replace(/\.pdf$/i, "").trim() });
    setUploadError("");
    setUploadOpen(true);
    e.target.value = "";
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const className = pending.className.trim();
    const subject = pending.subject.trim();
    if (!className || !subject) {
      setUploadError("Class and subject are required.");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", pending.file);
      body.append("className", className);
      body.append("subject", subject);

      const res = await fetch("/api/lesson-notes", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      toast({ type: "success", title: "Lesson note uploaded" });
      setPending(null);
      setUploadOpen(false);
      router.refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/lesson-notes/${confirmDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast({ type: "success", title: "Lesson note deleted" });
      setConfirmDelete(null);
      router.refresh();
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err instanceof Error ? err.message : undefined });
      setConfirmDelete(null);
    } finally {
      setBusy(false);
    }
  }

  const grouped = React.useMemo(() => {
    const map = new Map<string, LessonNoteRow[]>();
    for (const note of notes) {
      const list = map.get(note.className) ?? [];
      list.push(note);
      map.set(note.className, list);
    }
    return Array.from(map.entries());
  }, [notes]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {notes.length} lesson note{notes.length === 1 ? "" : "s"} across {grouped.length} class
          {grouped.length === 1 ? "" : "es"}
        </p>
        <Button size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
          Upload PDF
        </Button>
        <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFileSelected} />
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center">
              <FileText className="mx-auto h-10 w-10 text-ash-500" />
              <p className="mt-3 font-display text-lg font-semibold text-ink">No lesson notes yet</p>
              <p className="mt-1 text-sm text-ink-soft">Upload the first note to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([className, items]) => (
            <Card key={className}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <p className="font-display text-sm font-semibold text-ink">{className}</p>
                  <Badge tone="neutral">{items.length} file{items.length === 1 ? "" : "s"}</Badge>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((note) => (
                    <li key={note.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-danger-soft text-danger">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{note.subject}</p>
                        <p className="truncate text-xs text-ink-soft">
                          {note.fileName} · {formatSize(note.fileSize)}
                        </p>
                      </div>
                      <div className="hidden shrink-0 text-right text-xs text-ink-soft sm:block">
                        <p>{format(new Date(note.createdAt), "MMM d, yyyy")}</p>
                        <p>{note.uploadedBy?.fullName ?? "Imported"}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <ButtonLink
                          variant="outline"
                          size="icon"
                          href={`/api/lesson-notes/${note.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open PDF"
                        >
                          <Download className="h-4 w-4" />
                        </ButtonLink>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setConfirmDelete(note)}
                          disabled={busy}
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload lesson note"
        description={pending ? `Attach "${pending.file.name}" to a class.` : undefined}
        hideClose={uploading}
        footer={
          <>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" form="lesson-note-upload-form" loading={uploading} leftIcon={<Upload className="h-4 w-4" />}>
              Upload
            </Button>
          </>
        }
      >
        {pending && (
          <form id="lesson-note-upload-form" onSubmit={onUpload} className="space-y-4">
            {uploadError && (
              <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
                {uploadError}
              </div>
            )}
            <Field label="File" required>
              <div className="flex items-center gap-3 rounded-[var(--radius)] border border-border p-3">
                <FileText className="h-4 w-4 shrink-0 text-ink-soft" />
                <p className="min-w-0 flex-1 truncate text-sm text-ink">{pending.file.name}</p>
                <Button variant="ghost" size="icon" onClick={() => setPending(null)} disabled={uploading} aria-label="Remove file">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Field>
            <Field label="Class" required htmlFor="ln-class">
              <Select
                id="ln-class"
                required
                value={pending.className}
                onChange={(e) => setPending((prev) => (prev ? { ...prev, className: e.target.value } : prev))}
              >
                {classNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Subject" required htmlFor="ln-subject">
              <Input
                id="ln-subject"
                required
                placeholder="e.g. Mathematics"
                value={pending.subject}
                onChange={(e) => setPending((prev) => (prev ? { ...prev, subject: e.target.value } : prev))}
              />
            </Field>
          </form>
        )}
      </Modal>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={onDelete}
        title="Delete lesson note"
        message={confirmDelete ? `Delete "${confirmDelete.subject}" for ${confirmDelete.className}? This cannot be undone.` : ""}
        confirmLabel="Delete"
        loading={busy}
      />
    </div>
  );
}