import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/login-button"
import { type User } from "@supabase/supabase-js"

interface HeaderProps {
  user?: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="font-bold text-xl text-foreground">Nano Banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Editor
          </Link>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Showcase
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-banana/10 px-3 py-1.5 text-sm">
            <span className="text-base">🍌</span>
            <span className="text-banana-dark font-medium">Pro is now live</span>
          </div>
          <LoginButton user={user} />
          <Button className="bg-banana hover:bg-banana-dark text-foreground font-medium">Try it now</Button>
        </div>
      </div>
    </header>
  )
}
