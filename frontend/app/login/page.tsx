import type { Metadata } from "next"
import { LoginPanel } from "@/components/login-panel"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Iniciar sesión | Hanzi - Aprende chino en español",
  description: 'Inicia sesión en Hanzi y continúa aprendiendo vocabulario chino con repasos activos. Tu progreso HSK y tus lecciones te esperan.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <LoginPanel />
      <div className="flex w-full flex-1 items-center justify-center bg-hanzi-paper px-6 py-12 md:w-[55%]">
        <LoginForm />
      </div>
    </div>
  )
}
