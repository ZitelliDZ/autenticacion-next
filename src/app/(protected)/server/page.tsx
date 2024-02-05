
import { UserInfo } from "@/components"
import { currentUser } from "@/lib/useAuth"


export const ServerPage = async () => {

  const user = await currentUser()

  return (
    <div>
        <UserInfo label="💻 Server Component" user={user} />
    </div>
  )
}

export default ServerPage