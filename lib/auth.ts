import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Google from "next-auth/providers/google";
import { TUser } from "@/types/types";
import { getUserByEmail } from "@/services/service";

// Add debug logging
console.log("=== Environment Variables Debug ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Set" : "Not set");
console.log("=== End Debug ===");

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: TUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      try {
        console.log("Session callback - user email:", user.email);
        const userFromDb = await getUserByEmail(user.email);
        if (userFromDb) {
          session.user = userFromDb;
        }
      } catch (error) {
        console.error("Error in session callback:", error);
        // Return the session as-is if there's an error
      }
      return session;
    },
  },
});
