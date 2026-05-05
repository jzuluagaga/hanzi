"use client"

import { BookOpen, Target, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { icon: BookOpen, label: "Lecciones", href: "/app" },
  { icon: Target, label: "HSK", href: "/app/hsk", soon: true },
  { icon: User, label: "Mi perfil", href: "/app/profile" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user: authUser, logout } = useAuth()

  const initials = authUser?.nombre?.charAt(0).toUpperCase() ?? "U"

  return (
    <aside
      className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col md:flex"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 px-6 py-7">
        <span className="font-serif text-2xl font-bold" style={{ color: "#E63946" }}>
          汉字
        </span>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#ffffff", fontSize: 18, marginLeft: 2 }}>
          hanzi
        </span>
      </a>

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
              {initials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 14 }}>
              {authUser?.nombre ?? "Usuario"}
            </p>
            <p className="truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 12 }}>
              {authUser?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          className="mt-4 flex w-full items-center gap-2 transition-colors duration-150"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 14 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E63946")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          onClick={() => { logout(); router.push("/login") }}
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
