import { NextRequest, NextResponse } from 'next/server'
import { callAIStructured } from '@/lib/ai/client'
import { OUTREACH_SYSTEM, buildOutreachPrompt } from '@/lib/ai/prompts'
import {
  OutreachDraftSchema,
  OutreachInputSchema,
} from '@/lib/ai/schemas'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // ── Parse + validate input ──────────────────────────────────────────────
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parseResult = OutreachInputSchema.safeParse(rawBody)
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => i.message).join(' · ')
    return NextResponse.json({ error: issues }, { status: 400 })
  }
  const input = parseResult.data

  // ── Authenticate ────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // ── Call AI ─────────────────────────────────────────────────────────────
  let draft
  let aiError: string | null = null
  try {
    draft = await callAIStructured(
      OUTREACH_SYSTEM,
      buildOutreachPrompt(input),
      OutreachDraftSchema,
      1500
    )
  } catch (err) {
    aiError = err instanceof Error ? err.message : 'Unknown AI error.'
    console.error('[/api/ai/outreach] AI error:', aiError)
  }

  // ── Persist to ai_generations ───────────────────────────────────────────
  const { data: genRow } = await supabase
    .from('ai_generations')
    .insert({
      user_id: user.id,
      feature: 'outreach',
      template_version: '2.0',
      input_context: input as Record<string, unknown>,
      output: draft ?? {},
      status: aiError ? 'error' : 'success',
      error_message: aiError,
    })
    .select('id')
    .single()

  if (aiError) {
    return NextResponse.json({ error: aiError }, { status: 500 })
  }

  // ── Persist to outreach_drafts ──────────────────────────────────────────
  await supabase.from('outreach_drafts').insert({
    user_id: user.id,
    investor_snapshot: {
      name: input.investorName,
      firm: input.investorFirm ?? null,
      focusAreas: input.focusAreas,
    },
    startup_snapshot: {
      companyName: input.companyName,
      stage: input.stage,
      bio: input.companyBio ?? null,
    },
    goal: input.purpose ?? 'intro',
    tone: input.tone ?? 'founder-friendly',
    subject_options: [draft!.subject],
    email_variants: {
      email: draft!.email,
      follow_up: draft!.follow_up,
    },
    linkedin_note: draft!.linkedin_note,
    ai_generation_id: genRow?.id ?? null,
  })

  return NextResponse.json({ draft })
}
