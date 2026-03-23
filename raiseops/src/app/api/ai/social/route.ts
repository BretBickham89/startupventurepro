import { NextRequest, NextResponse } from 'next/server'
import { callAIStructured } from '@/lib/ai/client'
import { buildSocialSystemPrompt, buildSocialPrompt } from '@/lib/ai/prompts'
import {
  SocialBatchSchema,
  SocialIntakeSchema,
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

  const parseResult = SocialIntakeSchema.safeParse(rawBody)
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => i.message).join(' · ')
    return NextResponse.json({ error: issues }, { status: 400 })
  }
  const intake = parseResult.data

  // ── Authenticate ────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // ── Call AI ─────────────────────────────────────────────────────────────
  let batch
  let aiError: string | null = null
  try {
    batch = await callAIStructured(
      buildSocialSystemPrompt(intake.postCount),
      buildSocialPrompt(intake),
      SocialBatchSchema,
      3000
    )
  } catch (err) {
    aiError = err instanceof Error ? err.message : 'Unknown AI error.'
    console.error('[/api/ai/social] AI error:', aiError)
  }

  // ── Persist to ai_generations ───────────────────────────────────────────
  const { data: genRow } = await supabase
    .from('ai_generations')
    .insert({
      user_id: user.id,
      feature: 'social',
      template_version: '2.0',
      input_context: intake as Record<string, unknown>,
      output: batch ?? {},
      status: aiError ? 'error' : 'success',
      error_message: aiError,
    })
    .select('id')
    .single()

  if (aiError) {
    return NextResponse.json({ error: aiError }, { status: 500 })
  }

  // ── Persist to social_intakes ──────────────────────────────────────────
  const { data: intakeRow } = await supabase
    .from('social_intakes')
    .insert({
      user_id: user.id,
      startup_snapshot: { companyName: intake.companyName },
      intake_payload: intake as Record<string, unknown>,
      post_count: batch!.posts.length,
      ai_generation_id: genRow?.id ?? null,
    })
    .select('id')
    .single()

  // ── Persist to content_assets + social_calendar ─────────────────────────
  if (batch && intakeRow?.id) {
    const now = new Date()

    for (let i = 0; i < batch.posts.length; i++) {
      const post = batch.posts[i]
      const schedStr = (batch.suggested_schedule ?? [])[i]
      const scheduledAt = schedStr ? new Date(schedStr) : new Date(now.getTime() + i * 2 * 86400_000)

      // Save content asset
      const { data: assetRow } = await supabase
        .from('content_assets')
        .insert({
          user_id: user.id,
          type: post.platform === 'twitter' ? 'tweet' : 'linkedin',
          status: 'draft',
          content: post.content,
          platform: post.platform,
          tags: post.tags ?? [],
          social_intake_id: intakeRow.id,
        })
        .select('id')
        .single()

      // Schedule in calendar
      if (assetRow?.id) {
        await supabase.from('social_calendar').insert({
          user_id: user.id,
          content_asset_id: assetRow.id,
          channel: post.platform,
          scheduled_at: scheduledAt.toISOString(),
          status: 'scheduled',
          social_intake_id: intakeRow.id,
        })
      }
    }
  }

  return NextResponse.json({ batch, intake_id: intakeRow?.id ?? null })
}
