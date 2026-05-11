"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { register as apiRegister } from "@/lib/api"

function getStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const strengthLabel = ["", "Débil", "Media", "Media", "Fuerte"]
const strengthColor = ["#e0e0e0", "#E63946", "#FFD166", "#FFD166", "#06D6A0"]

export function RegistroForm() {
  const router = useRouter()
  const auth = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [terms, setTerms] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const strength = getStrength(password)

  const errors: Record<string, string> = {}
  if (touched.name && name.trim().length < 2) errors.name = "Ingresa tu nombre completo"
  if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Ingresa un correo válido"
  if (touched.password && password.length < 8) errors.password = "Mínimo 8 caracteres"
  if (touched.confirmPassword && confirmPassword !== password)
    errors.confirmPassword = "Las contraseñas no coinciden"

  const valid: Record<string, boolean> = {}
  if (touched.name && !errors.name) valid.name = true
  if (touched.email && !errors.email) valid.email = true
  if (touched.password && !errors.password && password.length >= 8) valid.password = true
  if (touched.confirmPassword && !errors.confirmPassword && confirmPassword.length > 0)
    valid.confirmPassword = true

  function borderClass(field: string) {
    if (errors[field]) return "border-[#E63946] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
    if (valid[field]) return "border-[#06D6A0] focus:border-[#06D6A0] focus:shadow-[0_0_0_3px_rgba(6,214,160,0.1)]"
    return "border-[#e0e0e0] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
  }

  const inputBase =
    "w-full rounded-[10px] border-[1.5px] bg-white px-4 py-3 font-sans text-[15px] text-hanzi-text outline-none transition-all duration-200 placeholder:text-[#aaa]"

  async function handleSubmit() {
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    // Validación síncrona directa (errors se recalcula en el próximo render)
    if (
      name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 8 ||
      confirmPassword !== password ||
      !terms
    ) return
    setIsSubmitting(true)
    setApiError("")
    try {
      const response = await apiRegister(name.trim(), email, password)
      auth.login(response)
      router.push("/app")
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Error al crear la cuenta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-serif text-3xl font-bold text-hanzi-red">汉字</span>
        <span className="font-[var(--font-display)] text-xl font-bold text-hanzi-ink">hanzi</span>
      </div>

      <div>
        <h1
          className="text-hanzi-ink"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26 }}
        >
          Crea tu cuenta
        </h1>
        <p className="mt-1.5 font-sans text-[15px] text-hanzi-text-muted">
          Es gratis. Sin tarjeta de crédito.
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text">
            Nombre completo
          </label>
          <input
            id="reg-name"
            type="text"
            placeholder="Sofía García"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className={`${inputBase} ${borderClass("name")}`}
          />
          {errors.name && <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.name}</p>}
          {valid.name && (
            <p className="mt-1 flex items-center gap-1 font-sans text-xs text-[#06D6A0]">
              <CheckCircle size={12} /> Nombre válido
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text">
            Correo electrónico
          </label>
          <input
            id="reg-email"
            type="email"
            suppressHydrationWarning
            placeholder="sofia@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`${inputBase} ${borderClass("email")}`}
          />
          {errors.email && <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.email}</p>}
          {valid.email && (
            <p className="mt-1 flex items-center gap-1 font-sans text-xs text-[#06D6A0]">
              <CheckCircle size={12} /> Correo válido
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="reg-pw" className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="reg-pw"
              type={showPw ? "text" : "password"}
              suppressHydrationWarning
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={`${inputBase} pr-11 ${borderClass("password")}`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] transition-colors hover:text-hanzi-text"
              aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.password}</p>}

          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-[4px] transition-colors duration-200"
                    style={{ backgroundColor: i <= strength ? strengthColor[strength] : "#e0e0e0" }}
                  />
                ))}
              </div>
              <span className="font-sans text-xs text-[#888]">{strengthLabel[strength]}</span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="reg-pw-confirm" className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              id="reg-pw-confirm"
              type={showConfirmPw ? "text" : "password"}
              suppressHydrationWarning
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              className={`${inputBase} pr-11 ${borderClass("confirmPassword")}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPw(!showConfirmPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] transition-colors hover:text-hanzi-text"
              aria-label={showConfirmPw ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.confirmPassword}</p>
          )}
          {valid.confirmPassword && (
            <p className="mt-1 flex items-center gap-1 font-sans text-xs text-[#06D6A0]">
              <CheckCircle size={12} /> Las contraseñas coinciden
            </p>
          )}
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-hanzi-red"
        />
        <span className="font-sans text-sm text-hanzi-text-muted leading-snug">
          {"Acepto los "}
          <a href="/terminos" target="_blank" className="text-hanzi-red underline-offset-2 hover:underline">
            términos y condiciones
          </a>
          {" y la "}
          <a href="/privacidad" target="_blank" className="text-hanzi-red underline-offset-2 hover:underline">
            política de privacidad
          </a>
        </span>
      </label>

      {apiError && (
        <p className="rounded-[10px] bg-[#fef2f2] px-4 py-3 font-sans text-sm text-[#E63946]">
          {apiError}
        </p>
      )}

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full rounded-[12px] bg-hanzi-red py-3.5 text-center text-white transition-all duration-200 hover:bg-[#C1121F] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16 }}
      >
        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Crear cuenta gratis"}
      </button>

      {/* Bottom link */}
      <p className="text-center font-sans text-sm text-hanzi-text-muted">
        {"¿Ya tienes cuenta? "}
        <a
          href="/login"
          className="text-hanzi-red underline-offset-2 hover:underline"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
        >
          Inicia sesión
        </a>
      </p>

      {/* Mobile social proof */}
      <p className="mt-2 text-center font-sans text-[13px] text-[#888] md:hidden">
        {"Usado por estudiantes del Instituto Confucio \ud83c\udde8\ud83c\uddf4"}
      </p>
    </div>
  )
}
