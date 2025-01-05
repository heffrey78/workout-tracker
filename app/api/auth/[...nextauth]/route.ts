import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { logError } from "../../../../lib/logger";
import prisma from "../../../../lib/prisma";

if (!process.env.EMAIL_SERVER_HOST)
  throw new Error("EMAIL_SERVER_HOST is required");
if (!process.env.EMAIL_SERVER_PORT)
  throw new Error("EMAIL_SERVER_PORT is required");
if (!process.env.EMAIL_SERVER_USER)
  throw new Error("EMAIL_SERVER_USER is required");
if (!process.env.EMAIL_SERVER_PASSWORD)
  throw new Error("EMAIL_SERVER_PASSWORD is required");
if (!process.env.EMAIL_FROM) throw new Error("EMAIL_FROM is required");

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  logger: {
    error(code, metadata) {
      logError(new Error(code), { ...metadata, source: "NextAuth" });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
