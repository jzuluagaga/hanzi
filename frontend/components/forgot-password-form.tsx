"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { requestPasswordReset } from "@/lib/api"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const error =
    touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Ingresa un correo válido"
      : ""

  const inputBorder = error
    ? "border-[#E63946] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
    : "border-[#e0e0e0] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"

  const inputBase =
    "w-full rounded-[10px] border-[1.5px] bg-white px-4 py-3 font-sans text-[15px] text-hanzi-text outline-none transition-all duration-200 placeholder:text-[#aaa]"

  async function handleSubmit() {
    setTouched(true)
    if (error || !email) return
    setIsSubmitting(true)
    try {
      await requestPasswordReset(email)
    } catch {
      // Silenciar error — no revelar si el email existe o no
    } finally {
      setIsSubmitting(false)
      setSubmitted(true)
    }
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-serif text-3xl font-bold text-hanzi-red">汉字</span>
        <span className="font-[var(--font-display)] text-xl font-bold text-hanzi-ink">hanzi</span>
      </div>

      {submitted ? (
        /* Success state */
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle size={48} style={{ color: "#06D6A0" }} />
          <div>
            <h3
              className="text-hanzi-ink"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22 }}
            >
              ¡Revisa tu correo!
            </h3>
            <p className="mt-2 font-sans text-[15px] text-hanzi-text-muted">
              Te enviamos el enlace de recuperación. Puede tardar unos minutos.
            </p>
          </div>
          <a
            href="/login"
            className="font-sans text-sm text-hanzi-red underline-offset-2 hover:underline"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            Volver al inicio de sesión
          </a>
        </div>
      ) : (
        <>
          <div>
            <h1
              className="text-hanzi-ink"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26 }}
            >
              Recupera tu contraseña
            </h1>
            <p className="mt-1.5 font-sans text-[15px] text-hanzi-text-muted">
              Te enviamos un enlace a tu correo para restablecerla.
            </p>
          </div>

          <div>
            <label
              htmlFor="forgot-email"
              className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text"
            >
              Correo electrónico
            </label>
            <input
              id="forgot-email"
              type="email"
              suppressHydrationWarning
              placeholder="sofia@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`${inputBase} ${inputBorder}`}
            />
            {error && (
              <p className="mt-1 font-sans text-xs text-[#E63946]">{error}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-[12px] bg-hanzi-red py-3.5 text-center text-white transition-all duration-200 hover:bg-[#C1121F] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16 }}
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Enviar enlace"}
          </button>

          <a
            href="/login"
            className="text-center font-sans text-sm transition-colors hover:text-hanzi-red"
            style={{ color: "#888" }}
          >
            ← Volver al inicio de sesión
          </a>
        </>
      )}
    </div>
  )
}
