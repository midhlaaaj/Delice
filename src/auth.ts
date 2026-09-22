import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, getIpFromHeaders } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Defense in depth: the login page's own server action already
        // rate-limits with a user-facing message. This second check covers
        // direct calls to the NextAuth credentials callback endpoint.
        const ip = getIpFromHeaders(request.headers);
        const { allowed } = checkRateLimit(`auth:${ip}`, 15, 10 * 60_000);
        if (!allowed) return null;

        const [user] = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email.toLowerCase()))
          .limit(1);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  // Admin-route gating happens explicitly in src/proxy.ts — passing a custom
  // function to `auth()` there bypasses NextAuth's own authorized-callback
  // redirect, so an `authorized` callback here would be dead code.
});
