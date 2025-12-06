import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BasicInfoAnalysisSchema, BasicInfoAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeBasicInfo(data: ValidatedIdea): Promise<BasicInfoAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: BasicInfoAnalysisSchema,
    prompt: `You are a TOP FINTECH COPYWRITER and PITCH EXPERT who has helped secure $500M+ in funding.

You've received an innovation idea from a developer. Your job is to transform it into a COMPELLING PRESENTATION that will convince Deutsche Bank to invest.

=== ORIGINAL IDEA ===
Title: ${data.ideaTitle}
Description: ${data.bigIdea}
Category: ${data.mainCategory}
Problem Solved: ${data.problemSolved}
Technologies: ${data.coreTechnologies?.join(", ") || "Not specified"}
Target: ${data.targetSegment || "Not specified"}

=== YOUR TASKS ===

1. **headline**: Create a CAPTIVATING, MEMORABLE title (DO NOT copy the original title).
   - Use power words: "Revolutionary", "Next-Gen", "Game-Changing", "Ultra-Fast", "Enterprise-Grade"
   - Include the main benefit: "10x Faster", "Zero Latency", "Bank-Grade Security", "50% Cost Reduction"
   - Format: "[Product Name]: [Key Benefit] for [Target]"
   - Example: "HyperBank Engine: 10x Faster APIs That Save Millions"

2. **tagline**: A PUNCHY marketing slogan that sells the idea in under 10 words.
   - Use copywriting techniques: rhymes, alliteration, contrasts
   - Examples: "Where Milliseconds Mean Millions" | "Speed Meets Security" | "Banking at the Speed of Thought"

3. **category**: Simplified category (1-2 words)
   - Examples: "API Infrastructure", "Payments", "Security", "Data Analytics"

4. **problemSummary**: Rewrite the problem as an URGENT CRISIS that the bank must solve NOW.
   - Add numbers and statistics (you can estimate if not provided)
   - Use urgent language: "costs banks millions", "legacy systems failing", "critical bottleneck"
   - Make the reader FEEL the pain of the problem
   - 2-3 sentences maximum

5. **keyBenefits**: Generate 5 CONCRETE, QUANTIFIABLE benefits (NOT generic!)
   - BAD: "Fast", "Secure", "Efficient", "Scalable"
   - GOOD: "Sub-millisecond response times (50x faster than Java)", "40% infrastructure cost reduction", "Zero-downtime deployments", "99.99% uptime SLA"
   - Each benefit MUST have a NUMBER or METRIC when possible

6. **targetAudience**: Describe EXACTLY who will USE and who will BUY/APPROVE this product.
   - Include decision makers: "CTOs of mid-size European banks", "Infrastructure teams at Deutsche Bank"
   - Be specific about role and organization type

IMPORTANT: DO NOT copy-paste from input. TRANSFORM and IMPROVE everything!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}