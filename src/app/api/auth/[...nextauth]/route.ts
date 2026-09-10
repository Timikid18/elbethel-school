import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

function makeSessionTransient(res: Response) {
  const headers = new Headers(res.headers);
  const setCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.();
  if (setCookie?.length) {
    headers.delete("set-cookie");
    for (const cookie of setCookie) {
      headers.append(
        "set-cookie",
        cookie.includes("session-token")
          ? cookie.replace(/;\s*Expires=[^;]+/gi, "").replace(/;\s*Max-Age=\d+/gi, "")
          : cookie,
      );
    }
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export const GET = (req: NextRequest) => handlers.GET(req).then(makeSessionTransient);
export const POST = (req: NextRequest) => handlers.POST(req).then(makeSessionTransient);