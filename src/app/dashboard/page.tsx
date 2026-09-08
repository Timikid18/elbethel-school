import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardRoute } from "@/lib/auth-helper";

export default async function DashboardIndexPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=" + encodeURIComponent("/dashboard"));
  }
  redirect(getDashboardRoute(session.user.role));
}
