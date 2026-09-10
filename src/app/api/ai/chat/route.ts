import {
  streamText,
  createUIMessageStreamResponse,
  toUIMessageStream,
  convertToModelMessages,
  isStepCount,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { buildTools, type AiCtx } from "@/lib/ai/school-tools";
import type { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = (process.env.AI_MODEL as string) || "gpt-4.1-mini";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The AI assistant is not configured yet. An administrator needs to add an OPENAI_API_KEY." },
      { status: 503 },
    );
  }

  let session;
  try {
    session = await auth();
  } catch {
    session = null;
  }
  const role = (session?.user?.role as Role | undefined) ?? undefined;
  const userId = session?.user?.id ?? undefined;

  const body = await request.json().catch(() => ({}));
  if (!Array.isArray(body.messages)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: openai(MODEL),
      instructions: buildSystemPrompt(role, session?.user?.name ?? undefined),
      messages: await convertToModelMessages(body.messages),
      tools: buildTools({ role, userId } satisfies AiCtx),
      stopWhen: isStepCount(5),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("[api/ai/chat]", error);
    return Response.json(
      { error: "Something went wrong with the assistant. Please try again." },
      { status: 500 },
    );
  }
}