import type { Metadata } from "next"
import { LoginPanel } from "@/components/login-panel"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar contraseña | Hanzi",
  description: 'Recupera el acceso a tu cuenta de Hanzi. Recibirás un correo para restablecer tu contraseña en menos de un minuto.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <LoginPanel />
      <div className="flex w-full flex-1 items-center justify-center bg-hanzi-paper px-6 py-12 md:w-[55%]">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
