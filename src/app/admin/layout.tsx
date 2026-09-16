import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen md:flex bg-ac-background">
      <AdminSidebar email={session?.user?.email} />
      <main className="flex-1 min-w-0 px-5 sm:px-8 py-8 max-w-[1200px]">{children}</main>
    </div>
  );
}
