"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  RefreshCw,
  Plus,
  KeyRound,
  UserX,
  UserCheck,
  Eye,
  EyeOff,
  Wand2,
  GraduationCap,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal, ConfirmationDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export type UserRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date | string;
};

export type ClassOption = { id: string; name: string };

const ROLE_TONE: Record<string, "royal" | "golden" | "success" | "warning" | "neutral" | "info" | "danger"> = {
  SUPER_ADMIN: "danger",
  ADMIN: "royal",
  TEACHER: "info",
  PARENT: "golden",
  STUDENT: "neutral",
};

const STATUS_TONE: Record<string, "success" | "neutral" | "danger" | "warning"> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  SUSPENDED: "danger",
};

function generatePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${out}!`;
}

export function UsersTable({
  users,
  currentUserId,
  classes,
}: {
  users: UserRow[];
  currentUserId: string;
  classes: ClassOption[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [resetUser, setResetUser] = React.useState<UserRow | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<UserRow | null>(null);
  const [classTeacher, setClassTeacher] = React.useState<UserRow | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const [newUser, setNewUser] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    role: "STUDENT",
    classId: "",
    password: generatePassword(),
    showPassword: true,
  });
  const [resetPassword, setResetPassword] = React.useState(generatePassword());

  function setForm<K extends keyof typeof newUser>(key: K, value: (typeof newUser)[K]) {
    setNewUser((prev) => ({ ...prev, [key]: value }));
  }

  function regeneratePassword() {
    setNewUser((prev) => ({ ...prev, password: generatePassword() }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          password: newUser.password,
          classId: newUser.classId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create account");
      toast({ type: "success", title: "Account created", message: data.user.fullName });
      setCreateOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setBusy(false);
    }
  }

  async function onToggleStatus(user: UserRow) {
    const next = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      toast({
        type: "success",
        title: next === "ACTIVE" ? "Account activated" : "Account suspended",
        message: user.fullName,
      });
      router.refresh();
    } catch (err) {
      toast({ type: "error", title: "Update failed", message: err instanceof Error ? err.message : undefined });
    } finally {
      setBusy(false);
    }
  }

  async function onResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetUser) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${resetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Password reset failed");
      toast({ type: "success", title: "Password reset", message: `New password set for ${resetUser.email}` });
      setResetUser(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${confirmDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast({ type: "success", title: "Account deleted", message: confirmDelete.fullName });
      setConfirmDelete(null);
      router.refresh();
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err instanceof Error ? err.message : undefined });
      setConfirmDelete(null);
    } finally {
      setBusy(false);
    }
  }

  const [selectedClasses, setSelectedClasses] = React.useState<string[]>([]);

  function openClassTeacherModal(teacher: UserRow) {
    setError("");
    setClassTeacher(teacher);
    setSelectedClasses([]);
    setBusy(false);
  }

  function toggleClass(id: string) {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function onSaveClasses() {
    if (!classTeacher) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${classTeacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classIds: selectedClasses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      toast({
        type: "success",
        title: "Classes updated",
        message: `${classTeacher.fullName} is now form teacher of ${selectedClasses.length} class${selectedClasses.length === 1 ? "" : "es"}.`,
      });
      setClassTeacher(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update classes");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {users.length} account{users.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setNewUser((prev) => ({ ...prev, password: generatePassword(), showPassword: true }));
              setError("");
              setCreateOpen(true);
            }}
          >
            Create account
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="py-14 text-center">
          <p className="font-display text-lg font-semibold text-ink">No accounts yet</p>
          <p className="mt-1 text-sm text-ink-soft">Create your first account to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Created</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-ink">{user.fullName}</p>
                    {user.phone && <p className="text-xs text-ink-soft">{user.phone}</p>}
                  </td>
                  <td className="py-3 pr-4 align-top text-ink-soft">{user.email}</td>
                  <td className="py-3 pr-4 align-top">
                    <Badge tone={ROLE_TONE[user.role] ?? "neutral"}>{user.role.replace("_", " ")}</Badge>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <Badge tone={STATUS_TONE[user.status] ?? "neutral"} dot>{user.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 align-top text-ink-soft">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={user.status === "ACTIVE" ? "Suspend account" : "Activate account"}
                        disabled={user.id === currentUserId || busy}
                        onClick={() => onToggleStatus(user)}
                      >
                        {user.status === "ACTIVE" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Reset password"
                        disabled={busy}
                        onClick={() => {
                          setResetPassword(generatePassword());
                          setError("");
                          setResetUser(user);
                        }}
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete account"
                        disabled={user.id === currentUserId || busy}
                        onClick={() => setConfirmDelete(user)}
                      >
                        <UserX className="h-4 w-4 text-danger" />
                      </Button>
                      {user.role === "TEACHER" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Assign classes"
                          disabled={busy}
                          onClick={() => openClassTeacherModal(user)}
                        >
                          <GraduationCap className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create account modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create account"
        description="The generated password is shown once — copy it before saving."
        hideClose={busy}
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" loading={busy}>
              Create account
            </Button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={onCreate} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          <Field label="Full name" required htmlFor="cr-fullName">
            <Input
              id="cr-fullName"
              autoFocus
              required
              value={newUser.fullName}
              onChange={(e) => setForm("fullName", e.target.value)}
            />
          </Field>
          <Field label="Email" required htmlFor="cr-email">
            <Input
              id="cr-email"
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setForm("email", e.target.value)}
              placeholder="name@example.com"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" htmlFor="cr-phone">
              <Input
                id="cr-phone"
                value={newUser.phone}
                onChange={(e) => setForm("phone", e.target.value)}
                placeholder="+234..."
              />
            </Field>
            <Field label="Role" required htmlFor="cr-role">
              <Select
                id="cr-role"
                value={newUser.role}
                onChange={(e) => setForm("role", e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="PARENT">Parent</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </Select>
            </Field>
          </div>
          {(newUser.role === "TEACHER" || newUser.role === "STUDENT") && (
            <Field
              label={newUser.role === "TEACHER" ? "Form class" : "Class"}
              htmlFor="cr-class"
              hint={
                newUser.role === "TEACHER"
                  ? "The class they will manage as form teacher."
                  : undefined
              }
            >
              <Select
                id="cr-class"
                value={newUser.classId}
                onChange={(e) => setForm("classId", e.target.value)}
              >
                <option value="">{newUser.role === "TEACHER" ? "No class assigned" : "No class"}</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field
            label="Password"
            required
            htmlFor="cr-password"
            hint="Minimum 8 characters. Copy this password before saving — it will not be shown again."
          >
            <div className="relative">
              <Input
                id="cr-password"
                required
                minLength={8}
                type={newUser.showPassword ? "text" : "password"}
                value={newUser.password}
                onChange={(e) => setForm("password", e.target.value)}
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
                <button
                  type="button"
                  className="rounded p-1.5 text-ash-500 hover:text-ink"
                  onClick={() => setForm("showPassword", !newUser.showPassword)}
                  aria-label={newUser.showPassword ? "Hide password" : "Show password"}
                >
                  {newUser.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 text-ash-500 hover:text-ink"
                  onClick={regeneratePassword}
                  aria-label="Generate password"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Field>
        </form>
      </Modal>

      {/* Reset password modal */}
      <Modal
        open={!!resetUser}
        onClose={() => setResetUser(null)}
        title="Reset password"
        description={resetUser ? `Set a new password for ${resetUser.email}.` : undefined}
        hideClose={busy}
        footer={
          <>
            <Button variant="outline" onClick={() => setResetUser(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" form="reset-password-form" loading={busy}>
              Save password
            </Button>
          </>
        }
      >
        <form id="reset-password-form" onSubmit={onResetPassword} className="space-y-4">
          {error && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          <Field
            label="New password"
            required
            htmlFor="rs-password"
            hint="Minimum 8 characters. Tell the user their new password directly."
          >
            <div className="relative">
              <Input
                id="rs-password"
                name="password"
                key={resetUser?.id ?? "none"}
                required
                minLength={8}
                type={newUser.showPassword ? "text" : "password"}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
                <button
                  type="button"
                  className="rounded p-1.5 text-ash-500 hover:text-ink"
                  onClick={() => setNewUser((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
                  aria-label="Toggle password visibility"
                >
                  {newUser.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 text-ash-500 hover:text-ink"
                  onClick={() => setResetPassword(generatePassword())}
                  aria-label="Generate password"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Field>
        </form>
      </Modal>

      {/* Assign classes modal */}
      <Modal
        open={!!classTeacher}
        onClose={() => setClassTeacher(null)}
        title={classTeacher ? `Assign classes — ${classTeacher.fullName}` : "Assign classes"}
        description="Choose the class(es) this teacher is form teacher for."
        hideClose={busy}
        footer={
          <>
            <Button variant="outline" onClick={() => setClassTeacher(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={onSaveClasses} loading={busy}>
              Save classes
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && (
            <div role="alert" className="rounded-[var(--radius)] border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {classes.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-soft">
              No classes exist yet. Run the database seed to create them.
            </p>
          ) : (
            classes.map((c) => {
              const checked = selectedClasses.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-3 text-sm transition-colors ${
                    checked ? "border-royal-accent bg-royal-50" : "border-border bg-surface hover:bg-ash-50"
                  }`}
                >
                  <span className="font-medium text-ink">{c.name}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      checked ? "border-royal-accent bg-royal-accent text-white" : "border-ash-400 bg-surface"
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleClass(c.id)}
                  />
                </label>
              );
            })
          )}
        </div>
      </Modal>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={onDelete}
        title="Delete account"
        message={
          confirmDelete
            ? `Delete ${confirmDelete.fullName} (${confirmDelete.email})? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={busy}
      />
    </div>
  );
}