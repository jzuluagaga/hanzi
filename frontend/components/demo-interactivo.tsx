"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"

function hanziSize(text: string): string {
  const len = text.length
  if (len <= 4) return "6rem"     // text-8xl
  if (len <= 8) return "3.75rem"  // text-6xl
  return "2.25rem"                // text-4xl
}

const cards = [
  { hanzi: "你好", pinyin: "nǐ hǎo", es: "Hola" },
  { hanzi: "谢谢", pinyin: "xiè xie", es: "Gracias" },
  { hanzi: "老师", pinyin: "lǎo shī", es: "Profesor/a" },
  { hanzi: "学生", pinyin: "xué shēng", es: "Estudiante" },
  { hanzi: "中文", pinyin: "zhōng wén", es: "Chino (idioma)" },
]

export function DemoInteractivo() {
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [complete, setComplete] = useState(false)

  function handleAnswer(knewIt: boolean) {
    console.log('Card result:', knewIt)
    setTransitionEnabled(false)
    setTimeout(() => {
      setFlipped(false)
      if (current + 1 >= cards.length) {
        setComplete(true)
      } else {
        setCurrent((c) => c + 1)
      }
      setTimeout(() => setTransitionEnabled(true), 50)
    }, 0)
  }

  function handleReset() {
    setCurrent(0)
    setFlipped(false)
    setComplete(false)
  }

  return (
    <section className="px-6 py-16 lg:py-24" style={{ backgroundColor: "#1A1A2E" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif" }}
          >
            Sin crear cuenta
          </span>
          <h2
            className="mt-3 text-3xl font-bold text-white text-balance md:text-4xl"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Pruébalo ahora
          </h2>
          <p className="mt-3 text-lg" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
            5 palabras del HSK1. Voltea la tarjeta, dinos si la sabías. Así de simple.
          </p>
        </div>

        {/* Progress dots */}
        {!complete && (
          <div className="mb-8 flex items-center justify-center gap-2">
            {cards.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-sm transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "8px",
                  backgroundColor: i === current ? "#E63946" : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        )}

        {/* Card area */}
        <div className="flex flex-col items-center">
          {complete ? (
            /* Completion state */
            <div
              className="flex w-full max-w-[480px] flex-col items-center justify-center rounded-[20px] px-8 py-12 text-center"
              style={{
                backgroundColor: "white",
                boxShadow: "0 8px 40px rgba(230,57,70,0.15)",
                minHeight: "280px",
              }}
            >
              <p className="text-5xl">🎉</p>
              <h3
                className="mt-4 text-2xl font-bold"
                style={{ fontFamily: "'Sora', sans-serif", color: "#1A1A2E" }}
              >
                ¡Completaste el demo!
              </h3>
              <p className="mt-2 text-base" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
                Hay más de 150 palabras esperándote.
              </p>
              <a
                href="/register"
                className="mt-6 block w-full text-center font-semibold text-white transition-transform hover:scale-[1.01]"
                style={{
                  backgroundColor: "#E63946",
                  borderRadius: "12px",
                  padding: "14px",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Crear cuenta gratis — es gratis
              </a>
              <a
                href="#lecciones"
                className="mt-3 text-sm hover:underline"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}
              >
                Ver todas las lecciones →
              </a>
              <button
                onClick={handleReset}
                className="mt-4 text-xs hover:underline"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#555" }}
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <>
              {/* Flashcard with 3D flip */}
              <div
                className="w-full max-w-[480px] cursor-pointer"
                style={{ perspective: "1000px", height: "280px" }}
                onClick={() => setFlipped(true)}
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
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-white px-8"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      boxShadow: "0 8px 40px rgba(230,57,70,0.15)",
                    }}
                  >
                    <span
                      className="absolute right-4 top-4"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "#888",
                        backgroundColor: "rgba(230,57,70,0.08)",
                        border: "1px solid rgba(230,57,70,0.15)",
                        borderRadius: "9999px",
                        padding: "4px 12px",
                      }}
                    >
                      Toca para ver
                    </span>
                    <p
                      className="select-none leading-none"
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontWeight: 300,
                        fontSize: hanziSize(cards[current].hanzi),
                        color: "#1A1A2E",
                      }}
                    >
                      {cards[current].hanzi}
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-white px-8"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 8px 40px rgba(230,57,70,0.15)",
                    }}
                  >
                    <p
                      className="select-none"
                      style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: "24px",
                        color: "#888",
                      }}
                    >
                      {cards[current].hanzi}
                    </p>
                    <p
                      className="mt-1 font-bold"
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "28px",
                        color: "#1A1A2E",
                      }}
                    >
                      {cards[current].es}
                    </p>
                    <p
                      className="mt-1"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#E63946" }}
                    >
                      {cards[current].pinyin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer buttons — only visible after flip */}
              <div
                className="mt-6 flex w-full max-w-[480px] gap-3 transition-all duration-300"
                style={{ opacity: flipped ? 1 : 0, pointerEvents: flipped ? "auto" : "none" }}
              >
                {/* No lo sabía */}
                <button
                  onClick={() => handleAnswer(false)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all duration-150"
                  style={{
                    backgroundColor: "rgba(230,57,70,0.15)",
                    borderColor: "#E63946",
                    color: "#E63946",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = "#E63946"
                    el.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = "rgba(230,57,70,0.15)"
                    el.style.color = "#E63946"
                  }}
                >
                  <X size={16} />
                  <span className="hidden sm:inline">No lo sabía</span>
                </button>

                {/* ¡Lo supe! */}
                <button
                  onClick={() => handleAnswer(true)}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all duration-150"
                  style={{
                    backgroundColor: "rgba(6,214,160,0.15)",
                    borderColor: "#06D6A0",
                    color: "#06D6A0",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = "#06D6A0"
                    el.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = "rgba(6,214,160,0.15)"
                    el.style.color = "#06D6A0"
                  }}
                >
                  <Check size={16} />
                  <span className="hidden sm:inline">{"¡Lo supe!"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
