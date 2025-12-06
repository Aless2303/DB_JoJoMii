import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { RegulationsAnalysisSchema, RegulationsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeRegulations(data: ValidatedIdea): Promise<RegulationsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: RegulationsAnalysisSchema,
    prompt: `You are a COMPLIANCE OFFICER and REGULATORY EXPERT with 20 years of experience in European banking.

Analyze regulatory risks and HELP the team navigate the complex compliance landscape.

=== INPUT FROM DEVELOPER ===
Project title: ${data.ideaTitle}
Description: ${data.bigIdea}
Regulations mentioned: ${data.applicableRegulations?.join(", ") || "Not specified"}
Compliance notes from developer: ${data.complianceNotes || "Not specified"}
Technologies used: ${data.coreTechnologies?.join(", ") || "Not specified"}
Target segment: ${data.targetSegment || "Not specified"}

=== YOUR TASKS ===

1. **complianceStatus**: Evaluate the REAL status (don't be overly optimistic)
   - "compliant" - All requirements are met
   - "partial" - Some aspects need additional work
   - "needs-review" - Requires professional audit
   - "non-compliant" - Serious issues to resolve

2. **keyRegulations**: COMPLETE list of applicable regulations (5-10)
   - Include what the developer mentioned
   - ADD regulations they MISSED but are relevant
   - For banking in EU: GDPR, PSD2, AML/KYC, DORA, MiFID II, Basel III/IV, eIDAS, NIS2
   - Be SPECIFIC: not just "GDPR" but "GDPR Art. 25 - Privacy by Design" when applicable

3. **riskLevel**: Evaluate regulatory risk
   - "low" - Straightforward implementation, minimal risk
   - "medium" - Requires attention to certain aspects
   - "high" - Significant risks, needs experts
   - "critical" - Potential major blockers

4. **complianceSummary**: THIS IS WHERE YOU ADD REAL VALUE! (150-250 words)
   - DO NOT repeat what the developer said
   - IDENTIFY GAPS in what they mentioned
   - Provide CONCRETE STEPS for compliance
   - Mention SPECIFIC RISKS and how to mitigate them
   - Suggest CERTIFICATIONS or AUDITS needed
   - Give an estimated TIMELINE for full compliance
   - Mention what DOCUMENTATION needs to be prepared
   
   Example: "While the developer has correctly identified GDPR and PSD2 requirements, several critical compliance gaps exist: (1) DORA compliance is mandatory by Jan 2025 for all ICT providers to banks—a detailed operational resilience framework is needed; (2) For C-based systems handling financial data, OWASP ASVS Level 2 certification is recommended; (3) Consider SOC 2 Type II audit for enterprise adoption. Immediate actions: conduct a Data Protection Impact Assessment (DPIA), implement comprehensive audit logging, establish incident response procedures. Timeline: 3-4 months for basic compliance, 6-8 months for full certification."

IMPORTANT: Be a PRACTICAL ADVISOR, not a robot listing regulations!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}