import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { PasswordField } from "@/components/admin/password-field";
import { adminInput, adminLabel } from "@/components/admin/admin-ui";
import { Button } from "@/components/button";

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
    <div className="min-h-screen flex items-center justify-center bg-ac-background px-6">
      <form
        action={loginAction}
        className="w-full max-w-sm bg-ac-surface-container-lowest rounded-2xl p-8 border border-ac-border-hairline shadow-[0_20px_50px_-30px_rgba(42,22,32,0.35)]"
      >
        <h1 className="font-editorial text-2xl text-ac-primary mb-1">Delice admin</h1>
        <p className="font-humanist text-sm text-ac-on-surface-variant mb-6">
          Sign in to manage products, stores, and videos.
        </p>

        {error && (
          <p className="font-humanist text-sm text-ac-rose mb-4 bg-ac-rose/10 border border-ac-rose/25 rounded-lg px-3 py-2">
            Invalid email or password.
          </p>
        )}

        <label className={adminLabel} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={`${adminInput} mb-4`} />

        <label className={adminLabel} htmlFor="password">
          Password
        </label>
        <PasswordField id="password" name="password" />

        <Button type="submit" className="w-full justify-center">
          Sign in
        </Button>
      </form>
    </div>
  );
}
