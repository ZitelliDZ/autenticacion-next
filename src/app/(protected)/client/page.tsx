'use client'
import { UserInfo } from "@/components"
import { useCurrentUser } from "@/hooks"


export const ClientPage =  () => {

  const user =  useCurrentUser()

  return (
    <div>
        <UserInfo label="💻 Client Component" user={user} />
    </div>
  )
}

export default ClientPage