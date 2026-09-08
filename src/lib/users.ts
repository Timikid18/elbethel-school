import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
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
  classId?: string;
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
        const teacher = await tx.teacher.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            email,
            phone: input.phone?.trim() || null,
            staffId: randomCode("STF"),
          },
        });
        // Assign this teacher as form teacher of the chosen class (if any).
        if (input.classId) {
          await tx.class.update({
            where: { id: input.classId },
            data: { classTeacherId: teacher.id },
          });
        }
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
        const student = await tx.student.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            gender: "N/A",
            admissionNumber: randomCode("ADM"),
            classId: input.classId ?? null,
          },
        });
        if (input.classId) {
          const session = await tx.academicSession.findFirst({ where: { isCurrent: true } });
          if (session) {
            await tx.enrollment.upsert({
              where: {
                studentId_classId_sessionId: {
                  studentId: student.id,
                  classId: input.classId,
                  sessionId: session.id,
                },
              },
              update: { isActive: true },
              create: { studentId: student.id, classId: input.classId, sessionId: session.id },
            });
          }
        }
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

/** Assign (or reassign) which class(es) a teacher is form teacher for. */
export async function setTeacherClasses(teacherId: string, classIds: string[]) {
  await prisma.$transaction(async (tx) => {
    // Release any classes currently assigned to this teacher.
    await tx.class.updateMany({
      where: { classTeacherId: teacherId },
      data: { classTeacherId: null },
    });
    // Claim the new set.
    if (classIds.length > 0) {
      await tx.class.updateMany({
        where: { id: { in: classIds } },
        data: { classTeacherId: teacherId },
      });
    }
  });
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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 40);

const CRED_CHARS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomLoginPassword() {
  let out = "";
  const bytes = randomBytes(16);
  for (let i = 0; i < 14; i++) out += CRED_CHARS[bytes[i] % CRED_CHARS.length];
  return out;
}

/**
 * Convert an accepted admission application into a real Student account:
 * - unique login (email + password)
 * - Student profile placed in the applied-for class
 * - Enrollment for the current academic session
 * - links the application to the new student
 *
 * Only runs once per application (guarded by application.studentId).
 */
export async function autoEnrollApplication(applicationId: string) {
  return prisma.$transaction(async (tx) => {
    const app = await tx.admissionApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new UserError("Application not found");
    if (app.studentId) {
      throw new UserError("This application is already linked to a student account");
    }

    // Match the applied-for class by name (e.g. "Grade 5").
    const klass = await tx.class.findFirst({ where: { name: app.classApplying }, select: { id: true } });

    let email = "";
    for (let attempt = 0; attempt < 50; attempt++) {
      const base = `${slugify(app.firstName)}.${slugify(app.lastName)}`;
      const local = attempt === 0 ? base : `${base}.${Date.now().toString(36)}${attempt}`;
      const candidate = `${local}@elbethelthekings.xyz`;
      const exists = await tx.user.findUnique({ where: { email: candidate }, select: { id: true } });
      if (!exists) {
        email = candidate;
        break;
      }
    }
    if (!email) throw new UserError("Could not generate a unique login email");

    // Keep the generated password usable (not exposed again) — hash it.
    const password = randomLoginPassword();
    const passwordHash = await hashPassword(password);

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        fullName: `${app.firstName} ${app.lastName}`,
        role: "STUDENT",
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        firstName: app.firstName,
        lastName: app.lastName,
        gender: app.gender ?? "N/A",
        dateOfBirth: app.dateOfBirth ?? null,
        address: app.studentAddress ?? null,
        admissionNumber: randomCode("ADM"),
        classId: klass?.id ?? null,
      },
    });

    // Enrollment for the current session.
    const session = await tx.academicSession.findFirst({ where: { isCurrent: true } });
    if (klass && session) {
      await tx.enrollment.create({
        data: {
          studentId: student.id,
          classId: klass.id,
          sessionId: session.id,
          isActive: true,
        },
      });
    }

    await tx.admissionApplication.update({
      where: { id: applicationId },
      data: { studentId: student.id },
    });

    return { email, password, studentId: student.id };
  });
}