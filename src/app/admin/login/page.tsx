import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";

export const metadata = { title: "Admin login — Delice" };

async function loginAction(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw err;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form action={loginAction} className="w-full max-w-sm bg-paper rounded-2xl p-8 border border-line">
        <h1 className="font-serif text-2xl text-plum mb-1">Delice admin</h1>
        <p className="text-sm text-ink/60 mb-6">Sign in to manage products, stores, and videos.</p>

        {error && (
          <p className="text-sm text-rose mb-4 bg-rose/10 border border-rose/30 rounded-lg px-3 py-2">
            Invalid email or password.
          </p>
        )}

        <label className="block text-sm text-ink/70 mb-1.5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm outline-none focus:border-plum-soft"
        />

        <label className="block text-sm text-ink/70 mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-6 text-sm outline-none focus:border-plum-soft"
        />

        <button type="submit" className="w-full bg-plum text-cream rounded-full py-3 text-sm">
          Sign in
        </button>
      </form>
    </div>
  );
}
