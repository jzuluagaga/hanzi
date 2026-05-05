import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Hanzi",
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EE" }}>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#E63946" }}
        >
          ← Volver al inicio
        </a>

        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 32, color: "#1A1A2E" }}>
          Términos y Condiciones
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", marginTop: 8 }}>
          Última actualización: abril 2025
        </p>

        <div
          className="mt-10 flex flex-col gap-8"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#444", lineHeight: 1.7 }}
        >
          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              1. Aceptación
            </h2>
            <p>
              Al crear una cuenta en Hanzi aceptas estos términos. Si no estás de acuerdo, no uses el servicio.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              2. Descripción del servicio
            </h2>
            <p>
              Hanzi es una aplicación de aprendizaje de vocabulario chino mandarín mediante tarjetas de memoria
              con repaso espaciado. El servicio se ofrece de forma gratuita y puede cambiar o interrumpirse en
              cualquier momento.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              3. Cuentas de usuario
            </h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que
              ocurran en tu cuenta. Debes notificarnos inmediatamente si detectas un uso no autorizado.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              4. Uso aceptable
            </h2>
            <p>
              Queda prohibido usar Hanzi para actividades ilegales, intentar acceder a cuentas de otros usuarios,
              o interferir con el funcionamiento del servicio.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              5. Limitación de responsabilidad
            </h2>
            <p>
              Hanzi se ofrece "tal cual". No garantizamos que el servicio esté libre de errores ni que esté
              disponible de forma ininterrumpida. No somos responsables de pérdidas de datos o interrupciones del servicio.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              6. Cambios en los términos
            </h2>
            <p>
              Podemos actualizar estos términos en cualquier momento. Te notificaremos de cambios importantes.
              El uso continuado del servicio implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              7. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre estos términos escríbenos a{" "}
              <span style={{ color: "#E63946" }}>juanpablozulu8@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
