import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginPanel } from "@/components/login-panel"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata: Metadata = {
  title: "Nueva contraseña | Hanzi",
  description: "Establece una nueva contraseña para tu cuenta de Hanzi.",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <LoginPanel />
      <div className="flex w-full flex-1 items-center justify-center bg-hanzi-paper px-6 py-12 md:w-[55%]">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
