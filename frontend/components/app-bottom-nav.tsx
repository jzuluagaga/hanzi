"use client"

import { BookOpen, Target, BarChart2, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: BookOpen, href: "/app", label: "Lecciones" },
  { icon: Target, href: "/app/hsk", label: "HSK" },
  { icon: BarChart2, href: "/app/progreso", label: "Progreso" },
  { icon: Settings, href: "/app/ajustes", label: "Ajustes" },
]

export function AppBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t px-2 py-3 md:hidden"
      style={{ backgroundColor: "#1A1A2E", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {navItems.map(({ icon: Icon, href, label }) => {
        const active = pathname === href
        return (
          <a
            key={href}
            href={href}
            aria-label={label}
            className="flex flex-col items-center gap-1"
          >
            <Icon size={22} style={{ color: active ? "#E63946" : "#555555" }} />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                color: active ? "#E63946" : "#555555",
              }}
            >
              {label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
