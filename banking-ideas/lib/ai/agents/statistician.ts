import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { StatisticsOutputSchema, StatisticsOutput, AggregatedData, HTMLBuilderOutput } from "../schemas";

export async function calculateStatistics(
  data: AggregatedData,
  htmlContent: HTMLBuilderOutput
): Promise<StatisticsOutput> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: StatisticsOutputSchema,
    prompt: `You are a SENIOR INVESTMENT COMMITTEE MEMBER at Deutsche Bank.

=== CRITICAL: PRE-SCORING ALREADY DONE ===

The validator has ALREADY analyzed this submission for consistency and credibility.

**PRE-SCORING RESULTS (from validator):**
- Credibility Score: ${data.originalData.credibilityScore}/100
- Banking Relevance: ${data.originalData.bankingRelevance}
- Is Satirical/Fake: ${data.originalData.isSatiricalOrFake}
- Maximum Possible Score: ${data.originalData.maxPossibleScore}
- Consistency Issues Found: ${data.originalData.consistencyIssues?.join("; ") || "None"}

**YOUR SCORES CANNOT EXCEED maxPossibleScore (${data.originalData.maxPossibleScore})!**

=== SUBMISSION SUMMARY ===
Title: ${data.originalData.ideaTitle}
Description: ${data.originalData.bigIdea}
Team: ${data.originalData.teamComposition}
Tech Summary: ${data.technologies.techSummary}
Business Value: ${data.businessContext.businessValue}
Readiness: ${data.differentiators.readinessLevel}

=== SCORING RULES ===

**If isSatiricalOrFake = true OR bankingRelevance = "none":**
- ALL category scores: 5-15 (max ${data.originalData.maxPossibleScore})
- overallScore: max 15
- recommendation: "not-recommended"
- strengths: 1-2 generic items only
- improvements: list why it's rejected

**If bankingRelevance = "low" OR credibilityScore < 40:**
- ALL category scores: 15-30 (max ${data.originalData.maxPossibleScore})
- overallScore: max 30
- recommendation: "not-recommended" or "needs-work"

**If credibilityScore >= 60 AND bankingRelevance = "high":**
- Score normally, but cap at maxPossibleScore
- Be fair to legitimate submissions

=== CATEGORY SCORES (0-100, capped at ${data.originalData.maxPossibleScore}) ===

1. **innovation**: Based on tech analysis - ${data.technologies.innovationLevel}
2. **feasibility**: Based on team and readiness - can they deliver?
3. **businessValue**: Based on business context - real value for DB?
4. **compliance**: Based on regulations analysis
5. **readiness**: Based on implementation level

=== OVERALL SCORE ===
Weighted average, but CAPPED at ${data.originalData.maxPossibleScore}

=== STRENGTHS (1-5 items) ===
- For fake/satirical submissions: just 1-2 generic items
- For legitimate submissions: 3-5 specific strengths

=== IMPROVEMENTS (1-4 items) ===
- For fake submissions: explain why rejected
- For legitimate: actionable improvements

=== RECOMMENDATION ===
- "not-recommended": overallScore < 25 OR isSatiricalOrFake
- "needs-work": overallScore 25-39
- "consider": overallScore 40-59
- "recommended": overallScore 60-79
- "highly-recommended": overallScore 80+ (VERY RARE)

=== SUMMARY TEXT ===
- If fake/satirical: Start with "NOT RECOMMENDED - SUBMISSION ISSUES DETECTED"
- List the consistency issues found
- Be direct about why it's rejected

For legitimate ideas: Standard investment verdict.

REMEMBER: Maximum score is ${data.originalData.maxPossibleScore}. Do not exceed it!`,
  });

  return object;
}