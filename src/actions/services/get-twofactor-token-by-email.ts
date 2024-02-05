'use server';
import prisma from "@/lib/db-prisma";

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: {
                email
            }
        })

        return twoFactorToken
    } catch (error) {
        return null
    }
}

