import { prisma } from "./prisma";
import type { ChangeAction, ChangeEntity } from "@prisma/client";

export type ModerationPayload = Record<string, unknown>;

/** Fields a non-admin (e.g. teacher) may edit on their own user profile. */
const PROFILE_WHITELIST = new Set(["fullName", "phone", "avatarUrl"]);

/** Fields a teacher may set when submitting an announcement for review. */
const ANNOUNCEMENT_WHITELIST = new Set([
  "title",
  "body",
  "audience",
  "classId",
  "isPinned",
]);

/** Fields allowed when creating an assignment as a teacher. */
const ASSIGNMENT_WHITELIST = new Set([
  "title",
  "description",
  "subjectId",
  "classId",
  "dueDate",
]);

function pickWhitelisted(
  payload: ModerationPayload,
  whitelist: Set<string>,
): ModerationPayload {
  const out: ModerationPayload = {};
  for (const key of whitelist) {
    if (key in payload) out[key] = payload[key];
  }
  return out;
}

/** Apply an approved change request payload to the relevant model. */
async function applyChange(input: {
  entityType: ChangeEntity;
  actionType: ChangeAction;
  entityId?: string | null;
  payload: ModerationPayload;
  requesterId: string;
}) {
  const { entityType, actionType, entityId, payload, requesterId } = input;

  switch (entityType) {
    case "ANNOUNCEMENT":
    case "CLASS_ANNOUNCEMENT": {
      if (actionType === "CREATE") {
        const fields = pickWhitelisted(payload, ANNOUNCEMENT_WHITELIST);
        return prisma.announcement.create({
          data: {
            title: String(fields.title ?? "Announcement"),
            body: String(fields.body ?? ""),
            audience: entityType === "CLASS_ANNOUNCEMENT" ? "CLASS" : ((fields.audience as never) ?? "EVERYONE"),
            classId: fields.classId ? String(fields.classId) : null,
            isPinned: Boolean(fields.isPinned),
            createdById: requesterId,
          },
        });
      }
      if (actionType === "UPDATE" && entityId) {
        const fields = pickWhitelisted(payload, ANNOUNCEMENT_WHITELIST);
        return prisma.announcement.update({
          where: { id: entityId },
          data: {
            title: fields.title !== undefined ? String(fields.title) : undefined,
            body: fields.body !== undefined ? String(fields.body) : undefined,
            classId: fields.classId !== undefined ? String(fields.classId) : undefined,
            audience: fields.audience !== undefined ? (fields.audience as never) : undefined,
            isPinned: fields.isPinned !== undefined ? Boolean(fields.isPinned) : undefined,
          },
        });
      }
      if (actionType === "DELETE" && entityId) {
        return prisma.announcement.delete({ where: { id: entityId } });
      }
      break;
    }

    case "CLASS_ASSIGNMENT": {
      if (actionType === "CREATE") {
        const fields = pickWhitelisted(payload, ASSIGNMENT_WHITELIST);
        const teacher = await prisma.teacher.findUnique({
          where: { userId: requesterId },
          select: { id: true },
        });
        return prisma.assignment.create({
          data: {
            title: String(fields.title ?? "Assignment"),
            description: fields.description ? String(fields.description) : null,
            subjectId: String(fields.subjectId ?? ""),
            classId: String(fields.classId ?? ""),
            teacherId: teacher?.id,
            dueDate: fields.dueDate ? new Date(String(fields.dueDate)) : new Date(),
          },
        });
      }
      break;
    }

    case "PROFILE": {
      if (actionType === "UPDATE" && entityId) {
        const fields = pickWhitelisted(payload, PROFILE_WHITELIST);
        return prisma.user.update({
          where: { id: entityId },
          data: {
            fullName: fields.fullName !== undefined ? String(fields.fullName) : undefined,
            phone: fields.phone !== undefined ? String(fields.phone ?? "") || null : undefined,
            avatarUrl:
              fields.avatarUrl !== undefined ? String(fields.avatarUrl ?? "") || null : undefined,
          },
        });
      }
      break;
    }

    case "STUDENT":
    case "RESULT":
    case "OTHER":
      break;
  }

  throw new Error(`Unsupported change request type: ${entityType}/${actionType}`);
}

/** Notify the requester that their change request was reviewed. */
async function notifyRequester(
  requesterId: string,
  status: "APPROVED" | "REJECTED",
  summary: string,
) {
  await prisma.userNotification.create({
    data: {
      userId: requesterId,
      type: "SYSTEM",
      title: status === "APPROVED" ? "Change approved" : "Change rejected",
      message:
        status === "APPROVED"
          ? `Your proposed change "${summary}" was approved and applied.`
          : `Your proposed change "${summary}" was rejected.`,
      link: "/dashboard",
    },
  });
}

export async function approveChangeRequest(
  requestId: string,
  reviewerId: string,
  note?: string,
) {
  const request = await prisma.changeRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new Error("Change request not found");
  if (request.status !== "PENDING") throw new Error("Change request already reviewed");

  await applyChange({
    entityType: request.entityType,
    actionType: request.actionType,
    entityId: request.entityId,
    payload: request.payload as ModerationPayload,
    requesterId: request.requesterId,
  });

  await prisma.changeRequest.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      reviewerId,
      reviewNote: note?.trim() || null,
      reviewedAt: new Date(),
    },
  });

  await notifyRequester(request.requesterId, "APPROVED", request.summary);
  return request;
}

export async function rejectChangeRequest(
  requestId: string,
  reviewerId: string,
  note: string,
) {
  const request = await prisma.changeRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new Error("Change request not found");
  if (request.status !== "PENDING") throw new Error("Change request already reviewed");

  await prisma.changeRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      reviewerId,
      reviewNote: note?.trim() || null,
      reviewedAt: new Date(),
    },
  });

  await notifyRequester(request.requesterId, "REJECTED", request.summary);
  return request;
}

export async function writeAudit(input: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}