"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminChrome({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen md:flex bg-ac-background">
      <AdminSidebar email={email} />
      <main className="flex-1 min-w-0 px-5 sm:px-8 py-8 max-w-[1200px]">{children}</main>
    </div>
  );
}
