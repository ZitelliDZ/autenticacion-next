'use server';
import prisma from "@/lib/db-prisma";


export const getUserById = async (id: string)=> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        });
    
        return user;
    } catch (error) {
        return null
    }
}