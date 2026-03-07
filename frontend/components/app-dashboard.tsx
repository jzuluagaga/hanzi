"use client"

import { Flame, BookOpen, GraduationCap } from "lucide-react"

type HealthColor = "verde" | "amarillo" | "rojo" | "gris"

const HEALTH: Record<HealthColor, { color: string; label: string; dot: string }> = {
  verde:    { color: "#06D6A0", label: "Bien memorizado",  dot: "#06D6A0" },
  amarillo: { color: "#FFD166", label: "Repasar pronto",   dot: "#FFD166" },
  rojo:     { color: "#E63946", label: "Necesita repaso",  dot: "#E63946" },
  gris:     { color: "#e0e0e0", label: "Sin iniciar",      dot: "#bbbbbb" },
}

type Status = "Nueva" | "En progreso" | "Completada"

const STATUS_BADGE: Record<Status, { bg: string; text: string }> = {
  "Nueva":        { bg: "#1A1A2E", text: "#ffffff" },
  "En progreso":  { bg: "#FFD166", text: "#1A1A2E" },
  "Completada":   { bg: "#06D6A0", text: "#ffffff" },
}

const lessons = [
  { id: 1, num: 1, title: "Saludos y presentaciones", status: "Completada" as Status, done: 150, total: 150, health: "verde" as HealthColor,    char: "你" },
  { id: 2, num: 2, title: "Familia y personas",       status: "En progreso" as Status, done: 64,  total: 150, health: "amarillo" as HealthColor, char: "家" },
  { id: 3, num: 3, title: "Números y fechas",         status: "Nueva" as Status,       done: 0,   total: 150, health: "gris" as HealthColor,     char: "数" },
  { id: 4, num: 4, title: "Comida y bebida",          status: "Nueva" as Status,       done: 0,   total: 150, health: "gris" as HealthColor,     char: "食" },
  { id: 5, num: 5, title: "Lugares y transporte",     status: "Nueva" as Status,       done: 0,   total: 150, health: "gris" as HealthColor,     char: "路" },
  { id: 6, num: 6, title: "Tiempo y clima",           status: "Nueva" as Status,       done: 0,   total: 150, health: "gris" as HealthColor,     char: "天" },
]

const stats = [
  { icon: Flame,         value: "7",  label: "días seguidos",        streak: true },
  { icon: BookOpen,      value: "48", label: "palabras aprendidas",  streak: false },
  { icon: GraduationCap, value: "2",  label: "lecciones completadas", streak: false },
]

const completed = lessons.filter((l) => l.status === "Completada").length
const hskPct = Math.round((completed / lessons.length) * 100)
const hasStarted = lessons.some((l) => l.status !== "Nueva")

function LessonCard({ lesson }: { lesson: typeof lessons[0] }) {
  const h = HEALTH[lesson.health]
  const badge = STATUS_BADGE[lesson.status]
  const pct = Math.round((lesson.done / lesson.total) * 100)
  const isNew = lesson.status === "Nueva"
  const isDone = lesson.status === "Completada"

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 ease-in-out hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 20px rgba(26,26,46,0.07)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 32px rgba(26,26,46,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,46,0.07)")}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: h.color }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#E63946", fontSize: 12 }}>
              Lección {lesson.num}
            </p>
            {/* Memory health dot */}
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: h.dot }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888" }}>
                {h.label}
              </span>
            </div>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-xs"
            style={{ backgroundColor: badge.bg, color: badge.text, fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 11 }}
          >
            {lesson.status}
          </span>
        </div>

        {/* Title */}
        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#1A1A2E", fontSize: 17 }}>
          {lesson.title}
        </p>

        {/* Progress */}
        <div>
          <div className="h-[6px] w-full overflow-hidden rounded-full" style={{ backgroundColor: "#f0f0f0" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: h.color }}
            />
          </div>
          <p className="mt-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>
            {lesson.done} / {lesson.total} palabras
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-auto flex items-center justify-between">
          <span
            className="pointer-events-none select-none font-serif"
            style={{ fontSize: 32, color: "rgba(230,57,70,0.20)", fontWeight: 700 }}
          >
            {lesson.char}
          </span>
          {isDone ? (
            <a
              href={`/app/lesson/${lesson.id}`}
              className="rounded-[12px] border-2 px-4 py-2 text-sm transition-colors duration-150 hover:bg-hanzi-red/5"
              style={{ borderColor: "#E63946", color: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              Repasar
            </a>
          ) : (
            <a
              href={`/app/lesson/${lesson.id}`}
              className="rounded-[12px] px-4 py-2 text-sm text-white transition-opacity duration-150 hover:opacity-90"
              style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              {isNew ? "Empezar" : "Continuar"}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function AppDashboard() {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">

        {/* Onboarding banner — shown only if 0 lessons started */}
        {!hasStarted && (
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
                Saludos y presentaciones — el mejor punto de partida.
              </p>
              <a
                href="/app/lesson/1"
                className="mt-4 inline-block rounded-[12px] px-5 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
              >
                Empezar ahora →
              </a>
            </div>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 26 }}>
            ¡Hola, Sofía! 👋
          </h1>
          <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 16 }}>
            ¿Qué estudias hoy?
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label, streak }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-[16px] bg-white px-4 py-5"
              style={{ boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#E63946",
                  boxShadow: streak && value !== "0" ? "0 0 16px rgba(255,209,102,0.5)" : "none",
                }}
              >
                <Icon size={18} color="#fff" />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#1A1A2E", fontSize: 28, lineHeight: 1 }}>
                {value}
              </p>
              <p className="text-center" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 12 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Lessons section */}
        <div className="mb-6">
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 20 }}>
            Tus lecciones
          </h2>
          <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 15 }}>
            Estudia a tu ritmo, lección por lección.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>

        {/* HSK1 progress banner */}
        <div
          className="relative overflow-hidden rounded-[16px] p-6"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          {/* Decorative text */}
          <span
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 80, color: "rgba(255,255,255,0.05)", lineHeight: 1 }}
            aria-hidden="true"
          >
            HSK
          </span>

          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex-1">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs text-white"
                style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
              >
                HSK 1
              </span>
              <h3 className="text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18 }}>
                Tu preparación para el HSK1
              </h3>
              <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 14 }}>
                Completa todas las lecciones para estar listo.
              </p>
              <div
                className="mt-4 h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${hskPct}%`, backgroundColor: "#E63946" }}
                />
              </div>
              <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 13 }}>
                {completed} de {lessons.length} lecciones completadas
              </p>
            </div>

            {/* 加油 */}
            <div className="group relative shrink-0">
              <span
                className="cursor-default select-none font-serif font-bold"
                style={{ fontSize: 48, color: "#E63946" }}
              >
                加油!
              </span>
              <div
                className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-[8px] px-3 py-1.5 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
              >
                ¡Ánimo en chino!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
