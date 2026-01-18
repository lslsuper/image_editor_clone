import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍌</span>
            <span className="font-bold text-lg text-foreground">Nano Banana</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">© 2026 Nano Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
