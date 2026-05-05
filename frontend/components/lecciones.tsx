import { ArrowRight } from "lucide-react"

const lessons = [
  { number: 1, title: "Saludos y presentaciones" },
  { number: 2, title: "Familia y personas" },
  { number: 3, title: "Números y fechas" },
  { number: 4, title: "Comida y bebida" },
]

export function Lecciones() {
  return (
    <section id="lecciones" className="bg-hanzi-paper px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-14 text-center">
          <h2
            className="text-3xl text-hanzi-ink text-balance md:text-4xl"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
          >
            {"Lo que ves en clase, listo para estudiar"}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-lg leading-relaxed text-hanzi-text-muted">
            {"El vocabulario está organizado por lecciones para que repases exactamente lo que viste hoy, sin perder el hilo ni buscar en tres sitios distintos."}
          </p>
        </div>

        {/* Lesson cards — horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {lessons.map((lesson, i) => (
            <div
              key={lesson.number}
              className="group flex min-w-[260px] cursor-pointer flex-col justify-between rounded-2xl border-t-4 border-hanzi-red bg-card p-6 shadow-[0_4px_24px_rgba(230,57,70,0.07)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(230,57,70,0.13)]"
              style={{
                animation: `fade-up 0.5s ease ${i * 0.1}s forwards`,
              }}
            >
              {/* Lesson number */}
              <div>
                <span
                  className="text-sm text-hanzi-red"
                  style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
                >
                  {"Lección " + lesson.number}
                </span>

                {/* Title */}
                <h3
                  className="mt-2 text-lg text-hanzi-ink"
                  style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
                >
                  {lesson.title}
                </h3>
              </div>

              {/* Bottom row */}
              <div className="mt-6 flex items-center justify-end">
                <a
                  href="/register"
                  className="flex items-center gap-1 text-sm text-hanzi-red transition-all group-hover:underline"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Estudiar
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="mt-10 text-center">
          <a
            href="#cta"
            className="text-hanzi-red transition-colors hover:underline"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {"Ver todas las lecciones \u2192"}
          </a>
        </div>
      </div>
    </section>
  )
}
