import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { HTMLBuilderOutputSchema, HTMLBuilderOutput, AggregatedData } from "../schemas";

export async function buildHTMLStructure(data: AggregatedData): Promise<HTMLBuilderOutput> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: HTMLBuilderOutputSchema,
    prompt: `You are a CONTENT STRATEGIST and UX WRITER specializing in tech product presentations.

Create a content structure that will SELL this idea to decision makers.

=== AVAILABLE DATA ===
HEADLINE: ${data.basicInfo.headline}
TAGLINE: ${data.basicInfo.tagline}
PROBLEM: ${data.basicInfo.problemSummary}
BENEFITS: ${data.basicInfo.keyBenefits?.join(", ") || "Not specified"}
TARGET: ${data.basicInfo.targetAudience}

TECH STACK: ${data.technologies.primaryTech?.join(", ") || "Not specified"}
TECH SUMMARY: ${data.technologies.techSummary}
INNOVATION: ${data.technologies.innovationLevel}

SEGMENT: ${data.businessContext.segment}
REVENUE: ${data.businessContext.revenueModel}
MARKET: ${data.businessContext.marketOpportunity}
VALUE: ${data.businessContext.businessValue}

COMPLIANCE: ${data.regulations.complianceStatus}
REGULATIONS: ${data.regulations.keyRegulations?.join(", ") || "Not specified"}

USP: ${data.differentiators.uniqueSellingPoint}
ADVANTAGE: ${data.differentiators.competitiveAdvantage}
READINESS: ${data.differentiators.readinessLevel}

TEAM: ${data.otherDetails.teamSize}
SUPPORT NEEDED: ${data.otherDetails.supportNeeded?.join(", ") || "Not specified"}
HIGHLIGHTS: ${data.otherDetails.additionalHighlights?.join(", ") || "Not specified"}

=== WHAT YOU NEED TO CREATE ===

1. **pageTitle**: A CAPTIVATING and MEMORABLE page title
   - Include the main benefit or key metric
   - Example: "HyperBank: 50x Faster APIs for Real-Time Banking"

2. **sections**: Array of sections for the presentation (5-7 sections)
   Each section needs:
   - id: unique identifier (lowercase, hyphenated)
   - type: "hero" | "features" | "tech" | "business" | "social-proof" | "cta"
   - content: {
       title: CATCHY section title
       subtitle: 1-2 sentences of context (optional)
       items: array of bullet points (if relevant)
       badges: array of short badges (if relevant)
       highlight: highlighted text (if relevant)
     }

   Recommended structure:
   - hero: Main pitch with headline and tagline
   - features: Key benefits and value proposition
   - tech: Technology stack and innovation
   - business: Market opportunity and business value
   - social-proof: Team, readiness, certifications
   - cta: Call to action

3. **callToAction**: Action buttons
   - primary: main action ("Schedule Demo", "View GitHub", "Request Pilot")
   - secondary: secondary action ("Download Whitepaper", "Contact Team")

4. **metadata**:
   - category: simplified category from data.basicInfo
   - readinessLevel: from data.differentiators
   - innovationLevel: from data.technologies

IMPORTANT: Every section must SELL the idea, not just display data!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}