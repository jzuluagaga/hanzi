import type { Metadata } from "next"
import { RegistroPanel } from "@/components/registro-panel"
import { RegistroForm } from "@/components/registro-form"

export const metadata: Metadata = {
  title: "Crear cuenta | Hanzi - Aprende chino en español",
  description: "Regístrate gratis y empieza a aprender el vocabulario del HSK1 con flashcards en español.",
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
