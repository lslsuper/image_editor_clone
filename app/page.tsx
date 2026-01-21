import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Generator } from "@/components/generator"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Reviews } from "@/components/reviews"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

// 保持动态渲染
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-background">
      <Header user={user} />
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
