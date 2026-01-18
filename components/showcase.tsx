import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const showcaseItems = [
  {
    image: "/ai-generated-majestic-mountain-landscape-with-snow.jpg",
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
  },
  {
    image: "/ai-generated-beautiful-zen-garden-with-cherry-blos.jpg",
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
  },
  {
    image: "/ai-generated-tropical-beach-sunset-with-palm-trees.jpg",
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
  },
  {
    image: "/ai-generated-northern-aurora-borealis-over-mountai.jpg",
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-banana-dark mb-2">Showcase</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lightning-Fast AI Creations</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {showcaseItems.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden bg-background border border-border/50 hover:border-banana/50 transition-all"
            >
              <div className="aspect-[3/2] relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2 bg-banana/20 text-banana-dark border-0">
                  <span className="mr-1">🍌</span>
                  Nano Banana Speed
                </Badge>
                <h4 className="text-lg font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button className="bg-banana hover:bg-banana-dark text-foreground font-medium gap-2" asChild>
            <a href="#generator">
              Try Nano Banana Generator
              <span>🍌</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
