import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | Hanzi",
}

export default function PrivacidadPage() {
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
          Política de Privacidad
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
              1. Datos que recopilamos
            </h2>
            <p>Recopilamos únicamente los datos necesarios para el funcionamiento del servicio:</p>
            <ul className="mt-2 list-disc pl-5 flex flex-col gap-1">
              <li>Nombre y correo electrónico al registrarte</li>
              <li>Contraseña (almacenada cifrada, nunca en texto plano)</li>
              <li>Tu progreso de estudio: qué cartas has visto y cuándo las repasarás</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              2. Cómo usamos tus datos
            </h2>
            <p>Usamos tus datos exclusivamente para:</p>
            <ul className="mt-2 list-disc pl-5 flex flex-col gap-1">
              <li>Identificarte y darte acceso a tu cuenta</li>
              <li>Mostrarte tu progreso y calcular los repasos del día</li>
              <li>Mejorar el funcionamiento del servicio</li>
            </ul>
            <p className="mt-3">
              No vendemos ni compartimos tus datos con terceros.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              3. Almacenamiento y seguridad
            </h2>
            <p>
              Tus datos se almacenan en servidores seguros. Las contraseñas se guardan usando BCrypt.
              Usamos JWT con expiración para autenticar las sesiones.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              4. Cookies
            </h2>
            <p>
              Usamos una cookie de sesión (<code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: 4 }}>hanzi_token</code>) para
              mantenerte autenticado. No usamos cookies de seguimiento ni publicidad.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              5. Tus derechos
            </h2>
            <p>Puedes en cualquier momento:</p>
            <ul className="mt-2 list-disc pl-5 flex flex-col gap-1">
              <li>Actualizar tu nombre desde tu perfil</li>
              <li>Cambiar tu contraseña desde tu perfil</li>
              <li>Solicitar la eliminación de tu cuenta escribiéndonos</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 18, color: "#1A1A2E", marginBottom: 8 }}>
              6. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre privacidad escríbenos a{" "}
              <span style={{ color: "#E63946" }}>juanpablozulu8@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
