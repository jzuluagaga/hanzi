import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { AppDashboard } from "@/components/app-dashboard"

export const metadata: Metadata = {
  title: "Lecciones | Hanzi",
  description: "Tu panel de estudio de chino. Repasa lecciones, sigue tu progreso y prepárate para el HSK1.",
  robots: { index: false, follow: false },
}

export default function AppPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      {/* Fixed sidebar — desktop */}
      <AppSidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="w-full md:pl-[240px]">
        <AppDashboard />
      </div>

      {/* Bottom nav — mobile */}
      <AppBottomNav />
    </div>
  )
}
