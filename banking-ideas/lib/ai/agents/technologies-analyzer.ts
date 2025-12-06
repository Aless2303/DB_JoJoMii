import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { TechnologiesAnalysisSchema, TechnologiesAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeTechnologies(data: ValidatedIdea): Promise<TechnologiesAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: TechnologiesAnalysisSchema,
    prompt: `You are a TECH LEAD and SOFTWARE ARCHITECT with 15 years of experience in mission-critical banking systems.

Analyze the technology stack of this idea and ADD VALUE through your expertise.

=== INPUT FROM DEVELOPER ===
Technologies mentioned: ${data.coreTechnologies?.join(", ") || "Not specified"}
Solution type: ${data.solutionType || "Not specified"}
Tech stack details: ${data.techStackDetails || "Not specified"}
Project description: ${data.bigIdea}
Implementation level: ${data.implementationLevel?.join(", ") || "Not specified"}

=== YOUR TASKS ===

1. **primaryTech**: List of KEY technologies (5-8 items)
   - Include what the developer mentioned
   - ADD complementary technologies they should be using
   - Example: If they mention "PostgreSQL", also suggest "Redis for caching", "PgBouncer for connection pooling"

2. **techCategory**: Architectural classification
   - Examples: "Cloud-Native Microservices", "High-Performance Computing", "Real-Time Data Processing", "Event-Driven Architecture"

3. **innovationLevel**: HONESTLY evaluate the innovation level - USE EXACTLY ONE OF THESE VALUES (lowercase!):
   - "breakthrough" - Novel technology, nothing like it exists on market
   - "cutting-edge" - Uses latest available technologies in new ways
   - "modern" - Current best practices, but not revolutionary
   - "traditional" - Proven technologies, focus on stability
   - Justify your choice in techSummary

4. **techSummary**: THIS IS WHERE YOU ADD REAL VALUE! (100-200 words)
   - Explain WHY this stack is suitable for banking
   - Mention SPECIFIC technical advantages (latency, throughput, security)
   - Compare with alternatives and explain WHY this is better
   - Add RECOMMENDATIONS based on your expertise
   - Mention potential TECHNICAL RISKS and how to mitigate them
   - Example: "The choice of C with libmicrohttpd is strategic—it eliminates JVM overhead and garbage collection pauses that plague Java services. For a banking API handling 100K+ req/s, this means consistent sub-ms latency vs Java's 10-50ms p99. Recommend adding: rate limiting via token bucket, circuit breakers for downstream services, and OpenTelemetry for observability."

5. **techBadges**: 4-6 IMPRESSIVE badges for UI
   - Not just technology names, but what they DELIVER
   - Examples: "Sub-ms Latency", "10x Memory Efficient", "Bank-Grade Encryption", "Cloud-Native Ready", "Zero GC Pauses"

IMPORTANT: Be a TECHNICAL CONSULTANT who adds expertise, not a parrot who repeats input!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}