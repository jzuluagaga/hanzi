export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "#F8F4EE" }}
    >
      {/* Decorative background character */}
      <span
        className="pointer-events-none absolute select-none font-serif"
        style={{
          fontSize: "clamp(200px, 40vw, 400px)",
          color: "#1A1A2E",
          opacity: 0.05,
          fontWeight: 700,
          lineHeight: 1,
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        迷
      </span>

      {/* Content */}
      <div className="relative flex max-w-[480px] flex-col items-center text-center">
        {/* 404 number */}
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(72px, 15vw, 120px)",
            color: "#E63946",
            lineHeight: 1,
          }}
        >
          404
        </p>

        {/* Heading */}
        <h2
          className="mt-4"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 5vw, 28px)",
            color: "#1A1A2E",
          }}
        >
          Página no encontrada
        </h2>

        {/* Subtitle */}
        <p
          className="mt-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            color: "#555555",
            lineHeight: 1.6,
          }}
        >
          La página que buscas no existe o fue movida.
        </p>

        {/* CTA button */}
        <a
          href="/"
          className="mt-8 inline-block text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "#E63946",
            borderRadius: "12px",
            padding: "12px 24px",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
