"use client"

import { useEffect, useState } from "react"
import { BookOpen, Layers, GraduationCap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getHskNivel, getStats, type HskNivelDto, type UserStatsDto } from "@/lib/api"

function HskLevelCard({ nivel, data }: { nivel: number; data: HskNivelDto | null }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 ease-in-out hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 32px rgba(26,26,46,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,46,0.07)")}
    >
      <div className="h-1 w-full" style={{ backgroundColor: "#E63946" }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#E63946", fontSize: 12 }}>
          HSK {nivel}
        </p>

        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#1A1A2E", fontSize: 17 }}>
          Vocabulario HSK {nivel}
        </p>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>
          {data && data.totalCartas > 0
            ? `${data.totalCartas} palabras · ${data.categorias.length} categorías`
            : "Sin vocabulario importado"}
        </p>

        <div className="mt-auto">
          <a
            href={`/app/hsk/${nivel}`}
            className="block w-full rounded-[12px] py-2 text-center text-sm text-white transition-opacity duration-150 hover:opacity-90"
            style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            Repasar
          </a>
        </div>
      </div>
    </div>
  )
}

export function HskHome() {
  const { token } = useAuth()
  const [hsk1, setHsk1] = useState<HskNivelDto | null>(null)
  const [hsk2, setHsk2] = useState<HskNivelDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<UserStatsDto | null>(null)

  useEffect(() => {
    if (!token) return
    Promise.all([getHskNivel(1, token), getHskNivel(2, token), getStats(token)])
      .then(([d1, d2, s]) => { setHsk1(d1); setHsk2(d2); setStats(s) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  const totalPalabras    = (hsk1?.totalCartas ?? 0) + (hsk2?.totalCartas ?? 0)
  const totalCategorias  = (hsk1?.categorias.length ?? 0) + (hsk2?.categorias.length ?? 0)
  const nivelesActivos   = [hsk1, hsk2].filter((d) => d && d.totalCartas > 0).length
  const categoriasIniciadas = stats?.categoriasHskIniciadas ?? 0
  const hskPct = totalCategorias > 0 ? Math.round((categoriasIniciadas / totalCategorias) * 100) : 0

  const statCards = [
    { icon: BookOpen,       value: String(totalPalabras),   label: "palabras en total" },
    { icon: Layers,         value: String(totalCategorias), label: "categorías" },
    { icon: GraduationCap,  value: String(nivelesActivos),  label: "niveles disponibles" },
  ]

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">

        {/* Welcome */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 26 }}>
            ¡Vocabulario HSK!
          </h1>
          <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 16 }}>
            Vocabulario oficial del examen, organizado por categorías.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {statCards.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-[16px] bg-white px-4 py-5"
              style={{ boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E63946" }}
              >
                <Icon size={18} color="#fff" />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#1A1A2E", fontSize: 28, lineHeight: 1 }}>
                {isLoading ? "—" : value}
              </p>
              <p className="text-center" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 12 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        

        {/* HSK level grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4"
              style={{ borderColor: "#e0e0e0", borderTopColor: "#E63946" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <HskLevelCard nivel={1} data={hsk1} />
            <HskLevelCard nivel={2} data={hsk2} />
          </div>
        )}

        {/* HSK progress banner */}
        {!isLoading && totalCategorias > 0 && (
          <div
            className="relative mt-8 overflow-hidden rounded-[16px] p-6"
            style={{ backgroundColor: "#1A1A2E" }}
          >
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
                  Tu preparación para el HSK
                </h3>
                <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 14 }}>
                  Completa todas las lecciones para estar listo.
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${hskPct}%`, backgroundColor: "#E63946" }}
                  />
                </div>
                <p className="mt-2" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: 13 }}>
                  {categoriasIniciadas} de {totalCategorias} categorías iniciadas
                </p>
              </div>
              <div className="group relative shrink-0">
                <span className="cursor-default select-none font-serif font-bold" style={{ fontSize: 48, color: "#E63946" }}>
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
        )}

      </div>
    </div>
  )
}
