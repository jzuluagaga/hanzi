import type { Metadata } from "next"
import { LessonStudy } from "@/components/lesson-study"

export const metadata: Metadata = {
  title: "Estudiar HSK | Hanzi",
}

export default async function HskStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ nivel: string; categoria: string }>
  searchParams: Promise<{ nombre?: string; modo?: string }>
}) {
  const { nivel, categoria } = await params
  const { nombre, modo } = await searchParams
  const decodedCategoria = decodeURIComponent(categoria)

  return (
    <LessonStudy
      modo={modo === "inteligente" ? "inteligente" : "libre"}
      nombreLeccion={nombre ? decodeURIComponent(nombre) : decodedCategoria}
      source={{ type: "hsk", nivel, categoria: decodedCategoria }}
      returnTo="/app/hsk"
    />
  )
}
