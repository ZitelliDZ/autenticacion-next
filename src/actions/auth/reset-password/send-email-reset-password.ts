'use server'
import * as z from 'zod'
import prisma from "@/lib/db-prisma"
import { ConfirmEmailSchema } from "@/schemas/auth/ConfirmEmailSchema"
import { getUserByEmail } from '@/actions'
import { sendPasswordResetEmail } from '@/lib/mailing'
import { generatePasswordResetToken } from '@/lib/tokens'

export const SendEmailResetPassword = async (values: z.infer<typeof ConfirmEmailSchema>) => {
   try {
    const validatedFields = ConfirmEmailSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Email no válido!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
      if (!existingUser) {
          return { error: "Email no encontrado!" };
      }
  
      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
  
      return { success: "Email enviado!" };
   } catch (error) {
        return { error: 'Ha ocurrido un error. vuelve a intentarlo' };
    
   }
}