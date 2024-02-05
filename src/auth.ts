import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/db-prisma";
import { getUserById } from "@/actions/services/get-user-by-id";
import { getAccountByUserId, getTwoFactorConfirmationByUserId } from "./actions";


import google from "next-auth/providers/google";
import instagram from "next-auth/providers/instagram";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/auth/LoginSchema";
import { getUserByEmail } from "@/actions";
import bcryptjs from "bcryptjs";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update
} = NextAuth({
  providers: [
    google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    instagram({ clientId: process.env.INSTAGRAM_CLIENT_ID, clientSecret: process.env.INSTAGRAM_CLIENT_SECRET }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password,
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
  
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }
      
      
      return true;

    },
    async jwt({ token }) {
      
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      

      return token;
    },
    async session({ token, session }:any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as 'admin'|'user';
      }
      
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }
});