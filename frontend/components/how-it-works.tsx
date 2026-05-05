import { BookOpen, Eye, Brain } from "lucide-react"

const steps = [
  {
    icon: BookOpen,
    number: "01",
    title: "Abre la lección de hoy",
    description:
      "Encuentra el vocabulario de tu clase organizado y listo para estudiar.",
  },
  {
    icon: Eye,
    number: "02",
    title: "Aprende con carácter, pinyin y español juntos",
    description:
      "Los tres elementos en una sola tarjeta. Sin buscar en otro lado.",
  },
  {
    icon: Brain,
    number: "03",
    title: "El sistema te pregunta lo que más olvidas",
    description:
      "Repasa con active recall y llega al HSK1 sabiendo exactamente qué dominas.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-hanzi-ink px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-white md:text-4xl">
            {"¿Cómo funciona?"}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-hanzi-red" />
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting arrows — desktop only */}
          <div className="pointer-events-none absolute top-1/2 hidden w-full -translate-y-1/2 md:block" aria-hidden="true">
            <svg className="mx-auto w-full max-w-4xl" viewBox="0 0 900 40" fill="none">
              <path
                d="M230 20 H420"
                stroke="#E63946"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <polygon points="420,15 430,20 420,25" fill="#E63946" />
              <path
                d="M530 20 H700"
                stroke="#E63946"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <polygon points="700,15 710,20 700,25" fill="#E63946" />
            </svg>
          </div>

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-[16px] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm"
              style={{
                animation: `fade-up 0.5s ease ${i * 0.15}s forwards`,
              }}
            >
              {/* Step number */}
              <span className="font-[var(--font-display)] text-4xl font-extrabold text-hanzi-red">
                {step.number}
              </span>

              {/* Icon */}
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-hanzi-red/10">
                <step.icon className="h-6 w-6 text-hanzi-red" />
              </div>

              {/* Title */}
              <h3 className="mt-5 font-[var(--font-display)] text-lg font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 leading-relaxed text-[#aaa]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
