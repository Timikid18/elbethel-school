import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ParentDashboardPage() {
  const user = await requireRole("PARENT");

  const profile = await prisma.parentProfile.findUnique({
    where: { userId: user.id },
    include: {
      children: {
        include: {
          student: {
            include: {
              class: true,
            },
          },
        },
      },
    },
  });

  const children = profile?.children ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {user.name?.split(" ")[0] ?? "Parent"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Overview of your children&apos;s schooling.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {children.length === 0 ? (
          <Card>
            <CardContent>
              <p className="py-6 text-sm text-ink-soft">
                No children linked to your account yet. Contact the school to link them.
              </p>
            </CardContent>
          </Card>
        ) : (
          children.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle>
                  {link.student.firstName} {link.student.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-soft">
                  {link.student.class?.name ?? "Class not set"} · Admission No.{" "}
                  {link.student.admissionNumber}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}