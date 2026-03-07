"use client"

import { BookOpen, Target, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: BookOpen, label: "Lecciones", href: "/app" },
  { icon: Target, label: "HSK", href: "/app/hsk", soon: true },
  { icon: User, label: "Mi perfil", href: "/app/profile" },
]

const user = { name: "Sofía", email: "sofia@email.com", initials: "S" }

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col md:flex"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-7">
        <span className="font-serif text-2xl font-bold" style={{ color: "#E63946" }}>
          汉字
        </span>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#ffffff", fontSize: 18, marginLeft: 2 }}>
          hanzi
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map(({ icon: Icon, label, href, soon }) => {
          const active = pathname === href
          return (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-[10px] px-4 py-3 transition-colors duration-150"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: active ? "#ffffff" : "#888888",
                borderLeft: active ? "3px solid #E63946" : "3px solid transparent",
                backgroundColor: active ? "rgba(230,57,70,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#ffffff" }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#888888" }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {soon && (
                <span
                  className="ml-auto rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: "#FFD166",
                    color: "#1A1A2E",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  Próximamente
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t px-4 py-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E63946" }}
          >
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#fff", fontSize: 15 }}>
              {user.initials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 14 }}>
              {user.name}
            </p>
            <p className="truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 12 }}>
              {user.email}
            </p>
          </div>
        </div>
        <button
          className="mt-4 flex w-full items-center gap-2 transition-colors duration-150"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 14 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E63946")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
