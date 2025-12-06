import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { DifferentiatorsAnalysisSchema, DifferentiatorsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeDifferentiators(data: ValidatedIdea): Promise<DifferentiatorsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: DifferentiatorsAnalysisSchema,
    prompt: `You are a PRODUCT STRATEGIST and COMPETITIVE ANALYST from a top-tier venture capital fund.

Analyze what makes this idea UNIQUE and WHY it will win in the market.

=== INPUT FROM DEVELOPER ===
Title: ${data.ideaTitle}
Description: ${data.bigIdea}
Declared unique value: ${data.uniqueValue || "Not specified"}
Implementation level: ${data.implementationLevel?.join(", ") || "Not specified"}
Project stage: ${data.projectStage || "Not specified"}
GitHub: ${data.githubLink || "Not available"}
Market research: ${data.marketResearch || "Not specified"}
Technologies: ${data.coreTechnologies?.join(", ") || "Not specified"}

=== YOUR TASKS ===

1. **uniqueSellingPoint**: REWRITE the value proposition as a 30-second PITCH (80-120 words)
   - DO NOT copy what the developer said
   - Use formula: "For [target], who [problem], we offer [solution] that [differentiating benefit]"
   - Add CONCRETE COMPARISONS with alternatives
   - Include NUMBERS and METRICS
   - Make it MEMORABLE and PUNCHY
   - Example: "For enterprise banks drowning in legacy Java infrastructure, our C-based engine isn't just faster—it's a paradigm shift. While Spring Boot services struggle at 50ms p99 latency, we deliver consistent sub-millisecond response times. That's not 2x better, it's 50x. In high-frequency trading and real-time fraud detection, this isn't optimization—it's the difference between catching fraud and explaining to customers why you didn't."

2. **competitiveAdvantage**: Identify the MOAT—the SUSTAINABLE competitive advantage (80-100 words)
   - What stops others from copying?
   - Mention: proprietary technology, first-mover advantage, network effects, switching costs
   - Be HONEST about vulnerabilities
   - Example: "The competitive moat is technical depth—C-based banking systems require rare expertise (<5% of fintech developers). First-mover advantage in this niche means 18-24 months head start. However, vulnerability exists if major players (IBM, Oracle) pivot resources here."

3. **readinessLevel**: HONESTLY evaluate maturity - USE EXACTLY ONE OF THESE VALUES (lowercase!):
   - "production-ready" - Can be deployed tomorrow
   - "beta" - Functional but needs polish
   - "working-prototype" - Demonstrable but incomplete
   - "proof-of-concept" - Validates the idea but much work remains
   - "concept" - Just an idea, no code

4. **implementationBadges**: 4-6 badges showing WHAT'S READY (not what isn't)
   - "REST API Complete", "PostgreSQL Integrated", "Docker Ready", "CI/CD Configured", "Auth Implemented"
   - Be SPECIFIC about what works

5. **githubAvailable**: true if there's a valid GitHub link

IMPORTANT: Be a STORYTELLER who sells, but also a CRITIC who identifies gaps!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}