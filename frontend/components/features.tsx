import { Layers, Type, BarChart2, Zap, Globe, GraduationCap } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "El vocabulario exacto de tu lección y del HSK1",
    description:
      "Vocabulario oficial del HSK1 y HSK2, estructurado para que avances con confianza.",
  },
  {
    icon: Type,
    title: "Carácter + Pinyin + Español, siempre juntos",
    description:
      "Los tres elementos juntos para conectar escritura, pronunciación y significado de forma natural.",
  },
  {
    icon: BarChart2,
    title: "Tu cerebro recuerda más con active recall",
    description:
      "No solo leas las palabras. Recuérdalas activamente con feedback inmediato.",
  },
  {
    icon: Zap,
    title: "Abre la app y empieza. Sin configurar nada.",
    description:
      "Empieza a estudiar en segundos. Sin importar mazos ni setups tediosos.",
  },
  {
    icon: Globe,
    title: "En tu idioma, desde el primer día",
    description:
      "Toda la interfaz en español. Pensado para hispanohablantes, no adaptado.",
  },
  {
    icon: GraduationCap,
    title: "Llega al examen sabiendo que estás listo",
    description:
      "Simula el examen real y llega al día de la prueba sin sorpresas.",
  },
]

export function Features() {
  return (
    <section id="funciones" className="bg-hanzi-paper px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="mb-14 text-center font-[var(--font-display)] text-3xl font-bold text-hanzi-ink text-balance md:text-4xl">
          Todo lo que necesitas para dominar el chino
        </h2>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group cursor-pointer rounded-[16px] bg-white p-8 shadow-[0_4px_24px_rgba(230,57,70,0.07)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(230,57,70,0.13)]"
            >
              {/* Icon circle */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-hanzi-red">
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="mt-5 font-[var(--font-display)] text-lg font-semibold text-hanzi-ink">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 leading-relaxed text-hanzi-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
