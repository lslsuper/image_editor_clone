import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Generator } from "@/components/generator"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Reviews } from "@/components/reviews"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Generator />
      <Features />
      <Showcase />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  )
}
