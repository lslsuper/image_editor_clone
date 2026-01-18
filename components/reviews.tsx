import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const reviews = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    avatar: "AA",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    avatar: "CC",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    avatar: "PE",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-banana-dark mb-2">User Reviews</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What creators are saying</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="border-border/50 hover:border-banana/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="bg-banana/20">
                    <AvatarFallback className="text-banana-dark font-medium">{review.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&ldquo;{review.content}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
