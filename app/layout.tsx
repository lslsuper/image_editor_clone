import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nano Banana - AI Image Editor | Edit Photos with Text",
  description:
    "Transform any image with simple text prompts. Nano Banana delivers consistent character editing and scene preservation. Experience the future of AI image editing.",
  keywords: ["AI image editor", "photo editing", "text to image", "image generation", "Nano Banana"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <GlobalErrorHandler />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
