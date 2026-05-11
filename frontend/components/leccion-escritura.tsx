"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCartasEscritura, registrarEscritura, type CartaDto } from "@/lib/api"

type Modo = "FACIL" | "DIFICIL"

// hanzi-writer se importa de forma dinámica en useEffect para evitar SSR crash
// (accede a document en el momento de la importación)
type HanziWriterType = typeof import("hanzi-writer").default

function CharDisplay({ hanzi, activeIndex }: { hanzi: string; activeIndex: number }) {
  const chars = [...hanzi]
  if (chars.length === 1) {
    return (
      <span
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: "4.5rem",
          color: "#1A1A2E",
          lineHeight: 1,
        }}
      >
        {chars[0]}
      </span>
    )
  }
  return (
    <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "4.5rem", lineHeight: 1 }}>
      {chars.map((c, i) => (
        <span
          key={i}
          style={{ color: i === activeIndex ? "#E63946" : "rgba(26,26,46,0.25)", transition: "color 0.2s" }}
        >
          {c}
        </span>
      ))}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F8F4EE" }}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4"
        style={{ borderColor: "#e0e0e0", borderTopColor: "#E63946" }}
      />
    </div>
  )
}

export function LeccionEscritura({ leccionId, modoInicial }: { leccionId: number; modoInicial: Modo }) {
  const { token } = useAuth()
  const modo = modoInicial

  const [cartas, setCartas] = useState<CartaDto[]>([])
  const [cartaIndex, setCartaIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [trazosCorrectos, setTrazosCorrectos] = useState(0)
  const [trazosFallados, setTrazosFallados] = useState(0)
  const [totalTrazos, setTotalTrazos] = useState(0)
  const [trazoActual, setTrazoActual] = useState(0)
  const [intentoId, setIntentoId] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [sinCartas, setSinCartas] = useState(false)

  const targetRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<InstanceType<HanziWriterType> | null>(null)
  const HanziWriterRef = useRef<HanziWriterType | null>(null)
  // Ref para evitar closures estale en el callback onComplete de hanzi-writer
  const handleCompleteRef = useRef<(totalMistakes: number) => void>(() => {})

  // Carga inicial: fetch cartas + filtrar las que tienen datos locales en hanzi-writer-data
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const { signal } = controller

    getCartasEscritura(leccionId, token)
      .then(async (cartas) => {
        const conDatos = await Promise.all(
          cartas.map(async (carta) => {
            const checks = await Promise.all(
              [...carta.hanzi].map((char) =>
                fetch(`/hanzi-data/${encodeURIComponent(char)}.json`, { method: "HEAD", signal })
                  .then((r) => r.ok)
                  .catch(() => false)
              )
            )
            return checks.every(Boolean) ? carta : null
          })
        )
        if (signal.aborted) return
        const filtradas = conDatos.filter((c): c is CartaDto => c !== null)
        if (filtradas.length === 0) {
          setSinCartas(true)
        } else {
          setCartas(filtradas)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false)
      })

    return () => controller.abort()
  }, [leccionId, token])

  // Importa HanziWriter solo del lado cliente
  useEffect(() => {
    import("hanzi-writer").then((mod) => {
      HanziWriterRef.current = mod.default
    })
  }, [])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }, [])

  const carta = cartas[cartaIndex]
  const chars = carta ? [...carta.hanzi] : []
  const hanziChar = chars[charIndex] ?? ""

  // Función principal: registra resultado y avanza o repite.
  // Recibe totalMistakes directamente del summary de hanzi-writer (valor del intento actual).
  const handleCharacterComplete = useCallback(
    (totalMistakes: number) => {
      if (!carta || !token) return
      const erroresPermitidos = modo === "FACIL" ? 2 : 0
      const completadoOk = totalMistakes <= erroresPermitidos
      const esUltimoChar = charIndex === chars.length - 1

      if (completadoOk && !esUltimoChar) {
        // Carta de 2 chars: avanzar al segundo carácter
        setCharIndex(1)
        setTrazosCorrectos(0)
        setTrazosFallados(0)
        return
      }

      // Registrar en backend — fire-and-forget para no bloquear el flujo
      // completadoSinErrores refleja la realidad (sin tolerancia de modo)
      registrarEscritura(
        carta.id,
        { modo, trazosCorrectos, trazosFallados: totalMistakes, completadoSinErrores: totalMistakes === 0 },
        token
      ).catch(() => {})

      if (completadoOk) {
        const siguiente = cartaIndex + 1
        if (siguiente >= cartas.length) {
          setCompleted(true)
        } else {
          setCartaIndex(siguiente)
          setCharIndex(0)
          setTrazosCorrectos(0)
          setTrazosFallados(0)
        }
      } else {
        // Reiniciar mismo carácter: resetear contadores y forzar recreación del writer
        setTrazosCorrectos(0)
        setTrazosFallados(0)
        setIntentoId((n) => n + 1)
        showToast("¡Casi! Inténtalo de nuevo")
      }
    },
    [carta, token, charIndex, chars.length, cartaIndex, cartas.length, modo, trazosCorrectos, showToast]
  )

  // Mantener el ref siempre apuntando a la versión más reciente del callback
  useEffect(() => {
    handleCompleteRef.current = handleCharacterComplete
  })

  // Crea/recrea el writer cuando cambia el carácter o el modo
  useEffect(() => {
    if (!HanziWriterRef.current || !targetRef.current || !hanziChar) return

    const controller = new AbortController()
    const { signal } = controller

    targetRef.current.innerHTML = ""
    writerRef.current = null

    const container = targetRef.current
    const size = Math.min(container.clientWidth || 300, 400)

    const writer = HanziWriterRef.current.create(container, hanziChar, {
      width: size,
      height: size,
      padding: 5,
      showOutline: modo === "FACIL",
      showCharacter: false,
      strokeColor: "#1A1A2E",
      outlineColor: "#D1D5DB",
      highlightColor: "#06D6A0",
      drawingColor: "#1A1A2E",
      leniency: 1.5,
      showHintAfterMisses: modo === "FACIL" ? 2 : 3,
      charDataLoader: (char, onLoad, onError) => {
        fetch(`/hanzi-data/${encodeURIComponent(char)}.json`, { signal })
          .then((res) => {
            if (!res.ok) throw new Error(`No data for ${char}`)
            return res.json()
          })
          .then(onLoad)
          .catch((err) => {
            if (err.name !== "AbortError") onError(err)
          })
      },
    })

    writerRef.current = writer
    setTrazoActual(0)
    setTotalTrazos(0)

    writer.quiz({
      onMistake: () => {
        setTrazosFallados((n) => n + 1)
      },
      onCorrectStroke: (strokeData) => {
        setTrazosCorrectos((n) => n + 1)
        setTrazoActual(strokeData.strokeNum + 1)
        // Deriva el total en el primer trazo correcto
        setTotalTrazos(strokeData.strokeNum + strokeData.strokesRemaining + 1)
      },
      onComplete: (summary) => {
        handleCompleteRef.current(summary.totalMistakes)
      },
    })

    return () => {
      controller.abort()
      if (targetRef.current) {
        targetRef.current.innerHTML = ""
      }
      writerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hanziChar, cartaIndex, charIndex, modo, intentoId])

  if (loading) return <Spinner />

  if (sinCartas || (cartas.length === 0 && !loading)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ backgroundColor: "#F8F4EE" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#555555" }}>
          No hay caracteres disponibles para practicar escritura en esta lección.
        </p>
        <a
          href={`/app/lecciones/${leccionId}`}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#E63946",
          }}
        >
          ← Volver a la lección
        </a>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6" style={{ backgroundColor: "#F8F4EE" }}>
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(6,214,160,0.15)" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M8 21L16 29L32 13" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: "#1A1A2E" }}>
          ¡Lección completada!
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555555", textAlign: "center" }}>
          Has practicado todos los caracteres disponibles.
        </p>
        <div className="flex gap-3">
          <a
            href={`/app/lecciones/${leccionId}`}
            className="rounded-[12px] px-6 py-3 text-sm transition-opacity hover:opacity-80"
            style={{
              border: "1.5px solid #1A1A2E",
              color: "#1A1A2E",
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
            }}
          >
            Volver al hub
          </a>
          <button
            onClick={() => {
              setCartaIndex(0)
              setCharIndex(0)
              setTrazosCorrectos(0)
              setTrazosFallados(0)
              setIntentoId((n) => n + 1)
              setCompleted(false)
            }}
            className="rounded-[12px] px-6 py-3 text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
          >
            Repetir
          </button>
        </div>
      </div>
    )
  }

  const progressPct = cartas.length > 0 ? Math.round((cartaIndex / cartas.length) * 100) : 0

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-[12px] px-5 py-3 text-white shadow-lg"
          style={{ backgroundColor: "#1A1A2E", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}
        >
          {toastMsg}
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <a
            href={`/app/lecciones/${leccionId}`}
            className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#555555" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lección
          </a>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
            {cartaIndex + 1} / {cartas.length}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3" style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(26,26,46,0.08)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              backgroundColor: "#E63946",
              width: `${progressPct}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Badge de modo + link para cambiar */}
        <div className="mt-5 flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              backgroundColor: modo === "FACIL" ? "rgba(6,214,160,0.12)" : "rgba(230,57,70,0.10)",
              color: modo === "FACIL" ? "#06D6A0" : "#E63946",
            }}
          >
            {modo === "FACIL" ? "Modo Fácil · con guía" : "Modo Difícil · de memoria"}
          </span>
          <a
            href={`/app/lecciones/${leccionId}`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}
            className="transition-opacity hover:opacity-60"
          >
            ← Cambiar modo
          </a>
        </div>

        {/* Layout de dos columnas */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Panel izquierdo: info del carácter */}
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-[16px] bg-white p-6"
            style={{ border: "1px solid #e8e0d6", boxShadow: "0 2px 8px rgba(26,26,46,0.04)", minHeight: 280 }}
          >
            {modo === "FACIL" && (
              <CharDisplay hanzi={carta?.hanzi ?? ""} activeIndex={charIndex} />
            )}

            <div className="text-center">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#E63946" }}>
                {carta?.pinyin}
              </p>
              <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#2D2D2D" }}>
                {carta?.traduccion}
              </p>
            </div>

            {/* Contador de trazos */}
            <div
              className="w-full rounded-[10px] px-4 py-3 text-center"
              style={{ backgroundColor: "#F8F4EE" }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                Trazo{" "}
                <span style={{ fontWeight: 600, color: "#1A1A2E" }}>
                  {trazoActual}
                </span>
                {totalTrazos > 0 && (
                  <> de <span style={{ fontWeight: 600, color: "#1A1A2E" }}>{totalTrazos}</span></>
                )}
                {"  ·  "}
                <span style={{ color: "#06D6A0", fontWeight: 600 }}>✓ {trazosCorrectos}</span>
                {"  "}
                <span style={{ color: "#E63946", fontWeight: 600 }}>✗ {trazosFallados}</span>
              </p>
              <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555555" }}>
                {modo === "FACIL" ? "Hasta 2 errores permitidos" : "Sin errores permitidos"}
              </p>
            </div>
          </div>

          {/* Panel derecho: canvas de escritura */}
          <div
            className="flex items-center justify-center rounded-[16px] bg-white p-4"
            style={{ border: "1px solid #e8e0d6", boxShadow: "0 2px 8px rgba(26,26,46,0.04)", minHeight: 280 }}
          >
            <div
              ref={targetRef}
              style={{
                width: "min(80vw, 400px)",
                height: "min(80vw, 400px)",
                minWidth: 250,
                minHeight: 250,
              }}
            />
          </div>
        </div>

        {/* Ayuda */}
        <p className="mt-4 text-center" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}>
          {modo === "FACIL"
            ? "Sigue el contorno gris para practicar el orden de trazos."
            : "Escribe el carácter de memoria. Las pistas aparecen tras 3 errores."}
        </p>

      </div>
    </div>
  )
}
