import { auth } from "@/auth";
import { AdminChrome } from "@/components/admin/admin-chrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <AdminChrome email={session?.user?.email}>{children}</AdminChrome>;
}
