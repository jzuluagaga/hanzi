"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getHskNivel, getHskCategoriaEstado, type HskNivelDto, type HskCategoriaDto, type HskCategoriaEstadoDto } from "@/lib/api"

const HEALTH: Record<string, { color: string; label: string; dot: string }> = {
  NUEVA:    { color: "#e0e0e0", label: "Sin iniciar",     dot: "#bbbbbb" },
  VERDE:    { color: "#06D6A0", label: "Bien memorizado", dot: "#06D6A0" },
  AMARILLO: { color: "#FFD166", label: "Repasar pronto",  dot: "#FFD166" },
  ROJO:     { color: "#E63946", label: "Necesita repaso", dot: "#E63946" },
}

const HEALTH_ERROR = { color: "#e0e0e0", label: "Sin conexión", dot: "#cccccc" }

// null  = fetch was attempted and failed
// undefined = not yet in the map (still loading)
type EstadoValue = HskCategoriaEstadoDto | null

function CategoriaCard({
  cat,
  nivel,
  estado,
}: {
  cat: HskCategoriaDto
  nivel: string
  estado: EstadoValue | undefined
}) {
  const fetchFailed = estado === null
  const h           = fetchFailed ? HEALTH_ERROR : HEALTH[estado?.healthStatus ?? "NUEVA"]
  const isNew       = !fetchFailed && (estado?.healthStatus ?? "NUEVA") === "NUEVA"
  const isVerde     = !fetchFailed && estado?.healthStatus === "VERDE"

  const baseHref       = `/app/lesson/hsk/${nivel}/${encodeURIComponent(cat.categoria)}?nombre=${encodeURIComponent(cat.categoria)}`
  const hrefInteligente = `${baseHref}&modo=inteligente`
  const hrefLibre       = `${baseHref}&modo=libre`

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[16px] bg-white transition-all duration-200 ease-in-out hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 32px rgba(26,26,46,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,46,0.07)")}
    >
      <div className="h-1 w-full" style={{ backgroundColor: h.color }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#E63946", fontSize: 12 }}>
              HSK {nivel}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: h.dot }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888" }}>
                {h.label}
              </span>
            </div>
          </div>
          {!fetchFailed && estado && estado.cartasPendientes > 0 && (
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-xs"
              style={{ backgroundColor: "#FFD166", color: "#1A1A2E", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 11 }}
            >
              {estado.cartasPendientes} pendientes
            </span>
          )}
        </div>

        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#1A1A2E", fontSize: 17 }}>
          {cat.categoria}
        </p>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>
          {cat.totalCartas} palabras
        </p>

        <div className="mt-auto flex items-center gap-2">
          {!fetchFailed && !isNew && (
            <>
              {isVerde ? (
                <a
                  href={hrefInteligente}
                  className="flex-1 rounded-[12px] border py-2 text-center text-sm transition-colors duration-150 hover:opacity-80"
                  style={{ borderColor: "#06D6A0", color: "#06D6A0", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
                >
                  Al día ✓
                </a>
              ) : (
                <a
                  href={hrefInteligente}
                  className="flex-1 rounded-[12px] py-2 text-center text-sm text-white transition-opacity duration-150 hover:opacity-90"
                  style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
                >
                  Repasar hoy
                </a>
              )}
            </>
          )}
          <a
            href={hrefLibre}
            className={`rounded-[12px] border px-3 py-2 text-center text-sm transition-colors duration-150 hover:opacity-80 ${isNew || fetchFailed ? "flex-1" : ""}`}
            style={{ borderColor: "#1A1A2E", color: "#1A1A2E", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            {isNew || fetchFailed ? "Empezar" : "Repasar todo"}
          </a>
        </div>
      </div>
    </div>
  )
}

export function HskNivelView({ nivel }: { nivel: string }) {
  const { token } = useAuth()
  const [data, setData] = useState<HskNivelDto | null>(null)
  const [estados, setEstados] = useState<Record<string, EstadoValue>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    getHskNivel(Number(nivel), token)
      .then(async (nivelData) => {
        setData(nivelData)

        const settled = await Promise.all(
          nivelData.categorias.map((cat) =>
            getHskCategoriaEstado(nivel, cat.categoria, token)
              .then((estado) => ({ cat: cat.categoria, estado, ok: true as const }))
              .catch((err) => {
                console.error(`[HskNivelView] estado fetch failed for "${cat.categoria}":`, err)
                return { cat: cat.categoria, estado: null, ok: false as const }
              })
          )
        )

        const map: Record<string, EstadoValue> = {}
        settled.forEach(({ cat, estado }) => { map[cat] = estado })
        setEstados(map)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [nivel, token])

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#F8F4EE" }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 md:px-8"
        style={{ backgroundColor: "#F8F4EE", borderBottom: "1px solid rgba(26,26,46,0.07)" }}
      >
        <a
          href="/app/hsk"
          className="flex items-center justify-center"
          style={{ color: "#888888" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1A1A2E")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888888")}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </a>
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E" }}>
            Vocabulario HSK {nivel}
          </h1>
          {data && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}>
              {data.totalCartas} palabras · {data.categorias.length} categorías
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4"
              style={{ borderColor: "#e0e0e0", borderTopColor: "#E63946" }}
            />
          </div>
        ) : !data || data.categorias.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888", fontSize: 16 }}>
              No hay vocabulario HSK {nivel} importado todavía.
            </p>
            <a
              href="/app/hsk"
              className="rounded-[12px] px-5 py-3 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              Volver al inicio
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.categorias.map((cat) => (
              <CategoriaCard
                key={cat.categoria}
                cat={cat}
                nivel={nivel}
                estado={estados[cat.categoria]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
