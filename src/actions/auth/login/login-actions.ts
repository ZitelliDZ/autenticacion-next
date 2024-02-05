"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/schemas/auth/LoginSchema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTwoFactorConfirmationByUserId, getTwoFactorTokenByEmail, getUserByEmail, getVerificationTokenByEmail } from "@/actions";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mailing";
import prisma from "@/lib/db-prisma";

export const loginAction = async (values: z.infer<typeof LoginSchema>,callbackUrl:string|null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos no válidos!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Credenciales icorrectas!" };
  }

  
  if (!existingUser.emailVerified) {
    
    const existingToken = await getVerificationTokenByEmail(existingUser.email)

    if (existingToken && (new Date(existingToken.expires) > new Date())) {
      return { success: "Email de confirmación pendiente!" };
    }

    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Email de confirmación enviado!" };
  }

  if(existingUser.isTwoFactorEnabled && existingUser.email) {
    if(code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if(!twoFactorToken){
        return { error: "Código no válido!" };
      }

      if(twoFactorToken.token !== code){
        return { error: "Código no válido!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired){
        return { error: "Código expirado!" };
      }
      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if(existingConfirmation){
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
     
    }else {
    const twoFactorToken = await generateTwoFactorToken(existingUser.email);
    await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
    return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales no válidas!" };
        default:
          return { error: "Ha ocurrido un error!" };
      }
    }

    throw error;
  }
};
