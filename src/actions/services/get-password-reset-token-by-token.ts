'use server'

import prisma from "@/lib/db-prisma"


export const getPasswordResetTokenByToken = async (token: string) => {
    
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token
            }
        });

        if (!passwordResetToken) {
            return null;
        }

        return passwordResetToken;
    } catch (error) {
        return null;
        
    }
}