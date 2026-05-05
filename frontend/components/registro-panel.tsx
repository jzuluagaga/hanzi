import { CheckCircle } from "lucide-react"

const pills = [
  "Flashcards con active recall real",
  "Organizado por lecciones y niveles HSK",
  "100% en español, sin configuración",
]

export function RegistroPanel() {
  return (
    <div className="relative hidden w-[45%] flex-col items-center justify-center overflow-hidden bg-hanzi-ink px-10 md:flex">
      {/* Logo top-left */}
      <div className="absolute left-8 top-8 flex items-center gap-2">
        <span className="font-serif text-2xl font-bold text-hanzi-red">汉字</span>
        <span className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
          hanzi
        </span>
      </div>

      {/* Decorative character */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 select-none font-serif font-bold leading-none"
        style={{ fontSize: 320, color: "rgba(255,255,255,0.06)" }}
        aria-hidden="true"
      >
        学
      </span>

      {/* Center content */}
      <div className="relative z-10 flex w-full max-w-[340px] flex-col items-center text-center">
        <h2 className="text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 28 }}>
          Empieza a aprender chino hoy
        </h2>
        <p className="mt-3 font-sans text-base" style={{ color: "#888" }}>
          
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          {pills.map((text) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-[12px] px-4 py-3"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <CheckCircle size={16} className="shrink-0 text-white" />
              <span className="font-sans text-sm text-white">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom social proof */}
      <p className="absolute bottom-6 left-0 right-0 text-center font-sans text-sm" style={{ color: "#555" }}>
        {"Usado por estudiantes del Instituto Confucio \ud83c\udde8\ud83c\uddf4"}
      </p>
    </div>
  )
}
