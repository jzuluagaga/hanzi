"use client"

import { useState } from "react"
import { ArrowLeft, X, Check } from "lucide-react"

const CARDS = [
  { hanzi: "家", pinyin: "jiā", traduccion: "Casa / Familia" },
  { hanzi: "爸爸", pinyin: "bà ba", traduccion: "Papá" },
  { hanzi: "妈妈", pinyin: "mā ma", traduccion: "Mamá" },
  { hanzi: "哥哥", pinyin: "gē ge", traduccion: "Hermano mayor" },
  { hanzi: "妹妹", pinyin: "mèi mei", traduccion: "Hermana menor" },
]

export function LessonStudy({ id }: { id: string }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [answered, setAnswered] = useState(false)

  const total = CARDS.length
  const current = index + 1
  const card = CARDS[index]
  const progress = (current / total) * 100

  function handleFlip() {
    if (!flipped) {
      setFlipped(true)
      setAnswered(false)
    }
  }

  function handleAnswer() {
    setFlipped(false)
    setAnswered(false)
    if (index + 1 >= total) {
      setTimeout(() => setDone(true), 520)
    } else {
      setTimeout(() => setIndex((i) => i + 1), 520)
    }
  }

  function handleReset() {
    setIndex(0)
    setFlipped(false)
    setAnswered(false)
    setDone(false)
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
            href="/app"
            className="flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ color: "#888888" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888888")}
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </a>
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#ffffff",
            }}
          >
            {`Lección ${id} · Familia y personas`}
          </span>
        </div>
        {!done && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#888888",
            }}
          >
            {current} / {total}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="h-[6px] w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: "#E63946" }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        {done ? (
          /* Session complete */
          <div className="flex w-full max-w-sm flex-col items-center text-center gap-5">
            <span style={{ fontSize: 64 }}>{"🎉"}</span>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                color: "#ffffff",
              }}
            >
              ¡Lección completada!
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#888888", fontSize: 15 }}>
              Has repasado todas las palabras de esta lección.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <a
                href="/app"
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-90"
                style={{
                  backgroundColor: "#E63946",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#ffffff",
                }}
              >
                Volver al inicio
              </a>
              <button
                onClick={handleReset}
                className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150 hover:opacity-80"
                style={{
                  backgroundColor: "rgba(255,255,255,0.10)",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#ffffff",
                }}
              >
                Repasar de nuevo
              </button>
            </div>
          </div>
        ) : (
          /* Flashcard */
          <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
            {/* Card with 3D flip */}
            <div
              className="w-full cursor-pointer"
              style={{ perspective: "1000px", height: 320 }}
              onClick={handleFlip}
            >
              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.5s ease",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px]"
                  style={{
                    backgroundColor: "#F8F4EE",
                    backfaceVisibility: "hidden",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    className="absolute right-4 top-4 rounded-full px-3 py-1"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "#aaaaaa",
                      backgroundColor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    Toca para ver
                  </span>
                  <span
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 800,
                      fontSize: 96,
                      color: "#1A1A2E",
                      lineHeight: 1,
                    }}
                  >
                    {card.hanzi}
                  </span>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px]"
                  style={{
                    backgroundColor: "#ffffff",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Noto Serif SC', serif",
                      fontWeight: 400,
                      fontSize: 24,
                      color: "#888888",
                      marginBottom: 12,
                    }}
                  >
                    {card.hanzi}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: 700,
                      fontSize: 32,
                      color: "#1A1A2E",
                      textAlign: "center",
                      padding: "0 24px",
                    }}
                  >
                    {card.traduccion}
                  </span>
                  <span
                    className="mt-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      color: "#E63946",
                    }}
                  >
                    {card.pinyin}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction / Answer buttons */}
            {!flipped ? (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#888888",
                  textAlign: "center",
                }}
              >
                Toca la tarjeta para ver la traducción
              </p>
            ) : (
              <div
                className="flex w-full gap-3"
                style={{
                  animation: "fade-up 0.3s ease both",
                }}
              >
                {/* No recordé */}
                <button
                  onClick={handleAnswer}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-[12px] py-[14px] px-6 transition-colors duration-150"
                  style={{
                    backgroundColor: "rgba(230,57,70,0.15)",
                    border: "1px solid #E63946",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#E63946",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.backgroundColor = "#E63946"
                    el.style.color = "#ffffff"
                    const icon = el.querySelector("svg")
                    if (icon) (icon as SVGElement).style.color = "#ffffff"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.backgroundColor = "rgba(230,57,70,0.15)"
                    el.style.color = "#E63946"
                    const icon = el.querySelector("svg")
                    if (icon) (icon as SVGElement).style.color = "#E63946"
                  }}
                >
                  <X size={18} />
                  No recordé
                </button>

                {/* Lo recordé */}
                <button
                  onClick={handleAnswer}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-[12px] py-[14px] px-6 transition-colors duration-150"
                  style={{
                    backgroundColor: "rgba(6,214,160,0.15)",
                    border: "1px solid #06D6A0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#06D6A0",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.backgroundColor = "#06D6A0"
                    el.style.color = "#ffffff"
                    const icon = el.querySelector("svg")
                    if (icon) (icon as SVGElement).style.color = "#ffffff"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.backgroundColor = "rgba(6,214,160,0.15)"
                    el.style.color = "#06D6A0"
                    const icon = el.querySelector("svg")
                    if (icon) (icon as SVGElement).style.color = "#06D6A0"
                  }}
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
