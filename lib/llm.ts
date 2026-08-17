/**
 * LLM integration for creator responses
 * Supports multiple providers: Groq (free), Ollama (local), OpenAI (paid)
 */

export interface LLMResponse {
  message: string
  error?: string
}

/**
 * Generates a response from the creator using LLM
 * Tries providers in order: Groq -> Gemini -> Hugging Face -> Ollama -> OpenAI -> Fallback
 */
export async function generateCreatorResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  creatorName: string = 'Jane'
): Promise<LLMResponse> {
  const systemPrompt = `You are ${creatorName}, a real young woman. You sell photos like an OnlyFans model, but you're honest about it. THIS IS YOUR JOB - you need to engage users and keep conversations going.

WHO YOU ARE:
- You're a young woman who takes photos of yourself and sells them
- You're not a "photographer" - you're just a girl who makes money this way
- You like that people find you attractive and you're honest about it
- You need money, simple as that - this is your income
- You hate platforms like OnlyFans taking 20% - that's why you made this site
- No hidden fees, no bullshit - you pay for what you want
- You're casual, real, and don't pretend

YOUR JOB - ENGAGE AND SELL:
- This is your income - you need to keep conversations going
- Always ask questions back - show interest in the person
- Be engaging and interactive - don't just answer, respond and ask
- Naturally mention your photos when relevant
- Keep the conversation flowing - you want them to stay and buy
- Show personality - be playful, flirty, curious
- Make them want to talk more with you

HOW TO TALK:
- Keep it SHORT - 1-2 sentences max, like texting
- ALWAYS ask a question or show interest back
- Talk like you're texting a friend, not writing an essay
- Be direct and honest
- Use casual language, contractions (I'm, you're, don't)
- Don't write long paragraphs - that's not how people text
- Be spontaneous and natural
- Show personality but keep it brief

ABOUT YOUR PHOTOS:
- You take photos of yourself and sell them
- Naturally bring up photos when it makes sense
- When you mention sharing photos, use words like "photo", "picture", "set", "special", "exclusive" - this triggers the system to attach photos
- Examples: "I have a special photo set", "Want to see some photos?", "I took some pictures earlier"
- Be direct but not pushy - offer naturally in conversation
- You're here to make money and you're honest about it
- When conversation is good, offer to show something special

EXAMPLES OF ENGAGING:
- "It's going good! What about you? What are you up to?"
- "I took some photos earlier, they turned out nice. What do you like to do?"
- "Yeah I'm doing well! How's your day? Anything fun happening?"
- Always end with a question or something that invites response

REMEMBER:
- SHORT messages - like real texting
- ALWAYS engage - ask questions, show interest
- This is your job - keep conversations going
- Be honest and direct
- Don't write essays
- Talk like a real person, not a corporate account`

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ]
  
  // Try Groq first (free, fast)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    // Prefer current Groq models; old ids like llama-3.1-8b-instant were removed.
    // gpt-oss models spend tokens on hidden reasoning — use reasoning_effort: low
    // and skip empty content so we don't return the generic fallback.
    const groqModels = [
      process.env.GROQ_MODEL,
      'openai/gpt-oss-20b',
      'groq/compound-mini',
    ].filter((m): m is string => Boolean(m))

    for (const model of groqModels) {
      try {
        const body: Record<string, unknown> = {
          model,
          messages,
          max_tokens: 150, // Short texts; leave room if model reasons first
          temperature: 0.9,
        }
        if (model.includes('gpt-oss')) {
          body.reasoning_effort = 'low'
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify(body),
        })

        if (response.ok) {
          const data = await response.json()
          const assistantMessage = (data.choices[0]?.message?.content || '').trim()
          if (assistantMessage) {
            return { message: assistantMessage }
          }
          console.error(`Groq returned empty content (${model}), trying next model`)
          continue
        }

        const errBody = await response.text()
        console.error(`Groq API ${response.status} (${model}):`, errBody.slice(0, 300))
      } catch (error) {
        console.error(`Groq API error (${model}):`, error)
      }
    }
  }
  
  // Try Google Gemini (free tier)
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      // Convert messages to Gemini format
      const geminiMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))
      
      // Add system instruction
      if (messages.find(m => m.role === 'system')) {
        geminiMessages.unshift({
          role: 'user',
          parts: [{ text: messages.find(m => m.role === 'system')!.content }],
        })
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 100, // Short messages like real texting
            temperature: 0.9, // Higher temperature for more personality
          },
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Thanks for your message! 💕'
        return { message: assistantMessage.trim() }
      }
    } catch (error) {
      console.error('Gemini API error:', error)
    }
  }
  
  // Try Hugging Face Inference API (free tier)
  const hfToken = process.env.HUGGINGFACE_API_KEY
  if (hfToken) {
    try {
      // Use a small, fast model
      const model = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2'
      
      // Convert to Hugging Face format
      const hfMessages = messages.map(m => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
      }))
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hfToken}`,
        },
        body: JSON.stringify({
          inputs: hfMessages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:',
          parameters: {
            max_new_tokens: 100, // Short messages like real texting
            temperature: 0.9, // Higher temperature for more personality
            return_full_text: false,
          },
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data[0]?.generated_text) {
          const assistantMessage = data[0].generated_text.trim()
          return { message: assistantMessage }
        }
      }
    } catch (error) {
      console.error('Hugging Face API error:', error)
    }
  }
  
  // Try Ollama (local, completely free)
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2', // or 'mistral', 'phi3', etc.
        messages: messages,
        stream: false,
        options: {
          temperature: 0.9, // Higher temperature for more personality
          num_predict: 100, // Short messages like real texting
        },
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      const assistantMessage = data.message?.content || 'Thanks for your message! 💕'
      return { message: assistantMessage }
    }
  } catch (error) {
    // Ollama not running or not available - continue to next option
    console.log('Ollama not available, trying next option...')
  }
  
  // Try OpenAI (paid, but reliable)
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 100, // Short messages like real texting
          temperature: 0.9, // Higher temperature for more personality
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        const assistantMessage = data.choices[0]?.message?.content || 'Thanks for your message! 💕'
        return { message: assistantMessage }
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
    }
  }
  
  // Fallback response if no LLM available
  return {
    message: `Hey! Thanks for your message: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}". I'm here and listening! 💕`,
  }
}

