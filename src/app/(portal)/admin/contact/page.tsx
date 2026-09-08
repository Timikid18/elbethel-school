import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Contact messages</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Messages submitted through the public contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink">No messages yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                When a visitor submits the contact form, it will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {m.name} <span className="font-normal text-ink-soft">— {m.subject}</span>
                  </CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </span>
                    {m.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </span>
                    )}
                    <span>{format(m.createdAt, "MMM d, yyyy h:mm a")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-ink-soft">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}