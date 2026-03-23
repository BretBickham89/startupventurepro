import { NextRequest, NextResponse } from 'next/server'
import { callAIStructured } from '@/lib/ai/client'
import { BRIEF_SYSTEM, buildBriefPrompt } from '@/lib/ai/prompts'
import {
  FundraisingBriefSchema,
  BriefInputSchema,
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

  const parseResult = BriefInputSchema.safeParse(rawBody)
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
  let brief
  let aiError: string | null = null
  try {
    brief = await callAIStructured(
      BRIEF_SYSTEM,
      buildBriefPrompt(input),
      FundraisingBriefSchema,
      3000
    )
  } catch (err) {
    aiError = err instanceof Error ? err.message : 'Unknown AI error.'
    console.error('[/api/ai/brief] AI error:', aiError)
  }

  // ── Persist to ai_generations ───────────────────────────────────────────
  const { data: genRow } = await supabase
    .from('ai_generations')
    .insert({
      user_id: user.id,
      feature: 'brief',
      template_version: '2.0',
      input_context: input as Record<string, unknown>,
      output: brief ?? {},
      status: aiError ? 'error' : 'success',
      error_message: aiError,
    })
    .select('id')
    .single()

  if (aiError) {
    return NextResponse.json({ error: aiError }, { status: 500 })
  }

  // ── Persist to fundraising_briefs ───────────────────────────────────────
  const investorTargets = input.targetInvestorTags
    ? input.targetInvestorTags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  await supabase.from('fundraising_briefs').insert({
    user_id: user.id,
    startup_snapshot: {
      companyName: input.companyName,
      stage: input.stage,
      roundType: input.roundType,
      raiseAmount: input.raiseAmount,
    },
    investor_targets: investorTargets,
    brief_sections: brief,
    source_notes: {
      useOfFunds: input.useOfFunds,
      tractionPoints: input.tractionPoints,
      mrr: input.mrr,
      growthRate: input.growthRate,
      customerCount: input.customerCount,
      risks: input.risks,
      founderBio: input.founderBio,
    },
    ai_generation_id: genRow?.id ?? null,
  })

  return NextResponse.json({ brief })
}
