import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, User, Layers, Zap, Images, Sparkles } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Editing",
    description:
      "Edit images using simple text prompts. Nano Banana AI understands complex instructions like GPT for images",
  },
  {
    icon: User,
    title: "Character Consistency",
    description:
      "Maintain perfect character details across edits. This model excels at preserving faces and identities",
  },
  {
    icon: Layers,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description:
      "Perfect results in a single attempt. Nano Banana solves one-shot image editing challenges effortlessly",
  },
  {
    icon: Images,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
  },
  {
    icon: Sparkles,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-banana-dark mb-2">Core Features</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Nano Banana?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nano Banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
            language understanding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-banana/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4 group-hover:bg-banana/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-banana-dark" />
                </div>
                <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
