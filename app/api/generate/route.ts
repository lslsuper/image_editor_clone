// Next.js App Router route for image+prompt generation via OpenRouter (Gemini 2.5 Flash Image)
import { NextRequest } from "next/server"
import { createLogger } from "@/lib/logger"
import OpenAI from 'openai'

const logger = createLogger('API:generate')

type GenerateRequest = {
  prompt?: string
  image?: string // data URL or remote URL
  model?: string
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  logger.info('POST', 'Request received', { url: req.url })

  try {
    const bodyText = await req.text()
    if (!bodyText) {
       logger.warn('POST', 'Empty body received')
       return new Response(JSON.stringify({ error: "Empty request body" }), { status: 400 })
    }

    const { prompt, image, model }: GenerateRequest = JSON.parse(bodyText)

    // Log request parameters (truncate long image strings)
    logger.debug('POST', 'Parsed request params', { 
      prompt, 
      hasImage: !!image,
      imageLength: image?.length,
      model 
    })

    if (!prompt || !prompt.trim()) {
      logger.warn('POST', 'Validation failed: Missing prompt')
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      logger.error('POST', 'Configuration error: Missing API Key')
      return new Response(JSON.stringify({ error: "Server misconfigured: missing OPENROUTER_API_KEY" }), {
        status: 500,
      })
    }

    // Map frontend model names to OpenRouter model IDs
    const modelMap: Record<string, string> = {
      'nano-banana': 'google/gemini-2.5-flash-image', // Mapped as requested
      'nano-banana-pro': 'google/gemini-2.5-flash-image', // Fallback or map to same
      'seedream': 'google/gemini-2.5-flash-image',
    }

    const targetModel = (model && modelMap[model]) || 'google/gemini-2.5-flash-image'

    // Initialize OpenAI client with OpenRouter configuration
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Image Editor Clone",
      }
    });

    // Build messages content
    const content: any[] = [{ type: "text", text: prompt }]
    
    if (image) {
      content.push({ type: "image_url", image_url: { url: image } })
    }

    logger.info('POST', 'Using model', { targetModel })

    // Call OpenRouter via OpenAI SDK
    const completion = await client.chat.completions.create({
      model: targetModel,
      messages: [
        {
          role: "user",
          content: content as any, // Cast to any to satisfy type checker if needed
        },
      ],
      // Pass extra parameters as 'any' to avoid TS errors, if supported by the SDK/API
      modalities: ['image', 'text'],
    } as any);

    logger.debug('POST', 'OpenRouter response received', { 
        id: completion.id, 
        model: completion.model,
        choices: completion.choices?.length,
    })

    // Extract images from response
    const images: string[] = []
    
    // Check for custom response format as mentioned by user (non-standard)
    const rawResponse = completion as any; // Access raw response structure
    // The user example suggests: const response = apiResponse.choices[0].message; if (response.images) ...
    // Note: OpenAI SDK result is typically `completion`. `completion.choices[0].message` is the message object.
    const message = completion.choices[0]?.message as any;

    if (message?.images) {
       message.images.forEach((img: any) => {
         if (img.image_url?.url) {
           images.push(img.image_url.url);
         }
       });
    }

    // Fallback: Check content for Markdown images or URLs if the custom field isn't present
    if (images.length === 0 && message?.content) {
        const contentOut = message.content;
        // Check for Markdown images: ![alt](url)
        const markdownImageRegex = /!\[.*?\]\((.*?)\)/g
        let match
        while ((match = markdownImageRegex.exec(contentOut)) !== null) {
            if (match[1]) {
                images.push(match[1])
            }
        }
        
        // If still no images, maybe the content IS the url (unlikely but possible)
        if (images.length === 0 && contentOut.startsWith('http')) {
             // Basic heuristic
             images.push(contentOut);
        }
    }

    logger.info('POST', 'Request completed successfully', { 
      duration: Date.now() - startTime,
      imagesCount: images.length 
    })

    return new Response(JSON.stringify({ images, raw: completion }), { status: 200 })
  } catch (err: any) {
    logger.error('POST', 'Unhandled exception in API route', err)
    return new Response(JSON.stringify({ error: err?.message || "Unknown server error" }), { status: 500 })
  }
}
