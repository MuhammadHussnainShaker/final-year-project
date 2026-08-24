import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    jwt?: string;
  }
  interface Session {
    user: {
      id: string;
      jwt: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Strapi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.jwt) return null;

          return {
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            jwt: data.jwt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as Record<string, unknown>).jwt as string;
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.id as string) ?? "";
      session.user.jwt = (token.jwt as string) ?? "";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
