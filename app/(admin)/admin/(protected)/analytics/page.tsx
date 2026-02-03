import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import AnalyticsView from "@/components/admin/AnalyticsView"; 

export default async function AnalyticsPage() {
  // 1. Server-Side Secure Auth Check
  const user = await getCurrentUser();

  // 2. If Employee tries to access Analytics, send them to Blog
  if (user?.role === 'EMPLOYEE') {
    redirect('/admin/blog');
  }

  // 3. Render the Client Component
  return <AnalyticsView />;
}