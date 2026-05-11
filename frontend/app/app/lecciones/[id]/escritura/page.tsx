import type { Metadata } from "next"
import { LeccionEscritura } from "@/components/leccion-escritura"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata: Metadata = {
  title: "Escritura | Hanzi",
  robots: { index: false, follow: false },
}

export default async function EscrituraPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ modo?: string }>
}) {
  const { id } = await params
  const { modo } = await searchParams
  const modoInicial = modo === "dificil" ? "DIFICIL" : "FACIL"

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <AppSidebar />
      <div className="w-full md:pl-[240px]">
        <LeccionEscritura leccionId={Number(id)} modoInicial={modoInicial} />
      </div>
    </div>
  )
}
