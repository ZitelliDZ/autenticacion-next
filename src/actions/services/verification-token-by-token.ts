'use server';
import prisma from "@/lib/db-prisma"



export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token
            }
        })

        return verificationToken
    } catch (error) {
        return null
    }
}