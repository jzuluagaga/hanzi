export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-hanzi-red px-6 py-16 lg:py-24">
      {/* Decorative character */}
      <span
        className="pointer-events-none absolute bottom-[-40px] right-[-20px] select-none font-serif text-[300px] font-bold text-white/5 lg:right-[40px] lg:text-[400px]"
        aria-hidden="true"
      >
        学
      </span>

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="font-[var(--font-sora)] text-3xl font-extrabold text-white text-balance md:text-5xl">
          {"¿Listo para aprobar el HSK?"}
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
          {"Únete a estudiantes hispanohablantes que ya están memorizando más rápido."}
        </p>

        <a
          href="/register"
          className="mt-8 inline-block rounded-[12px] bg-white px-8 py-3.5 font-[var(--font-sora)] text-base font-semibold text-hanzi-red shadow-lg transition-transform hover:scale-[1.03]"
        >
          {"Crear cuenta gratis \u2192"}
        </a>
      </div>
    </section>
  )
}
