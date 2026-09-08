"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { RefreshCw } from "lucide-react";

export type ApplicationRow = {
  id: string;
  applicationNo: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | Date | null;
  classApplying: string;
  previousSchool: string | null;
  studentAddress: string | null;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string | null;
  parentOccupation: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  status: string;
  createdAt: string | Date;
};

const STATUS_TONE: Record<string, "royal" | "golden" | "success" | "warning" | "neutral" | "info" | "danger"> = {
  SUBMITTED: "royal",
  UNDER_REVIEW: "golden",
  INTERVIEW: "info",
  ACCEPTED: "success",
  WAITLISTED: "warning",
  REJECTED: "danger",
  ENROLLED: "success",
};

const STATUS_OPTIONS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "INTERVIEW",
  "ENROLLED",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
];

type Credentials = { email: string; password: string };

export function AdmissionsTable({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [credentials, setCredentials] = React.useState<Credentials | null>(null);

  async function onStatusChange(id: string, status: string) {
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      if (data.credentials) setCredentials(data.credentials);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the application status.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {applications.length} application{applications.length === 1 ? "" : "s"}
        </p>
        <Button variant="outline" size="sm" onClick={() => router.refresh()} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Refresh
        </Button>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink">No applications yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            When a visitor submits the public application form, it will show up here instantly.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="py-3 pr-4 font-medium">Application</th>
                <th className="py-3 pr-4 font-medium">Student</th>
                <th className="py-3 pr-4 font-medium">Class</th>
                <th className="py-3 pr-4 font-medium">Parent contact</th>
                <th className="py-3 pr-4 font-medium">Submitted</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="py-3 pr-4 align-top">
                    <span className="font-mono text-xs text-ink">{app.applicationNo}</span>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-ink">{app.firstName} {app.lastName}</p>
                    <p className="text-xs text-ink-soft">{app.gender ?? "—"}</p>
                  </td>
                  <td className="py-3 pr-4 align-top text-ink-soft">{app.classApplying}</td>
                  <td className="py-3 pr-4 align-top">
                    <p className="text-ink">{app.parentFirstName} {app.parentLastName}</p>
                    <p className="text-xs text-ink-soft">{app.parentPhone}</p>
                    {app.parentEmail && <p className="text-xs text-ink-soft">{app.parentEmail}</p>}
                  </td>
                  <td className="py-3 pr-4 align-top text-ink-soft">
                    {format(new Date(app.createdAt), "MMM d, yyyy h:mm a")}
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex items-center gap-1.5">
                      <Badge tone={STATUS_TONE[app.status] ?? "neutral"}>{app.status.replace("_", " ")}</Badge>
                      <Select
                        aria-label={`Change status for ${app.applicationNo}`}
                        value={app.status}
                        disabled={saving === app.id}
                        onChange={(e) => onStatusChange(app.id, e.target.value)}
                        className="ml-1 h-8 w-auto min-w-0"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* One-time login credentials after acceptance */}
      <Modal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        title="Student login credentials"
        description="This student account was created and placed in the class applied for. Share these credentials — they are shown only once."
        footer={
          <Button onClick={() => setCredentials(null)}>Done</Button>
        }
      >
        {credentials && (
          <div className="space-y-4">
            <div className="rounded-[var(--radius)] border border-border bg-ash-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Email</p>
              <p className="mt-1 break-all font-mono text-sm font-medium text-ink">{credentials.email}</p>
            </div>
            <div className="rounded-[var(--radius)] border border-border bg-ash-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Password</p>
              <p className="mt-1 break-all font-mono text-sm font-medium text-ink">{credentials.password}</p>
            </div>
            <p className="text-sm text-ink-soft">
              The student will appear in their form teacher&apos;s roster immediately. You can always reset
              the password later under Users.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}