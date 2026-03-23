import { NextRequest, NextResponse } from 'next/server'
import { callAIStructured } from '@/lib/ai/client'
import { OUTREACH_SYSTEM, buildOutreachPrompt } from '@/lib/ai/prompts'
import { OutreachDraftSchema } from '@/lib/ai/schemas'

// Legacy endpoint — kept for backwards compatibility with InvestorCard.
// Uses the updated AI client (AI Foundry or Anthropic) with Zod validation.
// Returns { subject, message } shape for backwards compatibility.
export async function POST(req: NextRequest) {
  const { investorName, investorFirm, focusAreas, stage, companyName } = await req.json()

  // Graceful fallback if no provider is configured
  const hasProvider = !!(process.env.AI_FOUNDRY_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY)
  if (!hasProvider) {
    const firstName = investorName?.split(' ')[0] ?? 'there'
    const firm = investorFirm ?? 'your portfolio'
    const area1 = focusAreas?.[0] ?? 'your focus area'
    const company = companyName ?? 'our startup'
    const stageLabel = stage ?? 'seed'
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({
      subject: `Introduction Request: ${company} — ${area1} opportunity aligned with ${firm}`,
      message: `Hi ${firstName},\n\nI've been following ${firm}'s work in ${area1} closely and believe there's a strong fit with what we're building at ${company}.\n\nWe're raising our ${stageLabel} round and I'd love to share more. Would you be open to a 20-minute call?\n\nLooking forward to connecting,\n[Your Name]\n[Your Title] · ${company}`,
      ai_powered: false,
    })
  }

  try {
    const draft = await callAIStructured(
      OUTREACH_SYSTEM,
      buildOutreachPrompt({
        investorName: String(investorName ?? ''),
        investorFirm: investorFirm ? String(investorFirm) : null,
        focusAreas: Array.isArray(focusAreas) ? focusAreas.map(String) : [],
        stage: String(stage ?? 'seed'),
        companyName: String(companyName ?? ''),
        purpose: 'intro',
        tone: 'founder-friendly',
      }),
      OutreachDraftSchema,
      1200
    )
    return NextResponse.json({
      subject: draft.subject,
      message: draft.email,
      linkedin_note: draft.linkedin_note,
      follow_up: draft.follow_up,
      ai_powered: true,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error generating outreach.'
    console.error('[/api/generate-outreach]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
