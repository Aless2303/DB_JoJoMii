import { z } from "zod";

// ============================================
// RAW INPUT SCHEMA - Ce primim de la user
// ============================================

export const RawIdeaInputSchema = z.object({
  ideaTitle: z.string().optional(),
  bigIdea: z.string().optional(),
  mainCategory: z.string().optional(),
  problemSolved: z.string().optional(),
  coreTechnologies: z.array(z.string()).optional(),
  solutionType: z.string().optional(),
  techStackDetails: z.string().optional(),
  targetSegment: z.string().optional(),
  monetizationModel: z.string().optional(),
  estimatedMarketSize: z.string().optional(),
  applicableRegulations: z.array(z.string()).optional(),
  complianceNotes: z.string().optional(),
  uniqueValue: z.string().optional(),
  implementationLevel: z.array(z.string()).optional(),
  projectStage: z.string().optional(),
  githubLink: z.string().optional(),
  marketResearch: z.string().optional(),
  teamComposition: z.string().optional(),
  demoVideo: z.string().optional(),
  needsFromDB: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type RawIdeaInput = z.infer<typeof RawIdeaInputSchema>;

// ============================================
// VALIDATED INPUT SCHEMA - După validare de AI
// ============================================

export const ValidatedIdeaSchema = z.object({
  ideaTitle: z.string(),
  bigIdea: z.string(),
  mainCategory: z.string(),
  problemSolved: z.string(),
  coreTechnologies: z.array(z.string()),
  solutionType: z.string(),
  techStackDetails: z.string(),
  targetSegment: z.string(),
  monetizationModel: z.string(),
  estimatedMarketSize: z.string(),
  applicableRegulations: z.array(z.string()),
  complianceNotes: z.string(),
  uniqueValue: z.string(),
  implementationLevel: z.array(z.string()),
  projectStage: z.string(),
  githubLink: z.string().optional().nullable(),
  marketResearch: z.string(),
  teamComposition: z.string(),
  demoVideo: z.string().optional().nullable(),
  needsFromDB: z.string(),
  additionalNotes: z.string(),
  // PRE-SCORING FIELDS - calculated by validator
  credibilityScore: z.number().min(0).max(100).describe("Overall credibility/consistency score"),
  bankingRelevance: z.enum(["high", "medium", "low", "none"]).describe("How relevant to banking"),
  consistencyIssues: z.array(z.string()).describe("List of detected inconsistencies"),
  isSatiricalOrFake: z.boolean().describe("Whether submission appears to be a joke"),
  maxPossibleScore: z.number().min(0).max(100).describe("Maximum score this idea can achieve based on credibility"),
});

export type ValidatedIdea = z.infer<typeof ValidatedIdeaSchema>;

// ============================================
// CATEGORY ANALYSIS SCHEMAS
// ============================================

export const BasicInfoAnalysisSchema = z.object({
  headline: z.string().describe("Captivating headline for the idea"),
  tagline: z.string().describe("Short marketing slogan"),
  category: z.string().describe("Simplified category (1-2 words)"),
  problemSummary: z.string().describe("Problem described as an urgent crisis"),
  keyBenefits: z.array(z.string()).describe("5 concrete, quantifiable benefits"),
  targetAudience: z.string().describe("Exact description of target users and buyers"),
});

export type BasicInfoAnalysis = z.infer<typeof BasicInfoAnalysisSchema>;

export const TechnologiesAnalysisSchema = z.object({
  primaryTech: z.array(z.string()).describe("List of 5-8 key technologies"),
  techCategory: z.string().describe("Architectural classification"),
  innovationLevel: z.enum(["breakthrough", "cutting-edge", "modern", "traditional"]).describe("Innovation level assessment"),
  techSummary: z.string().describe("Detailed technical analysis with recommendations"),
  techBadges: z.array(z.string()).describe("4-6 impressive badges for display"),
});

export type TechnologiesAnalysis = z.infer<typeof TechnologiesAnalysisSchema>;

export const BusinessContextAnalysisSchema = z.object({
  segment: z.string().describe("Specific market segment with size if possible"),
  revenueModel: z.string().describe("Detailed revenue model with calculations"),
  marketOpportunity: z.string().describe("Market opportunity with numbers and trends"),
  businessValue: z.string().describe("Value proposition for Deutsche Bank"),
  scalabilityScore: z.enum(["massive", "high", "medium", "limited"]).describe("Scalability assessment"),
});

export type BusinessContextAnalysis = z.infer<typeof BusinessContextAnalysisSchema>;

export const RegulationsAnalysisSchema = z.object({
  complianceStatus: z.enum(["compliant", "partial", "needs-review", "non-compliant"]).describe("Compliance status assessment"),
  keyRegulations: z.array(z.string()).describe("Complete list of applicable regulations"),
  riskLevel: z.enum(["low", "medium", "high", "critical"]).describe("Regulatory risk level"),
  complianceSummary: z.string().describe("Detailed compliance analysis with action items"),
});

export type RegulationsAnalysis = z.infer<typeof RegulationsAnalysisSchema>;

export const DifferentiatorsAnalysisSchema = z.object({
  uniqueSellingPoint: z.string().describe("30-second pitch rewrite"),
  competitiveAdvantage: z.string().describe("Sustainable competitive moat"),
  readinessLevel: z.enum(["production-ready", "beta", "working-prototype", "proof-of-concept", "concept"]).describe("Maturity assessment"),
  implementationBadges: z.array(z.string()).describe("4-6 badges showing what is ready"),
  githubAvailable: z.boolean().describe("Whether GitHub link exists"),
});

export type DifferentiatorsAnalysis = z.infer<typeof DifferentiatorsAnalysisSchema>;

export const OtherDetailsAnalysisSchema = z.object({
  teamSize: z.string().describe("Team evaluation with commentary"),
  hasDemo: z.boolean().describe("Whether demo exists"),
  supportNeeded: z.array(z.string()).describe("4-6 types of support needed from Deutsche Bank"),
  additionalHighlights: z.array(z.string()).describe("4-6 additional strengths for the pitch"),
});

export type OtherDetailsAnalysis = z.infer<typeof OtherDetailsAnalysisSchema>;

// ============================================
// AGGREGATED DATA SCHEMA
// ============================================

export const AggregatedDataSchema = z.object({
  basicInfo: BasicInfoAnalysisSchema,
  technologies: TechnologiesAnalysisSchema,
  businessContext: BusinessContextAnalysisSchema,
  regulations: RegulationsAnalysisSchema,
  differentiators: DifferentiatorsAnalysisSchema,
  otherDetails: OtherDetailsAnalysisSchema,
  originalData: ValidatedIdeaSchema,
});

export type AggregatedData = z.infer<typeof AggregatedDataSchema>;

// ============================================
// HTML BUILDER OUTPUT SCHEMA
// ============================================

export const HTMLBuilderOutputSchema = z.object({
  pageTitle: z.string(),
  sections: z.array(z.object({
    id: z.string(),
    type: z.enum(["hero", "features", "tech", "business", "social-proof", "cta"]),
    content: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      items: z.array(z.string()).optional(),
      badges: z.array(z.string()).optional(),
      highlight: z.string().optional(),
    }),
  })),
  callToAction: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
  }),
  metadata: z.object({
    category: z.string(),
    readinessLevel: z.string(),
    innovationLevel: z.string(),
  }),
});

export type HTMLBuilderOutput = z.infer<typeof HTMLBuilderOutputSchema>;

// ============================================
// STATISTICS OUTPUT SCHEMA - IMPROVED
// ============================================

// IMPORTANT: Using .describe() to help LLM understand expected format
export const StatisticsOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Weighted average score from 0-100"),
  categoryScores: z.object({
    innovation: z.number().min(0).max(100).describe("Innovation score 0-100"),
    feasibility: z.number().min(0).max(100).describe("Feasibility score 0-100"),
    businessValue: z.number().min(0).max(100).describe("Business value score 0-100"),
    compliance: z.number().min(0).max(100).describe("Compliance score 0-100"),
    readiness: z.number().min(0).max(100).describe("Readiness score 0-100"),
  }),
  strengths: z.array(z.string()).min(1).max(5).describe("Array of 1-5 specific strength strings (can be 1 for bad ideas)"),
  improvements: z.array(z.string()).min(1).max(4).describe("Array of 1-4 specific improvement strings"),
  recommendation: z.enum([
    "highly-recommended",
    "recommended", 
    "consider",
    "needs-work",
    "not-recommended"
  ]).describe("Final recommendation based on overall score"),
  summaryText: z.string().min(50).max(1500).describe("Investment committee verdict"),
});

export type StatisticsOutput = z.infer<typeof StatisticsOutputSchema>;

// ============================================
// FINAL VISUAL OUTPUT SCHEMA
// ============================================

export const TeletextColorSchema = z.enum([
  "white", "yellow", "cyan", "green", "magenta", "red", "blue"
]);

export const TeletextLineSchema = z.object({
  text: z.string(),
  color: TeletextColorSchema,
  doubleHeight: z.boolean().optional(),
  flash: z.boolean().optional(),
});

export const TeletextSectionSchema = z.object({
  type: z.string(),
  lines: z.array(TeletextLineSchema),
});

export const TeletextPageSchema = z.object({
  pageNumber: z.number(),
  title: z.string(),
  sections: z.array(TeletextSectionSchema),
});

export const FinalVisualOutputSchema = z.object({
  pages: z.array(TeletextPageSchema),
  htmlOutput: z.string(),
  cssVariables: z.object({
    primaryColor: TeletextColorSchema,
    accentColor: TeletextColorSchema,
  }),
});

export type TeletextLine = z.infer<typeof TeletextLineSchema>;
export type TeletextSection = z.infer<typeof TeletextSectionSchema>;
export type TeletextPage = z.infer<typeof TeletextPageSchema>;
export type FinalVisualOutput = z.infer<typeof FinalVisualOutputSchema>;

// ============================================
// PIPELINE RESULT SCHEMA
// ============================================

export const PipelineResultSchema = z.object({
  success: z.boolean(),
  validatedData: ValidatedIdeaSchema.optional(),
  aggregatedAnalysis: AggregatedDataSchema.optional(),
  statistics: StatisticsOutputSchema.optional(),
  visualOutput: FinalVisualOutputSchema.optional(),
  error: z.string().optional(),
});

export type PipelineResult = z.infer<typeof PipelineResultSchema>;