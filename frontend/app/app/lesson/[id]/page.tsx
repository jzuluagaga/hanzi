import type { Metadata } from "next"
import { LessonStudy } from "@/components/lesson-study"

export const metadata: Metadata = {
  title: "Estudiar lección | Hanzi",
  robots: { index: false, follow: false },
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ modo?: string; nombre?: string }>
}) {
  const { id } = await params
  const { modo, nombre } = await searchParams
  return (
    <LessonStudy
      id={id}
      modo={(modo === "inteligente" || modo === "libre") ? modo : "libre"}
      nombreLeccion={nombre ? decodeURIComponent(nombre) : undefined}
      returnTo={`/app/lecciones/${id}`}
    />
  )
}
