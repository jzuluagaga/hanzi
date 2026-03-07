import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { DemoInteractivo } from "@/components/demo-interactivo"
import { Lecciones } from "@/components/lecciones"
import { Features } from "@/components/features"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <DemoInteractivo />
      <Lecciones />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
