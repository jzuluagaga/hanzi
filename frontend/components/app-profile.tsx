"use client"

import { useState } from "react"
import { LogOut, Eye, EyeOff } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBottomNav } from "@/components/app-bottom-nav"

const isGoogleUser = false
const user = { name: "Sofía García", email: "sofia@email.com", initials: "SG" }

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

export function AppProfile() {
  const [name, setName] = useState(user.name)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savedName, setSavedName] = useState(false)
  const [savedPassword, setSavedPassword] = useState(false)

  const handleSaveName = () => {
    setSavedName(true)
    setTimeout(() => setSavedName(false), 2000)
  }

  const handleSavePassword = () => {
    setSavedPassword(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setSavedPassword(false), 2000)
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
                  {user.initials}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 20, color: "#1A1A2E" }}>
                  {user.name}
                </p>
                <p className="mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#888" }}>
                  {user.email}
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
              className="mt-4 w-full rounded-[12px] py-3 text-center transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundColor: savedName ? "#06D6A0" : "#E63946",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#ffffff",
              }}
            >
              {savedName ? "Guardado" : "Guardar cambios"}
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 h-px w-full" style={{ backgroundColor: "#e8e0d6" }} />

          {/* Password section */}
          {!isGoogleUser && (
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
                className="mt-5 w-full rounded-[12px] border-[1.5px] py-3 text-center transition-all duration-150"
                style={{
                  borderColor: savedPassword ? "#06D6A0" : "#E63946",
                  backgroundColor: savedPassword ? "rgba(6,214,160,0.06)" : "#ffffff",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: savedPassword ? "#06D6A0" : "#E63946",
                }}
              >
                {savedPassword ? "Contraseña actualizada" : "Actualizar contraseña"}
              </button>
            </div>
          )}

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
