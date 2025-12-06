import { RawIdeaInput, PipelineResult } from "./schemas";

// Import all agents
import { validateAndNormalizeInput } from "./agents/validator";
import { analyzeBasicInfo } from "./agents/basic-info-analyzer";
import { analyzeTechnologies } from "./agents/technologies-analyzer";
import { analyzeBusinessContext } from "./agents/business-analyzer";
import { analyzeRegulations } from "./agents/regulations-analyzer";
import { analyzeDifferentiators } from "./agents/differentiators-analyzer";
import { analyzeOtherDetails } from "./agents/other-details-analyzer";
import { aggregateAnalyses } from "./agents/aggregator";
import { buildHTMLStructure } from "./agents/html-builder";
import { calculateStatistics } from "./agents/statistician";
import { designVisualOutput } from "./agents/visual-designer";

export interface PipelineOptions {
  debug?: boolean;
  skipValidation?: boolean;
}

export async function runAIPipeline(
  rawInput: RawIdeaInput,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const { debug = false } = options;

  const log = (message: string, data?: unknown) => {
    if (debug) {
      console.log("[PIPELINE] " + message, data || "");
    }
  };

  try {
    log("Step 1: Validating and normalizing input...");
    const validatedData = await validateAndNormalizeInput(rawInput);
    log("Validation complete", { title: validatedData.ideaTitle });

    log("Step 2: Running 6 category analyzers in parallel...");
    const [
      basicInfoAnalysis,
      technologiesAnalysis,
      businessContextAnalysis,
      regulationsAnalysis,
      differentiatorsAnalysis,
      otherDetailsAnalysis,
    ] = await Promise.all([
      analyzeBasicInfo(validatedData),
      analyzeTechnologies(validatedData),
      analyzeBusinessContext(validatedData),
      analyzeRegulations(validatedData),
      analyzeDifferentiators(validatedData),
      analyzeOtherDetails(validatedData),
    ]);

    log("All 6 category analyses complete");

    log("Step 3: Aggregating all analyses...");
    const aggregatedData = aggregateAnalyses(
      validatedData,
      basicInfoAnalysis,
      technologiesAnalysis,
      businessContextAnalysis,
      regulationsAnalysis,
      differentiatorsAnalysis,
      otherDetailsAnalysis
    );
    log("Aggregation complete");

    log("Step 4: Building HTML structure with taglines...");
    const htmlStructure = await buildHTMLStructure(aggregatedData);
    log("HTML structure complete", { 
      title: htmlStructure.pageTitle,
      sections: htmlStructure.sections.length 
    });

    log("Step 5: Calculating statistics and scores...");
    const statistics = await calculateStatistics(aggregatedData, htmlStructure);
    log("Statistics complete", {
      overallScore: statistics.overallScore,
      recommendation: statistics.recommendation
    });

    log("Step 6: Designing Teletext visual output...");
    const visualOutput = designVisualOutput(
      aggregatedData, 
      htmlStructure, 
      statistics,
      rawInput.ideaTitle || "Untitled Idea"
    );
    log("Visual design complete", { pages: visualOutput.pages.length });

    // HTML-ul e generat direct de AI în visualOutput.htmlOutput

    log("Pipeline complete!");

    return {
      success: true,
      validatedData,
      aggregatedAnalysis: aggregatedData,
      statistics,
      visualOutput,
    };

  } catch (error) {
    console.error("[PIPELINE ERROR]", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export function parseMarkdownInput(markdown: string): RawIdeaInput {
  const result: RawIdeaInput = {};
  const lines = markdown.split("\n");

  for (const line of lines) {
    if (line.startsWith("|") && !line.includes("---") && !line.includes("Câmp")) {
      const parts = line.split("|").map(p => p.trim()).filter(p => p);
      if (parts.length >= 2) {
        const key = parts[0].replace(/\*\*/g, "").toLowerCase();
        const value = parts.slice(1).join("|").trim();

        if (key.includes("idea title")) result.ideaTitle = value;
        else if (key.includes("big idea")) result.bigIdea = value;
        else if (key.includes("main category")) result.mainCategory = value;
        else if (key.includes("problem it solves")) result.problemSolved = value;
        else if (key.includes("core technologies")) {
          result.coreTechnologies = value.split(",").map(t => t.replace(/✅/g, "").trim()).filter(t => t);
        }
        else if (key.includes("solution type")) result.solutionType = value;
        else if (key.includes("tech stack")) result.techStackDetails = value;
        else if (key.includes("target segment")) result.targetSegment = value;
        else if (key.includes("monetization")) result.monetizationModel = value;
        else if (key.includes("market size")) result.estimatedMarketSize = value;
        else if (key.includes("applicable regulations")) {
          result.applicableRegulations = value.split(",").map(r => r.replace(/✅/g, "").trim()).filter(r => r);
        }
        else if (key.includes("compliance notes")) result.complianceNotes = value;
        else if (key.includes("unique") || key.includes("what makes")) result.uniqueValue = value;
        else if (key.includes("implementation level")) {
          result.implementationLevel = value.split(",").map(l => l.replace(/✅/g, "").trim()).filter(l => l);
        }
        else if (key.includes("project stage")) result.projectStage = value;
        else if (key.includes("github")) result.githubLink = value;
        else if (key.includes("market research")) result.marketResearch = value;
        else if (key.includes("team")) result.teamComposition = value;
        else if (key.includes("demo video")) result.demoVideo = value === "(lasă gol)" ? undefined : value;
        else if (key.includes("need from db") || key.includes("need from")) result.needsFromDB = value;
        else if (key.includes("additional notes")) result.additionalNotes = value;
      }
    }
  }

  return result;
}