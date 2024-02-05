'use client';

import { FormError } from "@/components";
import { useCurrentRole } from "@/hooks";
import { UserRole } from "@/interfaces/user.interfaces";

interface RoleGateProps {
    children: React.ReactNode
    allowedRole: UserRole | undefined
    }
export const RoleGate = ({children,allowedRole}:RoleGateProps) => {
    const role  = useCurrentRole() 

    if (role !== allowedRole) {
        return (
            <FormError message={'Usted no tiene los permisos para ver el contenido!'} />
        )
    }
    
  return (
    <>
        {children}
    </>
  )
}

export default RoleGate