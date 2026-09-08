import { requireUser } from "@/lib/auth-helper";
import { PortalShell } from "@/components/portal/portal-shell";
import { auth } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const session = await auth();
  return (
    <PortalShell userName={session?.user?.name ?? "User"} role={session?.user?.role}>
      {children}
    </PortalShell>
  );
}
