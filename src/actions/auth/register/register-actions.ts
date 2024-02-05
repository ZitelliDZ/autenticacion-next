'use server';

import * as z from "zod";
import { RegisterSchema } from '@/schemas/auth/RegisterSchema';
import bcryptjs from 'bcryptjs';
import prisma from "@/lib/db-prisma";
import { getUserByEmail  } from "@/actions";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mailing";

export const registerAction = async  (values:z.infer< typeof RegisterSchema>) => {

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: 'Campos no válidos!'};
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {error: 'El usuario ya existe!'};
    }
    

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    
    return {success: 'Email de confirmación enviado!'};

    

}