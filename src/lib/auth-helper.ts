import { auth } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export type AppRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TEACHER"
  | "PARENT"
  | "STUDENT";

/**
 * Role hierarchy. Higher to lower privilege.
 */
export const ROLE_WEIGHT: Record<AppRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  TEACHER: 3,
  PARENT: 2,
  STUDENT: 1,
};

export function hasRole(userRole: string | undefined, required: AppRole) {
  if (!userRole) return false;
  const w = ROLE_WEIGHT[userRole as AppRole];
  const r = ROLE_WEIGHT[required];
  if (w === undefined || r === undefined) return false;
  return w >= r;
}

/** Returns the current session, or null. Never redirects. */
export async function getSession() {
  return await auth();
}

/** Requires an authenticated user; redirects to login otherwise. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/")}`);
  }
  return session.user;
}

/**
 * Requires the current user to have at least `required` privilege.
 * Redirects to their appropriate dashboard if unauthorized.
 */
export async function requireRole(required: AppRole) {
  const user = await requireUser();
  if (!hasRole(user.role, required)) {
    redirect("/forbidden");
  }
  return { ...user, role: user.role as AppRole };
}

/** Helper to fetch full user profile from DB with role entity. */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      teacherProfile: true,
      parentProfile: true,
    },
  });
}

/** Resolve the default dashboard route for a role. */
export function getDashboardRoute(role: string | undefined): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "ADMIN":
    case "TEACHER":
      return "/teacher/dashboard";
    case "PARENT":
      return "/parent/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/login";
  }
}
