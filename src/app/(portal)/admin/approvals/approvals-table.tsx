"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { RefreshCw, Check, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export type ChangeRequestRow = {
  id: string;
  entityType: string;
  actionType: string;
  entityId: string | null;
  payload: unknown;
  summary: string;
  status: string;
  reviewNote: string | null;
  createdAt: Date | string;
  reviewedAt: Date | null | string;
  requester: { id: string; fullName: string; email: string; role: string };
  reviewer: { id: string; fullName: string } | null;
};

const ENTITY_TONE: Record<string, "royal" | "golden" | "success" | "warning" | "neutral" | "info" | "danger"> = {
  ANNOUNCEMENT: "royal",
  CLASS_ANNOUNCEMENT: "info",
  CLASS_ASSIGNMENT: "warning",
  PROFILE: "golden",
  RESULT: "danger",
  STUDENT: "neutral",
  OTHER: "neutral",
};

export function ApprovalsTable({
  requests,
}: {
  requests: ChangeRequestRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [filter, setFilter] = React.useState<"PENDING" | "ALL">("PENDING");
  const [review, setReview] = React.useState<{ request: ChangeRequestRow; action: "approve" | "reject" } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const items = filter === "PENDING" ? requests.filter((r) => r.status === "PENDING") : requests;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!review) return;
    setBusy(true);
    setError("");
    const note = (e.target as HTMLFormElement).note.value as string;
    try {
      const res = await fetch(`/api/change-requests/${review.request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: review.action, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Review failed");
      toast({
        type: "success",
        title: review.action === "approve" ? "Approved" : "Rejected",
        message: review.request.summary,
      });
      setReview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-[var(--radius)] bg-ash-100 p-1">
          {(["PENDING", "ALL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === tab ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab === "PENDING" ? `Pending (${requests.filter((r) => r.status === "PENDING").length})` : "All"}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => router.refresh()} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink">Nothing to review</p>
          <p className="mt-1 text-sm text-ink-soft">
            Teacher submissions will appear here for your approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div key={r.id} className="rounded-[var(--radius)] border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={ENTITY_TONE[r.entityType] ?? "neutral"}>
                      {r.entityType.replaceAll("_", " ")}
                    </Badge>
                    <Badge tone={r.actionType === "DELETE" ? "danger" : "info"}>{r.actionType}</Badge>
                    {r.status === "PENDING" ? (
                      <Badge tone="warning" dot>Pending</Badge>
                    ) : r.status === "APPROVED" ? (
                      <Badge tone="success" dot>Approved</Badge>
                    ) : (
                      <Badge tone="danger" dot>Rejected</Badge>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-ink">{r.summary}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {r.requester.fullName} ({r.requester.role.replace("_", " ")}) ·{" "}
                    {format(new Date(r.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                  {r.status !== "PENDING" && (
                    <p className="mt-1 text-xs text-ink-soft">
                      Reviewed by {r.reviewer?.fullName ?? "—"} on{" "}
                      {r.reviewedAt ? format(new Date(r.reviewedAt), "MMM d, yyyy h:mm a") : "—"}
                      {r.reviewNote ? ` · Note: ${r.reviewNote}` : ""}
                    </p>
                  )}
                </div>
                {r.status === "PENDING" && (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<X className="h-4 w-4" />}
                      onClick={() => {
                        setError("");
                        setReview({ request: r, action: "reject" });
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Check className="h-4 w-4" />}
                      onClick={() => {
                        setError("");
                        setReview({ request: r, action: "approve" });
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>

              <details className="group mt-3">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink">
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  View request details
                </summary>
                <pre className="mt-3 overflow-x-auto rounded-[var(--radius)] bg-ash-100 p-4 text-xs text-ink-soft">
                  {JSON.stringify(r.payload, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!review}
        onClose={() => setReview(null)}
        title={review?.action === "approve" ? "Approve change" : "Reject change"}
        description={review ? review.request.summary : undefined}
        hideClose={busy}
        footer={
          <>
            <Button variant="outline" onClick={() => setReview(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="review-form"
              variant={review?.action === "approve" ? "primary" : "danger"}
              loading={busy}
            >
              {review?.action === "approve" ? "Approve and apply" : "Reject"}
            </Button>
          </>
        }
      >
        <form id="review-form" onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          <Field
            label={review?.action === "approve" ? "Note (optional)" : "Reason (recommended)"}
            htmlFor="review-note"
            hint="This note is saved with the review and visible to the requester's record."
          >
            <Input id="review-note" name="note" autoFocus placeholder="Add a short note…" />
          </Field>
        </form>
      </Modal>
    </div>
  );
}