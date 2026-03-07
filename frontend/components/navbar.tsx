"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Funciones", href: "#funciones" },
  { label: "Lecciones", href: "#lecciones" },
  { label: "HSK", href: "#cta" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-hanzi-paper transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_16px_rgba(26,26,46,0.08)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-serif text-3xl font-bold text-hanzi-red">汉字</span>
          <span className="font-[var(--font-display)] text-xl font-bold text-hanzi-ink">
            hanzi
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-[var(--font-display)] text-sm font-medium text-hanzi-text transition-colors hover:text-hanzi-red"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <a
            href="/login"
            className="text-sm font-medium transition-colors hover:text-hanzi-red"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#2D2D2D" }}
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="font-[var(--font-display)] text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: "#E63946", borderRadius: "12px", padding: "10px 20px" }}
          >
            Empieza gratis
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-hanzi-ink md:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-hanzi-ink/5 bg-hanzi-paper px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-[var(--font-display)] text-base font-medium text-hanzi-text transition-colors hover:text-hanzi-red"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block text-center text-sm font-medium transition-colors hover:text-hanzi-red"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#2D2D2D" }}
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block text-center font-[var(--font-display)] text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: "#E63946", borderRadius: "12px", padding: "10px 20px" }}
          >
            Empieza gratis
          </a>
        </div>
      )}
    </header>
  )
}
