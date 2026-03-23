// AI client — server-side only. Never import from client components.
//
// Provider resolution order:
//   1. AI Foundry (OpenAI-compatible) — when AI_FOUNDRY_API_KEY is set
//   2. Anthropic Claude — when ANTHROPIC_API_KEY or LLM_API_KEY is set
//
// Required env vars (AI Foundry):
//   AI_FOUNDRY_API_KEY   — your AI Foundry key
//   AI_FOUNDRY_MODEL     — e.g. "gpt-4o" or "Phi-4" or any deployed model name
//   AI_FOUNDRY_BASE_URL  — full base URL, e.g. https://<resource>.services.ai.azure.com/models
//                          or https://models.inference.ai.azure.com
//
// Optional env vars:
//   AI_FOUNDRY_TEMPERATURE  — float 0–1 (default 0.7)
//   LLM_MODEL               — model override for Anthropic (default claude-haiku-4-5-20251001)

import { z } from 'zod'

// ─── Config ─────────────────────────────────────────────────────────────

type Provider = 'foundry' | 'anthropic'

function detectProvider(): Provider {
  if (process.env.AI_FOUNDRY_API_KEY) return 'foundry'
  if (process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY) return 'anthropic'
  throw new Error(
    'No AI provider configured. Set AI_FOUNDRY_API_KEY (recommended) or ANTHROPIC_API_KEY in .env.local.'
  )
}

function getFoundryConfig() {
  const apiKey = process.env.AI_FOUNDRY_API_KEY!
  const model = process.env.AI_FOUNDRY_MODEL ?? 'gpt-4o-mini'
  const baseUrl = (process.env.AI_FOUNDRY_BASE_URL ?? 'https://models.inference.ai.azure.com').replace(/\/$/, '')
  const temperature = parseFloat(process.env.AI_FOUNDRY_TEMPERATURE ?? '0.7')
  return { apiKey, model, baseUrl, temperature }
}

function getAnthropicConfig() {
  const apiKey = (process.env.ANTHROPIC_API_KEY ?? process.env.LLM_API_KEY)!
  const model = process.env.LLM_MODEL ?? 'claude-haiku-4-5-20251001'
  return { apiKey, model }
}

// ─── Rate Limiter ────────────────────────────────────────────────────────

const requestLog: number[] = []
const MAX_REQUESTS_PER_MINUTE = 30

function checkRateLimit() {
  const now = Date.now()
  const windowStart = now - 60_000
  while (requestLog.length > 0 && requestLog[0] < windowStart) requestLog.shift()
  if (requestLog.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit: too many AI requests. Please wait and retry.')
  }
  requestLog.push(now)
}

// ─── Retry Helper ───────────────────────────────────────────────────────

const MAX_RETRIES = 3
const RETRY_DELAY_MS = [1000, 2000, 4000]

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: Error = new Error('Unknown')
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const isTransient =
        lastError.message.includes('503') ||
        lastError.message.includes('529') ||
        lastError.message.includes('overloaded') ||
        lastError.message.includes('timeout') ||
        lastError.message.includes('network')
      if (!isTransient || attempt === MAX_RETRIES - 1) throw lastError
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS[attempt]))
      console.warn(`[AI] Retry ${attempt + 1} after: ${lastError.message}`)
    }
  }
  throw lastError
}

// ─── Provider Implementations ────────────────────────────────────────────

async function callFoundry(system: string, user: string, maxTokens: number): Promise<string> {
  const { apiKey, model, baseUrl, temperature } = getFoundryConfig()
  const url = `${baseUrl}/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error('[AI Foundry] API error:', response.status, body.slice(0, 200))
    if (response.status === 401) throw new Error('Invalid AI_FOUNDRY_API_KEY.')
    if (response.status === 429) throw new Error('AI Foundry rate limit hit. Retry shortly.')
    if (response.status >= 500) throw new Error(`AI Foundry server error ${response.status}.`)
    throw new Error(`AI Foundry error ${response.status}: ${body.slice(0, 100)}`)
  }

  const data = await response.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('AI Foundry returned an empty response.')
  return text
}

async function callAnthropic(system: string, user: string, maxTokens: number): Promise<string> {
  const { apiKey, model } = getAnthropicConfig()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error('[Anthropic] API error:', response.status, body.slice(0, 200))
    if (response.status === 401) throw new Error('Invalid ANTHROPIC_API_KEY.')
    if (response.status === 429) throw new Error('Anthropic rate limit hit. Retry shortly.')
    if (response.status === 529) throw new Error('Anthropic overloaded. timeout') // triggers retry
    throw new Error(`Anthropic error ${response.status}.`)
  }

  const data = await response.json()
  const text: string = data.content?.[0]?.text ?? ''
  if (!text) throw new Error('Anthropic returned an empty response.')
  return text
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Call the configured AI provider and return raw text output.
 * Server-side only. Never call from client components.
 */
export async function callAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 2048
): Promise<string> {
  checkRateLimit()
  const provider = detectProvider()

  const jsonInstruction =
    '\n\nRespond with valid JSON only. No markdown code fences, no extra text.'

  return withRetry(() =>
    provider === 'foundry'
      ? callFoundry(systemPrompt, userMessage + jsonInstruction, maxTokens)
      : callAnthropic(systemPrompt, userMessage + jsonInstruction, maxTokens)
  )
}

/**
 * Call the AI and parse + validate the structured JSON output using a Zod schema.
 * Throws on validation failure with a descriptive error.
 */
export async function callAIStructured<T>(
  systemPrompt: string,
  userMessage: string,
  schema: z.ZodType<T>,
  maxTokens = 2048
): Promise<T> {
  const raw = await callAI(systemPrompt, userMessage, maxTokens)
  // Strip potential markdown fences
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    console.error('[AI] JSON parse failure. Raw (first 300):', raw.slice(0, 300))
    throw new Error('AI returned malformed JSON. Please try again.')
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    console.error('[AI] Schema validation failure:', issues)
    // Return what we have if partial data is present — try coercing with partial
    throw new Error(`AI response didn't match expected shape: ${issues}`)
  }
  return result.data
}
