import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { DemoInteractivo } from "@/components/demo-interactivo"
import { Lecciones } from "@/components/lecciones"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DemoInteractivo />
      <Lecciones />
      <CTA />
      <Footer />
    </main>
  )
}
