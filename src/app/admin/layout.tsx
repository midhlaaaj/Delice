import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-paper">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-lg text-plum">
              Delice admin
            </Link>
            <nav className="flex gap-5 text-sm text-ink/70">
              <Link href="/admin/products">Products</Link>
              <Link href="/admin/stores">Stores</Link>
              <Link href="/admin/videos">Videos</Link>
              <Link href="/admin/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink/60">
            {session?.user?.email}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="border border-line rounded-full px-3.5 py-1.5">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-[1100px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
