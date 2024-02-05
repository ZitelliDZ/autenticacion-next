'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button, UserButton } from "@/components"


export function Navbar() {
    
    const pathname = usePathname()
  return (
    <nav className=" bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm ">
        <div className=" flex gap-x-2 ">
            <Button 
            asChild
            variant={pathname === '/server' ? 'default' : 'outline'}
            >
                <Link href={'/server'}>
                    Servidor
                </Link>

            </Button>
            <Button 
            asChild
            variant={pathname === '/client' ? 'default' : 'outline'}
            >
                <Link href={'/client'}>
                    Cliente
                </Link>

            </Button>
            <Button 
            asChild
            variant={pathname === '/admin' ? 'default' : 'outline'}
            >
                <Link href={'/admin'}>
                    Admin
                </Link>

            </Button>
            <Button 
            asChild
            variant={pathname === '/settings' ? 'default' : 'outline'}
            >
                <Link href={'/settings'}>
                    Configuración
                </Link>

            </Button>
        </div>
        <UserButton />
    </nav>
  )
}
