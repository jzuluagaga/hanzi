"use client"

import { useEffect, useState } from "react"
import { LogOut, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { useAuth } from "@/lib/auth-context"
import { actualizarNombre, cambiarPassword, getStats, type UserStatsDto } from "@/lib/api"

function PasswordInput({
  label,
  value,
  onChange,
  showStrength = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  showStrength?: boolean
}) {
  const [show, setShow] = useState(false)

  const getStrength = (p: string) => {
    if (p.length === 0) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = getStrength(value)
  const strengthLabel = ["", "Débil", "Media", "Fuerte", "Fuerte"][strength]
  const strengthColors = ["#e0e0e0", "#E63946", "#FFD166", "#06D6A0", "#06D6A0"]

  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#555" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-3 pr-12 outline-none transition-colors focus:border-[#E63946]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#1A1A2E" }}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ color: "#aaa" }}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= strength ? strengthColors[strength] : "#e0e0e0" }}
              />
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: strengthColors[strength] }}>
            {strengthLabel}
          </span>
        </div>
      )}
    </div>
  )
}

function getHeatColor(n: number): string {
  if (n === 0) return "#e8e0d6"
  if (n <= 3)  return "#f5adb1"
  if (n <= 7)  return "#ee6b72"
  return "#E63946"
}

function ActivityHeatmap({ actividad }: { actividad: { fecha: string; cantidad: number }[] }) {
  const actMap = new Map(actividad.map(d => [d.fecha, d.cantidad]))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 89)

  // Pad back to the Monday on or before startDate
  // getDay(): 0=Sun,1=Mon,...,6=Sat → offset to Mon=0,...,Sun=6
  const dow = startDate.getDay()
  const mondayOffset = dow === 0 ? 6 : dow - 1
  const gridStart = new Date(startDate)
  gridStart.setDate(startDate.getDate() - mondayOffset)

  // How many week columns do we need to cover gridStart → today?
  const totalGridDays = Math.round((today.getTime() - gridStart.getTime()) / 86400000) + 1
  const numWeeks = Math.ceil(totalGridDays / 7)

  // Build 2D array: weeks[col][dayOfWeek] — null for padding cells outside range
  function toIso(d: Date) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-")
  }

  type Cell = { iso: string; cantidad: number; label: string } | null
  const weeks: Cell[][] = Array.from({ length: numWeeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + w * 7 + d)
      if (date < startDate || date > today) return null
      const iso = toIso(date)
      return {
        iso,
        cantidad: actMap.get(iso) ?? 0,
        label: date.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
      }
    })
  )

  // Month label for each column: show when the column's Monday is a new month
  const monthLabels: string[] = weeks.map((_, w) => {
    const colDate = new Date(gridStart)
    colDate.setDate(gridStart.getDate() + w * 7)
    const prevColDate = new Date(gridStart)
    prevColDate.setDate(gridStart.getDate() + (w - 1) * 7)
    const isNewMonth = w === 0 || colDate.getMonth() !== prevColDate.getMonth()
    return isNewMonth
      ? colDate.toLocaleDateString("es-MX", { month: "short" })
      : ""
  })

  return (
    <div
      className="mb-6 rounded-[16px] bg-white p-6"
      style={{ boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
    >
      <h3
        className="mb-3"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A2E" }}
      >
        Actividad — últimos 90 días
      </h3>

      <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "inline-block" }}>
        {/* Month labels — one cell per column, 11px + 3px gap = 14px stride */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "3px" }}>
          {monthLabels.map((label, w) => (
            <div
              key={w}
              style={{
                width: 11,
                fontSize: 9,
                lineHeight: 1,
                color: "#888",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Cell grid: 7 rows fixed, gridAutoFlow column, flatten weeks column-major */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "repeat(7, 11px)",
            gridAutoFlow: "column",
            gap: "3px",
          }}
        >
          {weeks.flatMap((week, w) =>
            week.map((cell, d) =>
              cell === null ? (
                <div key={`pad-${w}-${d}`} style={{ width: 11, height: 11 }} />
              ) : (
                <div
                  key={cell.iso}
                  title={
                    cell.cantidad > 0
                      ? `${cell.label} — ${cell.cantidad} palabra${cell.cantidad !== 1 ? "s" : ""}`
                      : `${cell.label} — Sin actividad`
                  }
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    backgroundColor: getHeatColor(cell.cantidad),
                    cursor: "default",
                  }}
                />
              )
            )
          )}
        </div>
      </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-1.5">
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaa" }}>Menos</span>
        {["#e8e0d6", "#f5adb1", "#ee6b72", "#E63946"].map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: c }} />
        ))}
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaa" }}>Más</span>
      </div>
    </div>
  )
}

export function AppProfile() {
  const router = useRouter()
  const { user: authUser, token, logout, login } = useAuth()
  const [stats, setStats] = useState<UserStatsDto | null>(null)

  useEffect(() => {
    if (!token) return
    getStats(token).then(setStats).catch(console.error)
  }, [token])

  const initials = authUser?.nombre?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "U"

  const [name, setName] = useState(authUser?.nombre ?? "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savedName, setSavedName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [savedPassword, setSavedPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handleSaveName = async () => {
    if (!token || !name.trim()) return
    setSavingName(true)
    try {
      const response = await actualizarNombre(name.trim(), token)
      login(response)
      setSavedName(true)
      setTimeout(() => setSavedName(false), 2000)
    } catch {
      // silently ignore — name unchanged
    } finally {
      setSavingName(false)
    }
  }

  const handleSavePassword = async () => {
    if (!token) return
    setPasswordError("")
    setSavingPassword(true)
    try {
      await cambiarPassword(currentPassword, newPassword, token)
      setSavedPassword(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSavedPassword(false), 2000)
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : "Error al cambiar la contraseña")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <AppSidebar />

      <main className="flex-1 pb-24 pt-8 md:ml-[240px] md:pb-8">
        <div className="mx-auto w-full max-w-[600px] px-6">

          {/* Header */}
          <div className="mb-8">
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 28, color: "#1A1A2E" }}>
              Mi perfil
            </h1>
            <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555" }}>
              Gestiona tu cuenta.
            </p>
          </div>

          {/* Profile card */}
          <div
            className="mb-6 rounded-[16px] bg-white p-6"
            style={{ boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E63946" }}
              >
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#fff", fontSize: 22 }}>
                  {initials}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 20, color: "#1A1A2E" }}>
                  {authUser?.nombre ?? "Usuario"}
                </p>
                <p className="mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888" }}>
                  {authUser?.email ?? ""}
                </p>
                <span
                  className="mt-2 inline-block rounded-full px-3 py-0.5"
                  style={{
                    backgroundColor: "#1A1A2E",
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: 11,
                    color: "#ffffff",
                  }}
                >
                  Estudiante
                </span>
              </div>
            </div>
          </div>

          {/* Activity heatmap */}
          {stats && <ActivityHeatmap actividad={stats.actividadPorDia} />}

          {/* Edit name */}
          <div
            className="mb-6 rounded-[16px] bg-white p-6"
            style={{ boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
          >
            <div className="flex flex-col gap-1.5">
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#555" }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-3 outline-none transition-colors focus:border-[#E63946]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#1A1A2E" }}
              />
            </div>
            <button
              onClick={handleSaveName}
              className="mt-4 w-full rounded-[12px] py-3 text-center transition-all duration-150 hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
              disabled={savingName}
              style={{
                backgroundColor: savedName ? "#06D6A0" : "#E63946",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#ffffff",
              }}
            >
              {savingName ? "Guardando…" : savedName ? "Guardado" : "Guardar cambios"}
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 h-px w-full" style={{ backgroundColor: "#e8e0d6" }} />

          {/* Password section */}
          <div
            className="my-6 rounded-[16px] bg-white p-6"
            style={{ boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
          >
            <h3
              className="mb-5"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E" }}
            >
              Cambiar contraseña
            </h3>
            <div className="flex flex-col gap-4">
              <PasswordInput
                label="Contraseña actual"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <PasswordInput
                label="Nueva contraseña"
                value={newPassword}
                onChange={setNewPassword}
                showStrength
              />
              <PasswordInput
                label="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
            <button
              onClick={handleSavePassword}
              className="mt-5 w-full rounded-[12px] border-[1.5px] py-3 text-center transition-all duration-150 disabled:opacity-50"
              disabled={savingPassword}
              style={{
                borderColor: savedPassword ? "#06D6A0" : "#E63946",
                backgroundColor: savedPassword ? "rgba(6,214,160,0.06)" : "#ffffff",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: savedPassword ? "#06D6A0" : "#E63946",
              }}
            >
              {savingPassword ? "Actualizando…" : savedPassword ? "Contraseña actualizada" : "Actualizar contraseña"}
            </button>
            {passwordError && (
              <p
                className="mt-3 rounded-[10px] px-4 py-3 text-sm"
                style={{ backgroundColor: "rgba(230,57,70,0.08)", color: "#E63946", fontFamily: "'DM Sans', sans-serif" }}
              >
                {passwordError}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="my-2 h-px w-full" style={{ backgroundColor: "#e8e0d6" }} />

          {/* Danger zone */}
          <div
            className="mt-6 rounded-[16px] bg-white p-6"
            style={{
              boxShadow: "0 4px 24px rgba(26,26,46,0.07)",
              borderLeft: "4px solid #E63946",
            }}
          >
            <button
              className="flex w-full items-center justify-center gap-2.5 rounded-[12px] border-[1.5px] py-3 transition-all duration-150"
              style={{
                borderColor: "#E63946",
                backgroundColor: "#ffffff",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#E63946",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = "#E63946"
                el.style.color = "#ffffff"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = "#ffffff"
                el.style.color = "#E63946"
              }}
              onClick={() => { logout(); router.push("/login") }}
            >
              <LogOut size={17} />
              Cerrar sesión
            </button>
          </div>

        </div>
      </main>

      <AppBottomNav />
    </div>
  )
}
