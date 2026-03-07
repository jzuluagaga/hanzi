export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hanzi-paper px-6 py-20 lg:py-28">
      {/* Decorative background characters */}
      <span
        className="pointer-events-none absolute right-[-40px] top-1/2 -translate-y-1/2 rotate-[-8deg] select-none font-serif text-[320px] font-bold text-hanzi-ink/5 lg:right-[40px] lg:text-[420px]"
        aria-hidden="true"
      >
        汉字
      </span>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left side — copy */}
        <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          {/* Pill badge */}
          <span className="mb-6 inline-block rounded-full bg-hanzi-gold px-4 py-1.5 font-[var(--font-display)] text-xs font-semibold text-hanzi-ink">
            {"Para estudiantes hispanohablantes de chino \ud83c\udde8\ud83c\uddf4\ud83c\uddf2\ud83c\uddfd\ud83c\udde6\ud83c\uddf7"}
          </span>

          <h1
            className="text-balance text-hanzi-ink"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
              color: "#1A1A2E",
            }}
          >
            {"Aprende vocabulario y prepárate para exámenes, así de fácil."}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-hanzi-text-muted">
            {"Estudia el vocabulario oficial del HSK1 con flashcards inteligentes, todo en español. Sin configurar nada, sin perder tiempo."}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/register"
              className="rounded-[12px] bg-hanzi-red px-7 py-3 font-[var(--font-display)] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(230,57,70,0.35)] transition-transform hover:scale-105"
            >
              Crear cuenta gratis
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-5 text-sm text-[#888]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {"Usado por estudiantes del Instituto Confucio \ud83c\udde8\ud83c\uddf4"}
          </p>
        </div>

        {/* Right side — flashcard mockup */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="relative rotate-[-3deg] rounded-2xl bg-white px-10 py-12 shadow-[0_20px_50px_rgba(26,26,46,0.1)] transition-transform hover:rotate-0 hover:shadow-[0_24px_60px_rgba(26,26,46,0.14)] md:px-14 md:py-16">
            <p className="text-center font-serif text-7xl text-hanzi-ink md:text-8xl">
              你好
            </p>
            <p className="mt-4 text-center font-[var(--font-display)] text-xl font-semibold text-hanzi-red">
              {"nǐ hǎo"}
            </p>
            <p className="mt-2 text-center text-lg text-hanzi-text-muted">
              {"Hola / Buenos días"}
            </p>
            {/* small jade success dot */}
            <span className="absolute right-4 top-4 inline-block h-3 w-3 rounded-full bg-hanzi-jade" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
