'use server';

import prisma from '@/lib/db-prisma';
import { SettingsSchema } from '@/schemas/auth/SettingsSchema';
import  * as z from 'zod';
import { getUserById } from '@/actions/services/get-user-by-id';
import { currentUser } from '@/lib/useAuth';
import { UserRole } from '@prisma/client';
import { getUserByEmail } from '..';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mailing';
import bcryptjs from 'bcryptjs';
import { unstable_update } from '@/auth';


export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();
    if (!user) {
        return {error: "No tiene permisos!"}
    }

    const userDB = await getUserById(user.id!);
    if (!userDB) {
        return {error: "No tiene permisos!"}
    }

    if ( user.isOAuth ){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.password && values.newPassword && userDB.password) {
        const passwordsMatch = await bcryptjs.compare(
            values.password,
            userDB.password,
        );
        if (!passwordsMatch) {
            return {error: "Contraseña actual incorrecta!"}
        }
        const hashedPassword = await bcryptjs.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;        
    }

    if (values.email && values.email !== userDB.email) {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser && existingUser.id !== user.id) {
            return {error: "El correo ya está en uso!"}
        }
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(values.email, verificationToken.token);
        return {success: "Se ha enviado un correo de verificación a su nuevo correo!"}
    }

    

    const updatedUser = await prisma.user.update({
        where: {
            id: userDB.id
        },
        data: {
            ...values,
            role: values.role as UserRole

        }
    });

    unstable_update({
        user:{
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
        }
    })
    return {success: 'Configuración actualizada!'}
}

