export function HskHome() {
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">

        <div className="mb-6">
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#1A1A2E", fontSize: 26 }}>
            Vocabulario HSK
          </h1>
          <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: 16 }}>
            Vocabulario oficial del examen, organizado por categorías.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] p-10 text-center"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <span
            className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 140, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}
            aria-hidden="true"
          >
            HSK
          </span>

          <div className="relative z-10 flex flex-col items-center gap-4">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs text-white"
              style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
            >
              En desarrollo
            </span>

            <h2 className="text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 32 }}>
              Próximamente
            </h2>

            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#aaa", fontSize: 15, maxWidth: 380 }}>
              Estamos preparando el módulo HSK con vocabulario oficial organizado por niveles y categorías.
            </p>

            <span className="select-none font-serif font-bold" style={{ fontSize: 48, color: "#E63946", marginTop: 8 }}>
              快来了!
            </span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#666", fontSize: 12 }}>
              ¡Pronto llega!
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
