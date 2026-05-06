"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import { resetPassword } from "@/lib/api"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState("")

  const passwordError =
    passwordTouched && password.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : ""
  const confirmError =
    confirmTouched && password !== confirm ? "Las contraseñas no coinciden" : ""

  const inputBase =
    "w-full rounded-[10px] border-[1.5px] bg-white px-4 py-3 font-sans text-[15px] text-hanzi-text outline-none transition-all duration-200 placeholder:text-[#aaa]"
  const borderOk = "border-[#e0e0e0] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"
  const borderErr = "border-[#E63946] focus:border-[#E63946] focus:shadow-[0_0_0_3px_rgba(230,57,70,0.1)]"

  async function handleSubmit() {
    setPasswordTouched(true)
    setConfirmTouched(true)
    if (passwordError || confirmError || password.length < 8 || password !== confirm) return
    setIsSubmitting(true)
    setServerError("")
    try {
      await resetPassword(token, password)
      setSubmitted(true)
    } catch {
      setServerError("El enlace no es válido o ya expiró. Solicita uno nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="flex w-full max-w-[420px] flex-col gap-6 text-center">
        <p className="font-sans text-[15px] text-hanzi-text-muted">
          El enlace no es válido. Solicita uno nuevo desde{" "}
          <a href="/forgot-password" className="text-hanzi-red hover:underline">
            recuperar contraseña
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-serif text-3xl font-bold text-hanzi-red">汉字</span>
        <span className="font-[var(--font-display)] text-xl font-bold text-hanzi-ink">hanzi</span>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle size={48} style={{ color: "#06D6A0" }} />
          <div>
            <h3
              className="text-hanzi-ink"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22 }}
            >
              ¡Contraseña actualizada!
            </h3>
            <p className="mt-2 font-sans text-[15px] text-hanzi-text-muted">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
          <a
            href="/login"
            className="font-sans text-sm text-hanzi-red underline-offset-2 hover:underline"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            Ir al inicio de sesión
          </a>
        </div>
      ) : (
        <>
          <div>
            <h1
              className="text-hanzi-ink"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26 }}
            >
              Nueva contraseña
            </h1>
            <p className="mt-1.5 font-sans text-[15px] text-hanzi-text-muted">
              Elige una contraseña segura para tu cuenta.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text"
              >
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`${inputBase} ${passwordError ? borderErr : borderOk}`}
              />
              {passwordError && (
                <p className="mt-1 font-sans text-xs text-[#E63946]">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block font-sans text-sm font-medium text-hanzi-text"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                className={`${inputBase} ${confirmError ? borderErr : borderOk}`}
              />
              {confirmError && (
                <p className="mt-1 font-sans text-xs text-[#E63946]">{confirmError}</p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="rounded-[10px] bg-[#fff0f0] px-4 py-3 font-sans text-sm text-[#E63946]">
              {serverError}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-[12px] bg-hanzi-red py-3.5 text-center text-white transition-all duration-200 hover:bg-[#C1121F] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16 }}
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Guardar contraseña"}
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
