'use client';

import { FormSuccess } from "@/components"
import RoleGate from "@/components/protected/ui/RoleGate"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@/interfaces/user.interfaces"
//import { currentRole } from "@/lib/useAuth"

//import { useCurrentRole } from "@/hooks";
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { admin } from "@/actions/admin/admin";

export const AdminPage = async () => {

    const onServerActionClick = () => {
        admin().then(res => {
            if (res.success) {
                toast.success('Tiene permisos - Server Action!')
            }else{
                toast.error('No tiene permisos - Server Action!')
            }
        })
    }

    const onApiRouteClick = () => {
        fetch('/api/admin')
        .then(res => {
            if (res.ok) {
                toast.success('Tiene permisos - Admin Route!')
            }else{
                toast.error('No tiene permisos - Admin Route!')
            }
            
        })
    }

    //const role = await currentRole()
    //const role = useCurrentRole()
    return (
        <Card className="w-[600px]" >
            <CardHeader>
                <p className=" text-2xl font-semibold text-center ">
                    🔑 Admin
                </p>
            </CardHeader>
            <CardContent className=" space-y-4 " >
                <RoleGate  allowedRole={UserRole[1] as unknown as UserRole} >
                    <FormSuccess message={'Bienvenido, usted tiene los permisos!'} />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className=" text-sm font-medium ">
                        Solo Admin - Api Route
                    </p>
                    <Button onClick={onApiRouteClick} >
                        Click de prueba
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className=" text-sm font-medium ">
                        Solo Admin - Server Action
                    </p>
                    <Button onClick={onServerActionClick}>
                        Click de prueba
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
export default AdminPage