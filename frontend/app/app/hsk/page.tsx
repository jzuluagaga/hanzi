import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { HskHome } from "@/components/hsk-home"

export const metadata: Metadata = {
  title: "Vocabulario HSK | Hanzi",
}

export default function HskPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <AppSidebar />
      <div className="w-full md:pl-[240px]">
        <HskHome />
      </div>
      <AppBottomNav />
    </div>
  )
}
