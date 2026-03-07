const footerLinks = [
  { label: "Funciones", href: "#funciones" },
  { label: "Lecciones", href: "#lecciones" },
  { label: "HSK", href: "#cta" },
  { label: "Contacto", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-hanzi-ink px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-hanzi-red">汉字</span>
          <span className="font-[var(--font-display)] text-lg font-bold text-white">
            hanzi
          </span>
        </a>

        {/* Links */}
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-[#888] transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Made in */}
        <p className="text-sm text-[#888]">
          {"Hecho con \u2764\uFE0F en Colombia \ud83c\udde8\ud83c\uddf4"}
        </p>
      </div>

      {/* Bottom divider */}
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-center">
        <p className="text-xs text-[#666]">
          {"© 2025 Hanzi. Todos los derechos reservados."}
        </p>
      </div>
    </footer>
  )
}
