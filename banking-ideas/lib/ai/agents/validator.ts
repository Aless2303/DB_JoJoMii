import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ValidatedIdeaSchema, ValidatedIdea, RawIdeaInput } from "../schemas";

export async function validateAndNormalizeInput(rawInput: RawIdeaInput): Promise<ValidatedIdea> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: ValidatedIdeaSchema,
    prompt: `You are a FRAUD DETECTOR at Deutsche Bank. Validate this submission and calculate credibility.

=== RAW DATA ===
${JSON.stringify(rawInput, null, 2)}

=== QUICK CHECKS ===

1. **BANKING RELEVANCE**: Is this about banking/finance?
   - Banking APIs, payments, fraud, compliance = "high"
   - Tangentially related = "medium" or "low"  
   - Tennis, sports, entertainment = "none"

2. **CONSISTENCY CHECK**: Do claims match reality?
   - "0 developers" + "Working Prototype" = FAKE
   - AI/ML/Blockchain checked for non-tech idea = FAKE
   - "47 people market" = JOKE

3. **TONE**: Is it sarcastic? ("with your foot", "1 dreamer") = SATIRICAL

=== CALCULATE SCORES ===

**credibilityScore** (0-100): Start at 100, deduct:
- Not about banking: -40
- Satirical/joke: -50
- Tech claims don't match: -20
- Team can't deliver: -25
- Absurd market: -15

**maxPossibleScore**: Based on credibility:
- credibility >= 80 → max = 100
- credibility 60-79 → max = 70
- credibility 40-59 → max = 50
- credibility 20-39 → max = 30
- credibility < 20 → max = 15

=== REQUIRED OUTPUT FIELDS ===

You MUST include these 5 fields in your response:
1. **credibilityScore**: number 0-100
2. **bankingRelevance**: "high" | "medium" | "low" | "none"
3. **consistencyIssues**: array of strings (empty [] if none)
4. **isSatiricalOrFake**: true or false
5. **maxPossibleScore**: number 0-100

Plus all the normalized data fields.

EXAMPLE FOR SATIRICAL SUBMISSION:
- credibilityScore: 10
- bankingRelevance: "none"
- consistencyIssues: ["Not about banking", "Satirical tone", "Fake team claims"]
- isSatiricalOrFake: true
- maxPossibleScore: 15

EXAMPLE FOR LEGITIMATE SUBMISSION:
- credibilityScore: 85
- bankingRelevance: "high"
- consistencyIssues: []
- isSatiricalOrFake: false
- maxPossibleScore: 100`,
  });

  return object;
}