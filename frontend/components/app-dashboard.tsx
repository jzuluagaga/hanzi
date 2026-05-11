"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getLecciones, type LeccionDto } from "@/lib/api"

type Status = "Nueva" | "En progreso" | "Completada"

function toStatus(dto: LeccionDto): Status {
  if (dto.cartasEstudiadas === 0) return "Nueva"
  if (dto.cartasEstudiadas >= dto.totalCartas && dto.totalCartas > 0) return "Completada"
  return "En progreso"
}

type MappedLesson = {
  id: number
  num: number
  title: string
  status: Status
  done: number
  total: number
  pendientesHoy: number
}

function LessonCard({ lesson }: { lesson: MappedLesson }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 ease-in-out hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 32px rgba(26,26,46,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,46,0.07)")}
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#E63946", fontSize: 12 }}>
          Lección {lesson.num}
        </p>

        <p className="line-clamp-2" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 30 }}>
          {lesson.title}
        </p>

        {lesson.done === 0 ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>Sin iniciar</p>
        ) : lesson.pendientesHoy > 0 ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{lesson.pendientesHoy} para repasar</p>
        ) : null}

        <div className="mt-auto">
          <a
            href={`/app/lecciones/${lesson.id}`}
            className="block w-full rounded-[12px] py-2 text-center text-sm transition-opacity duration-150 hover:opacity-70"
            style={{ border: "1.5px solid #1A1A2E", color: "#1A1A2E", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            Estudiar
          </a>
        </div>
      </div>
    </div>
  )
}

export function AppDashboard() {
  const { token } = useAuth()
  const [lecciones, setLecciones] = useState<LeccionDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    getLecciones(token)
      .then(setLecciones)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  const lessons: MappedLesson[] = lecciones.map(dto => ({
    id: dto.id,
    num: dto.orden,
    title: dto.nombre,
    status: toStatus(dto),
    done: dto.cartasEstudiadas,
    total: dto.totalCartas,
    pendientesHoy: dto.cartasPendientesHoy,
  }))

  const hasStarted = lessons.some(l => l.status !== "Nueva")
  const totalPendientes = lessons.reduce((sum, l) => sum + l.pendientesHoy, 0)

  const subtitle = isLoading
    ? ""
    : lessons.every(l => l.done === 0)
      ? "Empieza por la Lección 1"
      : totalPendientes > 0
        ? `Tienes ${totalPendientes} cartas para repasar hoy`
        : "Estás al día por hoy"

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">

        {/* Header */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 26 }}>
            Vocabulario — Nuevo Libro de Chino Práctico 1
          </h1>
          {subtitle && (
            <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 16 }}>
              {subtitle}
            </p>
          )}
        </div>



        {/* Onboarding banner */}
        {!isLoading && !hasStarted && (
          <div
            className="relative mb-8 overflow-hidden rounded-[16px] p-6"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <span
              className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-serif font-bold leading-none"
              style={{ fontSize: 120, color: "rgba(230,57,70,0.08)" }}
              aria-hidden="true"
            >
              汉字
            </span>
            <div className="relative z-10">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs"
                style={{ backgroundColor: "#FFD166", color: "#1A1A2E", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
              >
                ¡Bienvenido!
              </span>
              <h2 className="text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22 }}>
                Empieza con la Lección 1
              </h2>
              <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 15 }}>
                El mejor punto de partida para aprender chino.
              </p>
              {lessons[0] && (
                <a
                  href={`/app/lecciones/${lessons[0].id}`}
                  className="mt-4 inline-block rounded-[12px] px-5 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
                >
                  Empezar ahora →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Lesson grid */}
        {isLoading ? (
          <div className="mb-10 flex items-center justify-center py-16">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4"
              style={{ borderColor: "#e0e0e0", borderTopColor: "#E63946" }}
            />
          </div>
        ) : lessons.length === 0 ? (
          <p className="mb-10" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 15 }}>
            Aún no hay lecciones disponibles.
          </p>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
