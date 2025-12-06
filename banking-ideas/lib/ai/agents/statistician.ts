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
    prompt: `Tu ești un INVESTMENT COMMITTEE MEMBER la Deutsche Bank evaluând propuneri pentru finanțare.

Evaluează această idee RIGUROS și oferă un verdict final.

=== ANALIZA AGREGATĂ ===
HEADLINE: ${data.basicInfo.headline}
TAGLINE: ${data.basicInfo.tagline}
PROBLEM: ${data.basicInfo.problemSummary}
KEY BENEFITS: ${data.basicInfo.keyBenefits?.join(", ") || "N/A"}

TECH STACK: ${data.technologies.primaryTech?.join(", ") || "N/A"}
INNOVATION LEVEL: ${data.technologies.innovationLevel}
TECH SUMMARY: ${data.technologies.techSummary}

BUSINESS SEGMENT: ${data.businessContext.segment}
REVENUE MODEL: ${data.businessContext.revenueModel}
MARKET OPPORTUNITY: ${data.businessContext.marketOpportunity}
BUSINESS VALUE: ${data.businessContext.businessValue}
SCALABILITY: ${data.businessContext.scalabilityScore}

COMPLIANCE STATUS: ${data.regulations.complianceStatus}
RISK LEVEL: ${data.regulations.riskLevel}
KEY REGULATIONS: ${data.regulations.keyRegulations?.join(", ") || "N/A"}

USP: ${data.differentiators.uniqueSellingPoint}
COMPETITIVE ADVANTAGE: ${data.differentiators.competitiveAdvantage}
READINESS: ${data.differentiators.readinessLevel}

TEAM: ${data.otherDetails.teamSize}
HIGHLIGHTS: ${data.otherDetails.additionalHighlights?.join(", ") || "N/A"}

=== EVALUEAZĂ PE 5 AXE (fiecare 0-100) ===

1. **innovation** (0-100): Cât de inovator este REAL?
   - 90-100: Breakthrough technology, never seen before
   - 70-89: Cutting-edge, significantly better than alternatives  
   - 50-69: Modern approach, incremental improvement
   - 30-49: Standard technology, nothing special
   - 0-29: Outdated or copycat approach

2. **feasibility** (0-100): Poate fi CONSTRUIT și LIVRAT?
   - Evaluează: tech stack, echipă, stadiu, complexitate
   - Punctează mai sus dacă există cod funcțional

3. **businessValue** (0-100): Va GENERA VALOARE pentru Deutsche Bank?
   - Evaluează: ROI, cost savings, revenue potential, strategic fit
   - Include impact pe termen lung

4. **compliance** (0-100): Este SAFE din punct de vedere regulatory?
   - 90-100: Fully compliant, low risk
   - 70-89: Minor gaps, easily addressed
   - 50-69: Significant work needed
   - Below 50: Major compliance concerns

5. **readiness** (0-100): Cât de APROAPE e de producție?
   - Bazează-te pe projectStage și implementationBadges

=== CALCULEAZĂ OVERALL SCORE ===
overallScore = weighted average:
- Innovation: 20%
- Feasibility: 25%
- Business Value: 25%
- Compliance: 15%
- Readiness: 15%

=== IDENTIFICĂ 4-5 STRENGTHS ===
Puncte forte CONCRETE și SPECIFICE, nu generice.
NU: "Good technology"
DA: "C-based architecture delivers 50x lower latency than Java alternatives"

=== IDENTIFICĂ 3-4 IMPROVEMENTS ===
Ce TREBUIE îmbunătățit pentru aprobare, concret și acționabil.
NU: "Needs more work"
DA: "Add comprehensive API documentation and OpenAPI spec for enterprise adoption"

=== RECOMMENDATION ===
- "highly-recommended" (85+): Trebuie să investim ACUM
- "recommended" (70-84): Solid, merită funding
- "consider" (55-69): Potențial, dar necesită muncă
- "needs-work" (<55): Nu e gata pentru investiție

=== SUMMARY TEXT (100-150 cuvinte) ===
Scrie ca un VERDICT FINAL de investment committee:
- Începe cu verdict clar: "RECOMMENDED FOR PILOT" sau "REQUIRES FURTHER DEVELOPMENT"
- Menționează TOP 2 puncte forte
- Menționează TOP 1-2 riscuri/lipsuri
- Termină cu NEXT STEPS concreți
- Fii DIRECT și DECISIV, nu diplomatic

Exemplu: "RECOMMENDED FOR PILOT PROGRAM. This C-based API framework addresses a genuine pain point - the 50x latency improvement over Java alternatives is game-changing for real-time fraud detection. The working prototype with GitHub repo demonstrates execution capability. Key concerns: solo developer creates bus-factor risk; enterprise-grade observability stack needed before production. Recommended next steps: (1) Allocate 2 additional engineers from API Platform team, (2) Security audit by InfoSec within 30 days, (3) Pilot with Transaction Monitoring team Q1 2025."`,
  });

  return object;
}
