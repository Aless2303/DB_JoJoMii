import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BusinessContextAnalysisSchema, BusinessContextAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeBusinessContext(data: ValidatedIdea): Promise<BusinessContextAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: BusinessContextAnalysisSchema,
    prompt: `You are a BUSINESS STRATEGIST and INVESTMENT ANALYST specialized in fintech, with experience at McKinsey and Goldman Sachs.

Analyze the business potential of this idea and CREATE A COMPELLING INVESTMENT CASE.

=== INPUT FROM DEVELOPER ===
Title: ${data.ideaTitle}
Description: ${data.bigIdea}
Target segment: ${data.targetSegment || "Not specified"}
Monetization model: ${data.monetizationModel || "Not specified"}
Market size estimate: ${data.estimatedMarketSize || "Not specified"}
Competitive landscape: ${data.marketResearch || "Not specified"}
Problem solved: ${data.problemSolved}

=== YOUR TASKS ===

1. **segment**: Define the market segment CLEARLY
   - Not generic "Banking", but specific: "Enterprise Transaction Processing", "Retail Banking Infrastructure", "SME Lending Operations"
   - Include estimated size if possible

2. **revenueModel**: Detail the revenue model (50-100 words)
   - If "cost savings", CALCULATE concrete savings
   - Example: "At 40% infrastructure cost reduction on a typical €5M annual server budget, this translates to €2M yearly savings. Payback period: 6 months."
   - If SaaS, estimate pricing and TAM
   - Add OTHER monetization paths they could explore

3. **marketOpportunity**: SELL the opportunity! (100-150 words)
   - Include NUMBERS and MARKET TRENDS
   - Mention timing: why NOW is the right moment
   - Compare with industry exits and valuations
   - Example: "The global banking API market is projected to reach $25.4B by 2027 (CAGR 23.4%). With legacy modernization being a top-3 priority for 78% of bank CTOs, and the average bank spending €50M+ annually on infrastructure, capturing even 0.1% of this market represents a €25M+ opportunity."

4. **businessValue**: Articulate the VALUE for Deutsche Bank specifically (80-120 words)
   - What problems does it solve FOR THEM
   - How does it align with their strategy (digitalization, efficiency, innovation)
   - What competitive advantage does it provide
   - Include estimated ROI and timeline

5. **scalabilityScore**: Evaluate scalability - USE EXACTLY ONE OF THESE VALUES (lowercase!):
   - "massive" - Can scale globally, platform potential
   - "high" - Can scale to enterprise level
   - "medium" - Scalable but with limitations
   - "limited" - Niche solution
   - Justify your choice

IMPORTANT: Be an INVESTMENT BANKER selling a deal, not a bureaucrat filling forms!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}