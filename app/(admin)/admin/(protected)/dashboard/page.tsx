import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardView from "@/components/admin/DashboardView";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // 1. If Employee tries to access Dashboard, send them to Blog
  if (user?.role === 'EMPLOYEE') {
    redirect('/admin/blog');
  }

  // 2. Render the client view
  return <DashboardView />;
}