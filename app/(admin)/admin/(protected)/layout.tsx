import { getCurrentUser } from "@/lib/auth-server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Security fallback: if no user found (and middleware missed it), redirect
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <AdminSidebar userRole={user.role} username={user.username}>
      {children}
    </AdminSidebar>
  );
}