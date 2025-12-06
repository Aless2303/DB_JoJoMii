import {
  AggregatedData,
  ValidatedIdea,
  BasicInfoAnalysis,
  TechnologiesAnalysis,
  BusinessContextAnalysis,
  RegulationsAnalysis,
  DifferentiatorsAnalysis,
  OtherDetailsAnalysis,
} from "../schemas";

/**
 * AGGREGATOR - Combină toate analizele într-o structură unificată
 * NU folosește AI - doar combină datele
 */
export function aggregateAnalyses(
  validatedData: ValidatedIdea,
  basicInfo: BasicInfoAnalysis,
  technologies: TechnologiesAnalysis,
  businessContext: BusinessContextAnalysis,
  regulations: RegulationsAnalysis,
  differentiators: DifferentiatorsAnalysis,
  otherDetails: OtherDetailsAnalysis
): AggregatedData {
  return {
    basicInfo,
    technologies,
    businessContext,
    regulations,
    differentiators,
    otherDetails,
    originalData: validatedData,
  };
}
