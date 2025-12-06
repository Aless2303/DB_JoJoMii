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
});

export type ValidatedIdea = z.infer<typeof ValidatedIdeaSchema>;

// ============================================
// CATEGORY ANALYSIS SCHEMAS - Fără limite!
// ============================================

export const BasicInfoAnalysisSchema = z.object({
  headline: z.string(),
  tagline: z.string(),
  category: z.string(),
  problemSummary: z.string(),
  keyBenefits: z.array(z.string()),
  targetAudience: z.string(),
});

export type BasicInfoAnalysis = z.infer<typeof BasicInfoAnalysisSchema>;

export const TechnologiesAnalysisSchema = z.object({
  primaryTech: z.array(z.string()),
  techCategory: z.string(),
  innovationLevel: z.string(),
  techSummary: z.string(),
  techBadges: z.array(z.string()),
});

export type TechnologiesAnalysis = z.infer<typeof TechnologiesAnalysisSchema>;

export const BusinessContextAnalysisSchema = z.object({
  segment: z.string(),
  revenueModel: z.string(),
  marketOpportunity: z.string(),
  businessValue: z.string(),
  scalabilityScore: z.string(),
});

export type BusinessContextAnalysis = z.infer<typeof BusinessContextAnalysisSchema>;

export const RegulationsAnalysisSchema = z.object({
  complianceStatus: z.string(),
  keyRegulations: z.array(z.string()),
  riskLevel: z.string(),
  complianceSummary: z.string(),
});

export type RegulationsAnalysis = z.infer<typeof RegulationsAnalysisSchema>;

export const DifferentiatorsAnalysisSchema = z.object({
  uniqueSellingPoint: z.string(),
  competitiveAdvantage: z.string(),
  readinessLevel: z.string(),
  implementationBadges: z.array(z.string()),
  githubAvailable: z.boolean(),
});

export type DifferentiatorsAnalysis = z.infer<typeof DifferentiatorsAnalysisSchema>;

export const OtherDetailsAnalysisSchema = z.object({
  teamSize: z.string(),
  hasDemo: z.boolean(),
  supportNeeded: z.array(z.string()),
  additionalHighlights: z.array(z.string()),
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
    type: z.string(),
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
// STATISTICS OUTPUT SCHEMA
// ============================================

export const StatisticsOutputSchema = z.object({
  overallScore: z.number(),
  categoryScores: z.object({
    innovation: z.number(),
    feasibility: z.number(),
    businessValue: z.number(),
    compliance: z.number(),
    readiness: z.number(),
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recommendation: z.string(),
  summaryText: z.string(),
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
