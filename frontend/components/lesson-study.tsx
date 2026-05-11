"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, X, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getCartasDeLeccion, getCartasPendientes, getCartasHsk, getCartasHskPendientes, registrarRespuesta, type CartaDto } from "@/lib/api"

function hanziSize(text: string): string {
  const len = text.length
  if (len <= 4) return "6rem"     // text-8xl
  if (len <= 8) return "3.75rem"  // text-6xl
  return "2.25rem"                // text-4xl
}

interface LessonStudyProps {
  id?: string
  modo: "libre" | "inteligente"
  nombreLeccion?: string
  source?: { type: "hsk"; nivel: string; categoria: string }
  returnTo?: string
}

export function LessonStudy({ id, modo, nombreLeccion, source, returnTo = "/app" }: LessonStudyProps) {
  const { token } = useAuth()
  const [cartas, setCartas] = useState<CartaDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [done, setDone] = useState(false)
  const [alDia, setAlDia] = useState(false)

  function fetchCartas() {
    if (!token) return
    let fetchPromise: Promise<CartaDto[]>
    if (source?.type === "hsk" && modo === "inteligente") {
      fetchPromise = getCartasHskPendientes(source.nivel, source.categoria, token)
    } else if (source?.type === "hsk") {
      fetchPromise = getCartasHsk(source.nivel, source.categoria, token)
    } else if (!id) {
      setIsLoading(false)
      return
    } else if (modo === "inteligente") {
      fetchPromise = getCartasPendientes(id, token)
    } else {
      fetchPromise = getCartasDeLeccion(id, token)
    }
    setIsLoading(true)
    setCartas([])
    setAlDia(false)
    setIndex(0)
    setFlipped(false)
    setDone(false)
    fetchPromise
      .then((data) => {
        if (modo === "inteligente" && data.length === 0) {
          setAlDia(true)
        } else {
          setCartas(data)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { fetchCartas() }, [id, token, modo, source])

  const total    = cartas.length
  const current  = index + 1
  const card     = cartas[index]
  const progress = total > 0 ? (current / total) * 100 : 0

  const headerTitle = nombreLeccion ?? `Lección ${id}`

  function handleFlip() {
    if (!flipped) setFlipped(true)
  }

  async function handleAnswer(recordo: boolean) {
    if (!token || !card) return
    try {
      await registrarRespuesta(card.id, recordo, token)
    } catch {}

    setTransitionEnabled(false)
    setTimeout(() => {
      setFlipped(false)
      if (index + 1 >= cartas.length) {
        setDone(true)
      } else {
        setIndex((i) => i + 1)
      }
      setTimeout(() => setTransitionEnabled(true), 50)
    }, 0)
  }

  function handleReset() {
    fetchCartas()
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <a
            href={returnTo}
            className="flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ color: "#888888" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888888")}
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </a>
          <div className="flex flex-col">
            <span
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 16, color: "#ffffff" }}
            >
              {headerTitle}
            </span>
            {modo === "inteligente" && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#FFD166" }}>
                Repaso inteligente
              </span>
            )}
          </div>
        </div>
        {!done && !isLoading && !alDia && (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#888888" }}>
            {current} / {total}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!done && !isLoading && !alDia && (
        <div className="h-[6px] w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: "#E63946" }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">

        {/* Spinner */}
        {isLoading && (
          <div
            className="h-12 w-12 animate-spin rounded-full border-4"
            style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#E63946" }}
          />
        )}

        {/* Al día — solo modo inteligente sin pendientes */}
        {!isLoading && alDia && (
          <div className="flex w-full max-w-sm flex-col items-center text-center gap-5">
            <span style={{ fontSize: 64 }}>{"✅"}</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: "#ffffff" }}>
              ¡Todo al día!
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888", fontSize: 15 }}>
              No tienes ninguna carta pendiente de repaso hoy en esta lección.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <a
                href={returnTo}
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-90"
                style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#ffffff" }}
              >
                Volver al inicio
              </a>
              <a
                href={
                  source
                    ? `/app/lesson/hsk/${source.nivel}/${encodeURIComponent(source.categoria)}?nombre=${encodeURIComponent(nombreLeccion ?? source.categoria)}&modo=libre`
                    : `/app/lesson/${id}?modo=libre${nombreLeccion ? `&nombre=${encodeURIComponent(nombreLeccion)}` : ""}`
                }
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.10)", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#ffffff" }}
              >
                Repasar todo de todas formas
              </a>
            </div>
          </div>
        )}

        {/* Sin cartas */}
        {!isLoading && !alDia && total === 0 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888", fontSize: 16 }}>
              Esta lección no tiene cartas todavía.
            </p>
            <a
              href={returnTo}
              className="rounded-[12px] px-5 py-3 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              Volver al inicio
            </a>
          </div>
        )}

        {/* Sesión completada */}
        {!isLoading && !alDia && done && (
          <div className="flex w-full max-w-sm flex-col items-center text-center gap-5">
            <span style={{ fontSize: 64 }}>{"🎉"}</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: "#ffffff" }}>
              ¡Lección completada!
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888", fontSize: 15 }}>
              Has repasado todas las palabras de esta lección.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <a
                href={returnTo}
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-90"
                style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#ffffff" }}
              >
                Volver al inicio
              </a>
              <button
                onClick={handleReset}
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.10)", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#ffffff" }}
              >
                Repasar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* Flashcard */}
        {!isLoading && !alDia && !done && card && (
          <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
            <div
              className="w-full cursor-pointer"
              style={{ perspective: "1000px", height: 320 }}
              onClick={handleFlip}
            >
              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: transitionEnabled ? "transform 0.5s ease" : "none",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px]"
                  style={{ backgroundColor: "#F8F4EE", backfaceVisibility: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <span
                    className="absolute right-4 top-4 rounded-full px-3 py-1"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaaaaa", backgroundColor: "rgba(0,0,0,0.04)" }}
                  >
                    Toca para ver
                  </span>
                  {card.esPrimeraVez && (
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-1"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#1A1A2E", backgroundColor: "#FFD166", fontWeight: 600 }}
                    >
                      Nueva
                    </span>
                  )}
                  <span
                    className="w-full px-6 text-center"
                    style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 400, fontSize: hanziSize(card.hanzi), color: "#1A1A2E", lineHeight: 1 }}
                  >
                    {card.hanzi}
                  </span>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px]"
                  style={{ backgroundColor: "#ffffff", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <span className="w-full text-center" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 400, fontSize: 24, color: "#888888", marginBottom: 12 }}>
                    {card.hanzi}
                  </span>
                  <span
                    style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 32, color: "#1A1A2E", textAlign: "center", padding: "0 24px" }}
                  >
                    {card.traduccion}
                  </span>
                  <span
                    className="mt-3"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 20, color: "#E63946" }}
                  >
                    {card.pinyin}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction / Answer buttons */}
            {!flipped ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888888", textAlign: "center" }}>
                Toca la tarjeta para ver la traducción
              </p>
            ) : (
              <div className="flex w-full gap-3" style={{ animation: "fade-up 0.3s ease both" }}>
                {/* No recordé */}
                <button
                  onClick={() => handleAnswer(false)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-[12px] py-[14px] px-6 transition-colors duration-150"
                  style={{ backgroundColor: "rgba(230,57,70,0.15)", border: "1px solid #E63946", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#E63946" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "#E63946"; el.style.color = "#ffffff" }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "rgba(230,57,70,0.15)"; el.style.color = "#E63946" }}
                >
                  <X size={18} />
                  No recordé
                </button>

                {/* Lo recordé */}
                <button
                  onClick={() => handleAnswer(true)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-[12px] py-[14px] px-6 transition-colors duration-150"
                  style={{ backgroundColor: "rgba(6,214,160,0.15)", border: "1px solid #06D6A0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#06D6A0" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "#06D6A0"; el.style.color = "#ffffff" }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "rgba(6,214,160,0.15)"; el.style.color = "#06D6A0" }}
                >
                  <Check size={18} />
                  ¡Lo recordé!
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
