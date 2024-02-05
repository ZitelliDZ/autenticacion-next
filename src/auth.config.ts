
import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";
import instagram from "next-auth/providers/instagram";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/auth/LoginSchema";
import { getUserByEmail } from "@/actions";
import bcryptjs from "bcryptjs";

export default {
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
} satisfies NextAuthConfig