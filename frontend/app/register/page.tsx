import type { Metadata } from "next"
import { RegistroPanel } from "@/components/registro-panel"
import { RegistroForm } from "@/components/registro-form"

export const metadata: Metadata = {
  title: "Crear cuenta | Hanzi - Aprende chino en español",
  description: 'Crea tu cuenta gratis en Hanzi y empieza a aprender chino en español. Flashcards con método de repaso espaciado, adaptado para hispanohablantes.',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <RegistroPanel />
      <div className="flex w-full flex-1 items-center justify-center bg-hanzi-paper px-6 py-12 md:w-[55%]">
        <RegistroForm />
      </div>
    </div>
  )
}
