"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { RefreshCw, Upload, Eye, EyeOff, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal, ConfirmationDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { compressImageFile } from "@/lib/image-utils";

export type GalleryImageRow = {
  id: string;
  caption: string;
  alt: string | null;
  dataUrl: string;
  width: number | null;
  height: number | null;
  isPublished: boolean;
  createdAt: Date | string;
};

type PendingUpload = {
  file: File;
  caption: string;
};

export function GalleryTable({ images }: { images: GalleryImageRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [pending, setPending] = React.useState<PendingUpload[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");

  const [editImage, setEditImage] = React.useState<GalleryImageRow | null>(null);
  const [editCaption, setEditCaption] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<GalleryImageRow | null>(null);

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setPending((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
      })),
    ]);
    setUploadError("");
    setUploadOpen(true);
    e.target.value = "";
  }

  async function onUpload() {
    if (pending.length === 0) return;
    setUploading(true);
    setUploadError("");
    const approved: GalleryImageRow[] = [];
    let failed = 0;

    for (const item of pending) {
      const caption = item.caption.trim();
      if (!caption) {
        failed += 1;
        continue;
      }
      try {
        const compressed = await compressImageFile(item.file);
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caption,
            dataUrl: compressed.dataUrl,
            width: compressed.width,
            height: compressed.height,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        approved.push(data.image);
      } catch {
        failed += 1;
      }
    }

    setUploading(false);
    if (approved.length > 0) {
      toast({ type: "success", title: `${approved.length} photo${approved.length === 1 ? "" : "s"} uploaded` });
    }
    if (failed > 0) {
      toast({
        type: "warning",
        title: `${failed} upload${failed === 1 ? "" : "s"} skipped`,
        message: "Fix captions and retry, or compress very large files.",
      });
    }
    setPending([]);
    setUploadOpen(false);
    router.refresh();
  }

  async function onTogglePublish(image: GalleryImageRow) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/gallery/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !image.isPublished }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch {
      toast({ type: "error", title: "Update failed" });
    } finally {
      setBusy(false);
    }
  }

  async function onSaveCaption(e: React.FormEvent) {
    e.preventDefault();
    if (!editImage) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/gallery/${editImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editCaption }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setEditImage(null);
      router.refresh();
    } catch (err) {
      toast({ type: "error", title: "Update failed", message: err instanceof Error ? err.message : undefined });
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/gallery/${confirmDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
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
          {images.length} photo{images.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
            Upload photos
          </Button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFilesSelected} />
        </div>
      </div>

      {images.length === 0 ? (
        <div className="py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink">No photos yet</p>
          <p className="mt-1 text-sm text-ink-soft">Upload your first campus photo to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-[var(--radius)] border border-border">
              <div className="relative aspect-[4/3] bg-royal-100">
                <Image
                  src={image.dataUrl}
                  alt={image.caption}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium text-ink">{image.caption}</p>
                  <Badge tone={image.isPublished ? "success" : "neutral"} dot>
                    {image.isPublished ? "Live" : "Hidden"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  {format(new Date(image.createdAt), "MMM d, yyyy")}
                </p>
                <div className="mt-3 flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setEditImage(image); setEditCaption(image.caption); }}>
                    Edit caption
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onTogglePublish(image)} disabled={busy} aria-label="Toggle visibility">
                    {image.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(image)} disabled={busy} aria-label="Delete photo">
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add photos"
        description={`${pending.length} file${pending.length === 1 ? "" : "s"} selected — review captions then upload.`}
        hideClose={uploading}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={onUpload} loading={uploading} leftIcon={<Upload className="h-4 w-4" />}>
              Upload {pending.length > 0 ? `${pending.length} photo${pending.length === 1 ? "" : "s"}` : ""}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {uploadError && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {uploadError}
            </div>
          )}
          {pending.map((item, i) => (
            <div key={`${item.file.name}-${i}`} className="flex items-center gap-3 rounded-[var(--radius)] border border-border p-3">
              <Input
                className="flex-1"
                value={item.caption}
                onChange={(e) => {
                  setPending((prev) => prev.map((p, idx) => (idx === i ? { ...p, caption: e.target.value } : p)));
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPending((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={uploading}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Modal>

      {/* Edit caption modal */}
      <Modal
        open={!!editImage}
        onClose={() => setEditImage(null)}
        title="Edit caption"
        hideClose={busy}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditImage(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" form="edit-caption-form" loading={busy}>
              Save
            </Button>
          </>
        }
      >
        <form id="edit-caption-form" onSubmit={onSaveCaption} className="space-y-4">
          <Field label="Caption" required htmlFor="ed-caption">
            <Input id="ed-caption" autoFocus required value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
          </Field>
        </form>
      </Modal>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={onDelete}
        title="Delete photo"
        message={confirmDelete ? `Delete "${confirmDelete.caption}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        loading={busy}
      />
    </div>
  );
}