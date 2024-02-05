import { Navbar } from "@/components"

interface ProtectedlayoutProps {
  children: React.ReactNode
}

const Protectedlayout = async ({children}:ProtectedlayoutProps) => {
  return (
    <div className=" h-full w-full flex flex-col gap-y-10 items-center justify-center  bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rose-400 to-rose-600 ">
      <Navbar />
      {children}
    </div>
  )
}

export default Protectedlayout