"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { getQuiz, type PreguntaDto, type QuizDto } from "@/lib/api"

type AnswerState = "unanswered" | "correct" | "wrong"

interface QuestionResult {
  pregunta: PreguntaDto
  userAnswer: string
  correct: boolean
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
          Pregunta {current} de {total}
        </span>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, color: "#E63946" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(26,26,46,0.08)" }}>
        <div
          style={{
            height: "100%",
            borderRadius: 3,
            backgroundColor: "#E63946",
            width: `${pct}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  )
}

function tipoLabel(tipo: PreguntaDto["tipo"]): string {
  switch (tipo) {
    case "HANZI_TO_TRANSLATION": return "¿Cuál es la traducción?"
    case "TRANSLATION_TO_HANZI": return "¿Cómo se escribe en chino?"
    case "HANZI_TO_PINYIN": return "¿Cuál es el pinyin?"
  }
}

function promptIsHanzi(tipo: PreguntaDto["tipo"]): boolean {
  return tipo === "HANZI_TO_TRANSLATION" || tipo === "HANZI_TO_PINYIN"
}

function optionsAreHanzi(tipo: PreguntaDto["tipo"]): boolean {
  return tipo === "TRANSLATION_TO_HANZI"
}

function hanziSize(text: string): string {
  const len = text.length
  if (len <= 4) return "6rem"
  if (len <= 8) return "3.75rem"
  return "2.25rem"
}

function optionColors(state: AnswerState, isCorrect: boolean, selected: boolean) {
  if (state === "unanswered") {
    return {
      background: "#ffffff",
      border: "1.5px solid #e8e0d6",
      color: "#1A1A2E",
    }
  }
  if (isCorrect) {
    return {
      background: "rgba(6,214,160,0.10)",
      border: "1.5px solid #06D6A0",
      color: "#06D6A0",
    }
  }
  if (selected) {
    return {
      background: "rgba(230,57,70,0.08)",
      border: "1.5px solid #E63946",
      color: "#E63946",
    }
  }
  return {
    background: "#ffffff",
    border: "1.5px solid #e8e0d6",
    color: "#555555",
  }
}

function QuestionScreen({
  pregunta,
  index,
  total,
  onNext,
  isLast,
}: {
  pregunta: PreguntaDto
  index: number
  total: number
  onNext: (answer: string, correct: boolean) => void
  isLast: boolean
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<AnswerState>("unanswered")

  function handleSelect(opcion: string) {
    if (state !== "unanswered") return
    setSelected(opcion)
    setState(opcion === pregunta.correctAnswer ? "correct" : "wrong")
  }

  function handleNext() {
    onNext(selected!, selected === pregunta.correctAnswer)
  }

  const isHanziPrompt = promptIsHanzi(pregunta.tipo)

  return (
    <div className="flex flex-col">
      <ProgressBar current={index + 1} total={total} />

      {/* Type label */}
      <p
        className="mb-3 text-center"
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          fontSize: 22,
          color: "#E63946",
        }}
      >
        {tipoLabel(pregunta.tipo)}
      </p>

      {/* Prompt */}
      <div
        className="mb-8 flex min-h-[120px] items-center justify-center rounded-[16px] px-6 py-6"
        style={{
          backgroundColor: "#ffffff",
          border: "1.5px solid #e8e0d6",
          boxShadow: "0 4px 20px rgba(26,26,46,0.07)",
        }}
      >
        {isHanziPrompt ? (
          <span
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 400,
              fontSize: hanziSize(pregunta.prompt),
              color: "#1A1A2E",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {pregunta.prompt}
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 22,
              color: "#1A1A2E",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {pregunta.prompt}
          </span>
        )}
      </div>

      {/* Options 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {pregunta.opciones.map((opcion) => {
          const isCorrect = opcion === pregunta.correctAnswer
          const isSelected = opcion === selected
          const colors = optionColors(state, isCorrect, isSelected)
          const hanziOption = optionsAreHanzi(pregunta.tipo)
          return (
            <button
              key={opcion}
              onClick={() => handleSelect(opcion)}
              disabled={state !== "unanswered"}
              className={`rounded-[12px] px-4 py-4 transition-opacity ${hanziOption ? "text-center" : "text-left"}`}
              style={{
                background: colors.background,
                border: colors.border,
                color: colors.color,
                fontFamily: hanziOption ? "'Noto Serif SC', serif" : "'DM Sans', sans-serif",
                fontWeight: hanziOption ? 400 : 500,
                fontSize: hanziOption ? 46 : 22,
                cursor: state === "unanswered" ? "pointer" : "default",
                wordBreak: "break-word",
                lineHeight: 1.3,
              }}
            >
              {opcion}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      {state !== "unanswered" && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-[12px] py-3 text-white transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#E63946",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {isLast ? "Ver resultados →" : "Siguiente →"}
        </button>
      )}
    </div>
  )
}

function ResultsScreen({
  results,
  total,
  leccionId,
  onRepeat,
}: {
  results: QuestionResult[]
  total: number
  leccionId: string
  onRepeat: () => void
}) {
  const correct = results.filter((r) => r.correct).length
  const pct = Math.round((correct / total) * 100)

  let mensaje: string
  if (pct >= 80) mensaje = "¡Excelente!"
  else if (pct >= 50) mensaje = "¡Buen trabajo!"
  else mensaje = "Sigue practicando"

  const falladas = results.filter((r) => !r.correct)

  return (
    <div className="flex flex-col">
      {/* Score */}
      <div
        className="mb-6 flex flex-col items-center rounded-[20px] py-10"
        style={{ backgroundColor: "#ffffff", border: "1.5px solid #e8e0d6", boxShadow: "0 4px 20px rgba(26,26,46,0.07)" }}
      >
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 56,
            color: "#1A1A2E",
            lineHeight: 1,
          }}
        >
          {correct} <span style={{ color: "#e8e0d6" }}>/</span> {total}
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 20,
            color: pct >= 80 ? "#06D6A0" : pct >= 50 ? "#FFD166" : "#E63946",
          }}
        >
          {mensaje}
        </p>
      </div>

      {/* Mistakes */}
      {falladas.length > 0 && (
        <div className="mb-6">
          <p
            className="mb-3"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#1A1A2E",
            }}
          >
            Respuestas incorrectas
          </p>
          <div className="flex flex-col gap-3">
            {falladas.map((r, i) => (
              <div
                key={i}
                className="rounded-[14px] p-4"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e0d6",
                  boxShadow: "0 2px 8px rgba(26,26,46,0.04)",
                }}
              >
                <p
                  style={{
                    fontFamily: promptIsHanzi(r.pregunta.tipo) ? "'Noto Serif SC', serif" : "'DM Sans', sans-serif",
                    fontWeight: promptIsHanzi(r.pregunta.tipo) ? 400 : 600,
                    fontSize: 18,
                    color: "#1A1A2E",
                  }}
                >
                  {r.pregunta.prompt}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                    Tu respuesta:{" "}
                    <span style={{ color: "#E63946", fontWeight: 600 }}>{r.userAnswer}</span>
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                    Correcta:{" "}
                    <span style={{ color: "#06D6A0", fontWeight: 600 }}>{r.pregunta.correctAnswer}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onRepeat}
          className="w-full rounded-[12px] py-3 text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15 }}
        >
          Repetir quiz
        </button>
        <a
          href={`/app/lecciones/${leccionId}`}
          className="block w-full rounded-[12px] py-3 text-center transition-opacity hover:opacity-80"
          style={{
            border: "1.5px solid #1A1A2E",
            color: "#1A1A2E",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Volver a la lección
        </a>
      </div>
    </div>
  )
}

export function LeccionQuiz({ id }: { id: string }) {
  const { token } = useAuth()
  const [quiz, setQuiz] = useState<QuizDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [done, setDone] = useState(false)

  const loadQuiz = useCallback(() => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setResults([])
    setDone(false)
    getQuiz(id, token)
      .then(setQuiz)
      .catch((e) => setError(e.message ?? "No se pudo cargar el quiz"))
      .finally(() => setIsLoading(false))
  }, [token, id])

  useEffect(() => { loadQuiz() }, [loadQuiz])

  function handleNext(answer: string, correct: boolean) {
    const pregunta = quiz!.preguntas[currentIndex]
    const newResults = [...results, { pregunta, userAnswer: answer, correct }]
    setResults(newResults)
    if (currentIndex + 1 >= quiz!.preguntas.length) {
      setDone(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

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

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F8F4EE" }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#555555" }}>
            {error ?? "No se pudo cargar el quiz"}
          </p>
          <button
            onClick={loadQuiz}
            className="rounded-[12px] px-6 py-2.5 text-white"
            style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14 }}
          >
            Reintentar
          </button>
          <a
            href={`/app/lecciones/${id}`}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}
          >
            Volver a la lección
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-xl px-5 py-8 md:px-8">

        {/* Back */}
        <a
          href={`/app/lecciones/${id}`}
          className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#555555" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {quiz.leccionNombre}
        </a>

        {/* Title */}
        <div className="mt-5 mb-6">
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
            Quiz
          </p>
          <h1
            className="mt-1"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 26, color: "#1A1A2E", lineHeight: 1.2 }}
          >
            {quiz.leccionNombre}
          </h1>
        </div>

        {done ? (
          <ResultsScreen
            results={results}
            total={quiz.totalPreguntas}
            leccionId={id}
            onRepeat={loadQuiz}
          />
        ) : (
          <QuestionScreen
            key={currentIndex}
            pregunta={quiz.preguntas[currentIndex]}
            index={currentIndex}
            total={quiz.totalPreguntas}
            onNext={handleNext}
            isLast={currentIndex + 1 >= quiz.totalPreguntas}
          />
        )}
      </div>
    </div>
  )
}
