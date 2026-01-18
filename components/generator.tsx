"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Sparkles, X, Lock, ArrowRight } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { createLogger } from "@/lib/logger"

const logger = createLogger('Component:Generator')

export function Generator() {
  const [images, setImages] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("nano-banana")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.debug('handleImageUpload', 'File input change detected')
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        logger.debug('handleImageUpload', 'Processing file', { name: file.name, size: file.size, type: file.type })
        
        if (file.size > 10 * 1024 * 1024) {
          logger.warn('handleImageUpload', 'File size limit exceeded', { size: file.size })
          toast.error("File size must be less than 10MB")
          return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            logger.info('handleImageUpload', 'Image loaded successfully', { name: file.name })
            setImages((prev) => [...prev, event.target!.result as string].slice(0, 9))
          }
        }
        reader.onerror = (error) => {
          logger.error('handleImageUpload', 'FileReader error', error)
          toast.error("Failed to read file")
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    logger.debug('handleDrop', 'Files dropped')
    
    const files = e.dataTransfer.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
            logger.warn('handleDrop', 'Invalid file type ignored', { type: file.type })
            return
        }
        if (file.size > 10 * 1024 * 1024) {
          logger.warn('handleDrop', 'File size limit exceeded', { size: file.size })
          toast.error("File size must be less than 10MB")
          return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            logger.info('handleDrop', 'Image loaded successfully', { name: file.name })
            setImages((prev) => [...prev, event.target!.result as string].slice(0, 9))
          }
        }
        reader.onerror = (error) => {
            logger.error('handleDrop', 'FileReader error', error)
            toast.error("Failed to read file")
        }
        reader.readAsDataURL(file)
      })
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = (index: number) => {
    logger.debug('removeImage', 'Removing image at index', { index })
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = async () => {
    const startTime = Date.now()
    logger.info('handleGenerate', 'Generation started', { model, imagesCount: images.length })

    // Require both a prompt and at least one image per requirements
    if (!prompt.trim()) {
      logger.warn('handleGenerate', 'Validation failed: Missing prompt')
      toast.error("Please enter a prompt")
      return
    }
    if (images.length === 0) {
      logger.warn('handleGenerate', 'Validation failed: Missing image')
      toast.error("Please upload at least one image")
      return
    }
    setIsGenerating(true)
    try {
      // Send the first uploaded image and the prompt to our API route
      logger.debug('handleGenerate', 'Sending API request')
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image: images[0], model }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data?.error || "Generation failed")
      }
      
      const out = Array.isArray(data?.images) ? data.images : []
      if (out.length > 0) {
        logger.info('handleGenerate', 'Generation successful', { duration: Date.now() - startTime })
        setGeneratedImage(out[0])
      } else {
        // Fallback: try to parse from raw content if present
        logger.warn('handleGenerate', 'No image returned by model', { data })
        setGeneratedImage(null)
        toast.error("No image returned by the model")
      }
    } catch (e: any) {
      logger.error('handleGenerate', 'Generation failed', e)
      toast.error(e?.message || "Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-banana-dark mb-2">Get Started</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Try The AI Editor</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Nano Banana&apos;s natural language image editing. Transform any photo with simple
            text commands
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-banana" />
                Prompt Engine
              </CardTitle>
              <CardDescription>Transform your image with AI-powered editing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="image-to-image">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image-to-image">Image to Image</TabsTrigger>
                  <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label>AI Model Selection</Label>
                <Select value={model} onValueChange={(val) => {
                    logger.debug('ModelSelection', 'Model changed', { from: model, to: val })
                    setModel(val)
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nano-banana">🍌 Nano Banana</SelectItem>
                    <SelectItem value="nano-banana-pro">🍌 Nano Banana Pro</SelectItem>
                    <SelectItem value="seedream">SeeDream 4</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Different models offer unique characteristics and styles
                </p>
              </div>

              {/* Batch Processing */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Switch id="batch" disabled />
                  <Label htmlFor="batch" className="text-sm">
                    Batch Processing
                  </Label>
                  <span className="text-xs bg-banana/20 text-banana-dark px-2 py-0.5 rounded">Pro</span>
                </div>
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Reference Image</Label>
                <p className="text-xs text-muted-foreground">{images.length}/9</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
                    >
                      {/* Use unoptimized to avoid Next/Image transformations on data URLs in dev */}
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        fill
                        sizes="80px"
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 9 && (
                    <label
                      className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isDragging ? "border-banana bg-banana/10" : "border-border hover:border-banana/50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Max 10MB</p>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <Label>Main Prompt</Label>
                <Textarea
                  placeholder="Describe your desired edits... e.g., 'place the creature in a snowy mountain'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                className="w-full bg-banana hover:bg-banana-dark text-foreground font-medium gap-2"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">🍌</span>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Now
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-banana" />
                Output Gallery
              </CardTitle>
              <CardDescription>Your ultra-fast AI creations appear here instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center overflow-hidden">
                {generatedImage ? (
                  // Render dynamic output with a plain <img> to avoid dev parser/optimization issues
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="Generated"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="text-4xl mb-4">🍌</div>
                    <p className="text-muted-foreground font-medium">Ready for instant generation</p>
                    <p className="text-sm text-muted-foreground mt-1">Enter your prompt and unleash the power</p>
                  </>
                )}
              </div>

              <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                Visit Full Generator
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
