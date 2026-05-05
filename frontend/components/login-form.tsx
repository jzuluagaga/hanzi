"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { login as apiLogin } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const auth = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const errors: Record<string, string> = {}
  if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Ingresa un correo válido"
  if (touched.password && password.length < 1)
    errors.password = "Ingresa tu contraseña"

  function borderClass(field: string) {
    if (errors[field])
      return "border-[#E63946] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
    return "border-[#e0e0e0] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
  }

  const inputBase =
    "w-full rounded-[10px] border-[1.5px] bg-white px-4 py-3 font-sans text-[15px] text-hanzi-text outline-none transition-all duration-200 placeholder:text-[#aaa]"

  async function handleSubmit() {
    setTouched({ email: true, password: true })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) return
    setIsSubmitting(true)
    setApiError("")
    try {
      const response = await apiLogin(email, password)
      auth.login(response)
      router.push("/app")
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Error al iniciar sesión")
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
          Bienvenido de vuelta
        </h1>
        <p className="mt-1.5 font-sans text-[15px] text-hanzi-text-muted">
          Continúa donde lo dejaste.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text"
          >
            Correo electrónico
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="sofia@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`${inputBase} ${borderClass("email")}`}
          />
          {errors.email && (
            <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-pw"
              className="block font-sans text-sm font-medium text-hanzi-text"
            >
              Contraseña
            </label>
            <a
              href="/forgot-password"
              className="font-sans text-[13px] text-hanzi-red underline-offset-2 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <input
              id="login-pw"
              type={showPw ? "text" : "password"}
              placeholder="Tu contraseña"
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
          {errors.password && (
            <p className="mt-1 font-sans text-xs text-[#E63946]">{errors.password}</p>
          )}
        </div>
      </div>

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
        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Iniciar sesión"}
      </button>

      {/* Bottom link */}
      <p className="text-center font-sans text-sm text-hanzi-text-muted">
        {"¿No tienes cuenta? "}
        <a
          href="/register"
          className="text-hanzi-red underline-offset-2 hover:underline"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
        >
          Regístrate gratis
        </a>
      </p>
    </div>
  )
}
