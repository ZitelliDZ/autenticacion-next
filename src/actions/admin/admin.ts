'use server';

import { UserRole } from "@/interfaces/user.interfaces";
import { currentRole } from "@/lib/useAuth";


export const admin = async () => {
    const role = await currentRole();
    if (role !== UserRole[1]) {
        return {error: "No tiene permisos!"}
    }
    return {success: "Tiene permisos!"}
}