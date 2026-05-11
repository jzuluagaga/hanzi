import type { Metadata } from "next"
import { LeccionHub } from "@/components/leccion-hub"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBottomNav } from "@/components/app-bottom-nav"

export const metadata: Metadata = {
  title: "Lección | Hanzi",
  robots: { index: false, follow: false },
}

export default async function LeccionHubPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <AppSidebar />
      <div className="w-full md:pl-[240px]">
        <LeccionHub id={id} />
      </div>
      <AppBottomNav />
    </div>
  )
}
