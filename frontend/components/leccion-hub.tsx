"use client"

import { useEffect, useState } from "react"
import { BookOpen, Brain, PenLine } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getLecciones, getProximoRepaso, type LeccionDto } from "@/lib/api"

const HEALTH_COLOR: Record<string, string> = {
  VERDE: "#06D6A0",
  AMARILLO: "#FFD166",
  ROJO: "#E63946",
}

const HEALTH_LABEL: Record<string, string> = {
  VERDE: "Bien memorizado",
  AMARILLO: "Repasar pronto",
  ROJO: "Necesita repaso",
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function formatProximoRepaso(dateStr: string | null): string {
  if (!dateStr) return "—"
  const date = new Date(dateStr + "T00:00:00")
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy)
  manana.setDate(manana.getDate() + 1)
  if (date.getTime() === hoy.getTime()) return "Hoy"
  if (date.getTime() === manana.getTime()) return "Mañana"
  return `${date.getDate()} ${MESES[date.getMonth()]}`
}

function statusLabel(dto: LeccionDto): string {
  if (dto.cartasEstudiadas === 0) return "Sin iniciar"
  const map: Record<string, string> = {
    VERDE: "Al día",
    AMARILLO: "Repasar pronto",
    ROJO: "Necesita repaso",
  }
  return map[dto.healthStatus] ?? "Repasar pronto"
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-[14px] bg-white p-4"
      style={{ border: "1px solid #e8e0d6", boxShadow: "0 2px 8px rgba(26,26,46,0.04)" }}
    >
      <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22, color: "#1A1A2E" }}>
        {value}
      </p>
      <p className="mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
        {label}
      </p>
    </div>
  )
}

export function LeccionHub({ id }: { id: string }) {
  const { token } = useAuth()
  const [leccion, setLeccion] = useState<LeccionDto | null>(null)
  const [proximoRepaso, setProximoRepaso] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    Promise.all([
      getLecciones(token),
      getProximoRepaso(id, token).catch(() => ({ proximoRepaso: null })),
    ])
      .then(([lecciones, repaso]) => {
        const found = lecciones.find(l => String(l.id) === id)
        if (!found) setError("Lección no encontrada")
        else setLeccion(found)
        setProximoRepaso(repaso.proximoRepaso)
      })
      .catch(() => setError("No se pudo cargar la lección"))
      .finally(() => setIsLoading(false))
  }, [token, id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F8F4EE" }}>
        <div
          className="h-10 w-10 animate-spin rounded-full border-4"
          style={{ borderColor: "#e0e0e0", borderTopColor: "#E63946" }}
        />
      </div>
    )
  }

  if (error || !leccion) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F8F4EE" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#555555" }}>
          {error ?? "Lección no encontrada"}
        </p>
      </div>
    )
  }

  const nueva = leccion.cartasEstudiadas === 0
  const healthColor = nueva ? "#e0e0e0" : (HEALTH_COLOR[leccion.healthStatus] ?? "#e0e0e0")
  const healthLabel = nueva ? "Sin iniciar" : (HEALTH_LABEL[leccion.healthStatus] ?? "Repasar pronto")
  const progressPct = leccion.totalCartas > 0
    ? Math.round((leccion.cartasEstudiadas / leccion.totalCartas) * 100)
    : 0

  const studyUrl = `/app/lesson/${id}?modo=inteligente&nombre=${encodeURIComponent(leccion.nombre)}`
  const quizUrl = `/app/lecciones/${id}/quiz`
  const escrituraFacilUrl = `/app/lecciones/${id}/escritura?modo=facil`
  const escrituraDificilUrl = `/app/lecciones/${id}/escritura?modo=dificil`
  const estado = statusLabel(leccion)

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">

        {/* Back */}
        <a
          href="/app"
          className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#555555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Lecciones
        </a>

        {/* Header */}
        <div className="mt-6">
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: "#E63946",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Lección {leccion.orden}
          </p>
          <h1
            className="mt-2"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 30, color: "#1A1A2E", lineHeight: 1.2 }}
          >
            {leccion.nombre}
          </h1>
          <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555555" }}>
            {leccion.totalCartas} tarjetas · {estado}
          </p>
        </div>

        {/* Mode cards — Estudiar + Quiz */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Estudiar */}
          <div
            className="flex flex-col rounded-[16px] bg-white p-6"
            style={{ border: "1.5px solid #E63946", boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: "rgba(230,57,70,0.10)" }}
            >
              <BookOpen size={20} color="#E63946" strokeWidth={2} />
            </div>
            <h3
              className="mt-4"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A1A2E" }}
            >
              Estudiar
            </h3>
            <p
              className="mt-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}
            >
              Repasa el vocabulario con flashcards.
            </p>

            {/* Health / progress bar */}
            <div className="mt-auto pt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: healthColor, flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
                    {healthLabel}
                  </span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
                  {leccion.cartasEstudiadas}/{leccion.totalCartas}
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(26,26,46,0.08)" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: healthColor,
                    width: `${progressPct}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <a
              href={studyUrl}
              className="mt-4 block rounded-[12px] py-2.5 text-center text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              Empezar →
            </a>
          </div>

          {/* Quiz */}
          <div
            className="flex flex-col rounded-[16px] bg-white p-6"
            style={{ border: "1.5px solid #e8e0d6", boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: "rgba(6,214,160,0.10)" }}
            >
              <Brain size={20} color="#06D6A0" strokeWidth={2} />
            </div>
            <h3
              className="mt-4"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A1A2E" }}
            >
              Quiz
            </h3>
            <p
              className="mt-1.5 flex-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}
            >
              Pon a prueba lo que aprendiste con preguntas de opción múltiple.
            </p>
            <a
              href={quizUrl}
              className="mt-4 block rounded-[12px] py-2.5 text-center text-sm transition-opacity hover:opacity-80"
              style={{
                border: "1.5px solid #1A1A2E",
                color: "#1A1A2E",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
              }}
            >
              Iniciar quiz →
            </a>
          </div>
        </div>

        {/* Escritura — sub-sección con 2 cards de modo */}
        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2">
            <PenLine size={14} color="#555555" strokeWidth={2} />
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: "#555555",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Escritura
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Escritura · Fácil */}
            <div
              className="flex flex-col rounded-[16px] bg-white p-5"
              style={{ border: "1.5px solid #06D6A0", boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: "rgba(6,214,160,0.12)" }}
                >
                  <PenLine size={17} color="#06D6A0" strokeWidth={2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}
                  >
                    Escritura · Fácil
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
                    Practica con guía visual
                  </p>
                </div>
              </div>
              <a
                href={escrituraFacilUrl}
                className="mt-4 block rounded-[10px] py-2 text-center text-sm transition-opacity hover:opacity-80"
                style={{
                  border: "1.5px solid #06D6A0",
                  color: "#06D6A0",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                }}
              >
                Empezar →
              </a>
            </div>

            {/* Escritura · Difícil */}
            <div
              className="flex flex-col rounded-[16px] bg-white p-5"
              style={{ border: "1.5px solid #E63946", boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: "rgba(230,57,70,0.10)" }}
                >
                  <PenLine size={17} color="#E63946" strokeWidth={2} />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}
                  >
                    Escritura · Difícil
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
                    Escribe de memoria
                  </p>
                </div>
              </div>
              <a
                href={escrituraDificilUrl}
                className="mt-4 block rounded-[10px] py-2 text-center text-sm transition-opacity hover:opacity-80"
                style={{
                  border: "1.5px solid #E63946",
                  color: "#E63946",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                }}
              >
                Empezar →
              </a>
            </div>

          </div>
        </div>

        {/* Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <MetricCard label="Tarjetas totales" value={leccion.totalCartas} />
          <MetricCard label="Estudiadas" value={leccion.cartasEstudiadas} />
          <MetricCard label="Próximo repaso" value={formatProximoRepaso(proximoRepaso)} />
        </div>

      </div>
    </div>
  )
}
