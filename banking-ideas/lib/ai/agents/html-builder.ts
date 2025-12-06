import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { HTMLBuilderOutputSchema, HTMLBuilderOutput, AggregatedData } from "../schemas";

export async function buildHTMLStructure(data: AggregatedData): Promise<HTMLBuilderOutput> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: HTMLBuilderOutputSchema,
    prompt: `Tu ești un CONTENT STRATEGIST și UX WRITER pentru prezentări de produse tech.

Creează structura de conținut care va VINDE această idee către decision makers.

=== DATE DISPONIBILE ===
HEADLINE: ${data.basicInfo.headline}
TAGLINE: ${data.basicInfo.tagline}
PROBLEM: ${data.basicInfo.problemSummary}
BENEFITS: ${data.basicInfo.keyBenefits?.join(", ") || "N/A"}
TARGET: ${data.basicInfo.targetAudience}

TECH STACK: ${data.technologies.primaryTech?.join(", ") || "N/A"}
TECH SUMMARY: ${data.technologies.techSummary}
INNOVATION: ${data.technologies.innovationLevel}

SEGMENT: ${data.businessContext.segment}
REVENUE: ${data.businessContext.revenueModel}
MARKET: ${data.businessContext.marketOpportunity}
VALUE: ${data.businessContext.businessValue}

COMPLIANCE: ${data.regulations.complianceStatus}
REGULATIONS: ${data.regulations.keyRegulations?.join(", ") || "N/A"}

USP: ${data.differentiators.uniqueSellingPoint}
ADVANTAGE: ${data.differentiators.competitiveAdvantage}
READINESS: ${data.differentiators.readinessLevel}

TEAM: ${data.otherDetails.teamSize}
SUPPORT NEEDED: ${data.otherDetails.supportNeeded?.join(", ") || "N/A"}
HIGHLIGHTS: ${data.otherDetails.additionalHighlights?.join(", ") || "N/A"}

=== CE TREBUIE SĂ CREEZI ===

1. **pageTitle**: Un titlu de pagină CAPTIVANT și MEMORABIL
   - Include beneficiul principal sau metrica cheie
   - Exemplu: "HyperBank: 50x Faster APIs for Real-Time Banking"

2. **sections**: Array de secțiuni pentru prezentare (5-7 secțiuni)
   Fiecare secțiune:
   - id: identificator unic
   - type: "hero" | "features" | "tech" | "business" | "social-proof" | "cta"
   - content: {
       title: titlu de secțiune CATCHY
       subtitle: 1-2 propoziții de context
       items: array de bullet points (dacă e relevant)
       badges: array de badge-uri scurte (dacă e relevant)
       highlight: text evidențiat (dacă e relevant)
     }

3. **callToAction**: Butoane de acțiune
   - primary: acțiunea principală ("Schedule Demo", "View GitHub", "Request Pilot")
   - secondary: acțiune secundară ("Download Whitepaper", "Contact Team")

4. **metadata**: 
   - category: categoria simplificată
   - readinessLevel: din data.differentiators
   - innovationLevel: din data.technologies

IMPORTANT: Fiecare secțiune trebuie să VÂNDĂ ideea, nu doar să afișeze date!`,
  });

  return object;
}
