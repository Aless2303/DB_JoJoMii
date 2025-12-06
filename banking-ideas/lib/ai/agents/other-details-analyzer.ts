import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { OtherDetailsAnalysisSchema, OtherDetailsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeOtherDetails(data: ValidatedIdea): Promise<OtherDetailsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: OtherDetailsAnalysisSchema,
    prompt: `You are a PROGRAM MANAGER for a startup accelerator at Deutsche Bank.

Evaluate the team and resources needed to bring this project to success.

=== INPUT FROM DEVELOPER ===
Title: ${data.ideaTitle}
Description: ${data.bigIdea}
Team: ${data.teamComposition || "Not specified"}
Demo video: ${data.demoVideo || "Not available"}
What they need from DB: ${data.needsFromDB || "Not specified"}
Additional notes: ${data.additionalNotes || "Not specified"}
Project stage: ${data.projectStage || "Not specified"}
Technologies: ${data.coreTechnologies?.join(", ") || "Not specified"}

=== YOUR TASKS ===

1. **teamSize**: Evaluate and COMMENT on the team (not just the number)
   - If solo developer: "Solo developer—impressive for scope achieved, will need team expansion for enterprise deployment"
   - If it's a team: evaluate if they have the necessary skills
   - Suggest what ROLES are missing
   - Example: "1 backend developer with systems expertise. For enterprise banking deployment, team would benefit from: DevOps engineer, security specialist, QA lead. Current size is suitable for PoC phase."

2. **hasDemo**: true/false—does a demonstration exist?

3. **supportNeeded**: List of 4-6 types of CONCRETE support from Deutsche Bank
   - DO NOT copy what the developer said
   - ADD what they would need but didn't ask for
   - Be SPECIFIC: not "mentorship" but "Technical mentorship from API Platform team"
   - Include: sandbox access, technical review, pilot customers, regulatory guidance, infrastructure
   - Example: ["Sandbox API access with test transaction data", "Security code review from DB InfoSec team", "Pilot deployment with 5 internal users", "Regulatory guidance on DORA compliance", "Cloud infrastructure budget (est. €5K/month)"]

4. **additionalHighlights**: 4-6 ADDITIONAL STRENGTHS for the pitch
   - Extract insights from all available data
   - Be CREATIVE—what would impress an investor?
   - Include aspects the developer mentioned but didn't highlight
   - Examples:
     - "Open-source approach enables community contributions and trust"
     - "Extensible architecture allows rapid feature development"
     - "No vendor lock-in—runs on any cloud provider"
     - "Battle-tested C codebase—memory safe, no GC pauses"
     - "Developer has proven backend expertise demonstrated by working prototype"

IMPORTANT: Be an ADVOCATE for this project—find and highlight its strengths!

ALL OUTPUT MUST BE IN ENGLISH.`,
  });

  return object;
}