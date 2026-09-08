import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

export const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT", "STUDENT"];

export class UserError extends Error {}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

function randomCode(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function createUserAccount(input: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}) {
  const email = input.email.toLowerCase().trim();
  if (!input.fullName.trim()) throw new UserError("Full name is required");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new UserError("A valid email is required");
  if (input.password.length < 8) throw new UserError("Password must be at least 8 characters");
  if (!ROLES.includes(input.role)) throw new UserError("Invalid role");

  const [firstName, ...rest] = input.fullName.trim().split(/\s+/);
  const lastName = rest.join(" ") || firstName;
  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          fullName: input.fullName.trim(),
          phone: input.phone?.trim() || null,
          role: input.role,
        },
      });

      // Create a role profile so the account's dashboard works immediately.
      if (input.role === "TEACHER") {
        await tx.teacher.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            email,
            phone: input.phone?.trim() || null,
            staffId: randomCode("STF"),
          },
        });
      } else if (input.role === "PARENT") {
        await tx.parentProfile.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            email,
            phone: input.phone?.trim() || null,
          },
        });
      } else if (input.role === "STUDENT") {
        await tx.student.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            gender: "N/A",
            admissionNumber: randomCode("ADM"),
          },
        });
      }
      return user;
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2002") {
      throw new UserError("An account with that email already exists");
    }
    throw error;
  }
}

export async function resetUserPassword(userId: string, password: string) {
  if (password.length < 8) throw new UserError("Password must be at least 8 characters");
  const passwordHash = await hashPassword(password);
  return prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

export async function isLastSuperAdmin(userId: string) {
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (target?.role !== "SUPER_ADMIN") return false;
  const count = await prisma.user.count({ where: { role: "SUPER_ADMIN", status: "ACTIVE" } });
  return count <= 1;
}

export async function deleteUserAccount(userId: string) {
  if (await isLastSuperAdmin(userId)) {
    throw new UserError("You cannot remove the last active Super Admin");
  }
  const result = await prisma.$transaction(async (tx) => {
    // Gather profile ids to cascade child records that restrict deletion.
    const student = await tx.student.findUnique({ where: { userId }, select: { id: true } });
    const teacher = await tx.teacher.findUnique({ where: { userId }, select: { id: true } });
    const parent = await tx.parentProfile.findUnique({ where: { userId }, select: { id: true } });

    // Parent/child links referencing the student.
    const studentIds = student ? [student.id] : [];
    await tx.parentChild.deleteMany({ where: { studentId: { in: studentIds } } });

    // Student-linked records (no onDelete cascade in schema).
    if (student) {
      await tx.enrollment.deleteMany({ where: { studentId: student.id } });
      await tx.attendance.deleteMany({ where: { studentId: student.id } });
      await tx.resultItem.deleteMany({ where: { studentId: student.id } });
      await tx.result.deleteMany({ where: { studentId: student.id } });
      await tx.studentAssignment.deleteMany({ where: { studentId: student.id } });
      await tx.payment.deleteMany({ where: { studentId: student.id } });
      await tx.admissionApplication.deleteMany({ where: { studentId: student.id } });
    }

    // Teacher-linked records.
    if (teacher) {
      await tx.subjectTeacher.deleteMany({ where: { teacherId: teacher.id } });
    }

    // Parent-child links referencing the parent profile.
    if (parent) {
      await tx.parentChild.deleteMany({ where: { parentId: parent.id } });
    }

    // Profile rows themselves.
    await tx.student.deleteMany({ where: { userId } });
    await tx.teacher.deleteMany({ where: { userId } });
    await tx.parentProfile.deleteMany({ where: { userId } });

    // Records that reference the User directly.
    await tx.changeRequest.deleteMany({
      where: { OR: [{ requesterId: userId }, { reviewerId: userId }] },
    });
    await tx.userNotification.deleteMany({ where: { userId } });
    await tx.auditLog.deleteMany({ where: { userId } });

    return tx.user.delete({ where: { id: userId } });
  });
  return result;
}