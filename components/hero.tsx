import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Banana decorations */}
      <div className="absolute top-20 left-10 text-6xl rotate-[-30deg] opacity-20 select-none hidden lg:block">🍌</div>
      <div className="absolute top-40 right-20 text-5xl rotate-[20deg] opacity-20 select-none hidden lg:block">🍌</div>
      <div className="absolute bottom-20 left-1/4 text-4xl rotate-[45deg] opacity-15 select-none hidden lg:block">
        🍌
      </div>
      <div className="absolute top-60 right-1/3 text-3xl rotate-[-15deg] opacity-15 select-none hidden md:block">
        🍌
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <Badge variant="outline" className="mb-6 border-banana bg-banana/10 text-banana-dark">
          <span className="mr-1">🍌</span>
          The AI model that outperforms Flux Kontext
        </Badge>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance text-foreground">
          Nano Banana
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 text-pretty">
          Transform any image with simple text prompts. Nano Banana&apos;s advanced model delivers consistent character
          editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-banana hover:bg-banana-dark text-foreground font-medium gap-2" asChild>
            <Link href="#generator">
              Start Editing
              <span>🍌</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="#showcase">
              View Examples
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            One-shot editing
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Multi-image support
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Natural language
          </div>
        </div>
      </div>
    </section>
  )
}
