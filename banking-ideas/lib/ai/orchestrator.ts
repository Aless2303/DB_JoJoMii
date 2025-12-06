import { IdeaFormData, RenderedPage } from "@/lib/schemas";
import { analyzeContent } from "./agents/content-analyzer";
import { designPages } from "./agents/page-designer";
import { generateASCIIArt } from "./agents/ascii-generator";
import { writeTeletextCopy } from "./agents/copywriter";
import { renderPages } from "./agents/page-renderer";

export interface PipelineResult {
  pages: RenderedPage[];
  analysis: {
    category: string;
    keywords: string[];
    complexity: string;
  };
}

export async function runAIPipeline(idea: IdeaFormData): Promise<PipelineResult> {
  console.log("🚀 Starting AI Pipeline...");

  // Step 1: Analyze content
  console.log("📊 Step 1: Analyzing content...");
  const analysis = await analyzeContent(idea);
  console.log("✅ Content analysis complete:", analysis.category);

  // Step 2 & 3: Run page designer and ASCII generator in parallel
  console.log("🎨 Step 2-3: Designing pages and generating ASCII art...");
  const [structure, ascii] = await Promise.all([
    designPages(idea, analysis),
    generateASCIIArt(analysis),
  ]);
  console.log("✅ Page structure and ASCII art complete");

  // Step 4: Write Teletext copy
  console.log("✍️ Step 4: Writing Teletext copy...");
  const copy = await writeTeletextCopy(idea, analysis, structure);
  console.log("✅ Teletext copy complete");

  // Step 5: Render final pages
  console.log("🖥️ Step 5: Rendering pages...");
  const pages = renderPages(copy, ascii, structure);
  console.log("✅ Pages rendered:", pages.length, "pages");

  console.log("🎉 Pipeline complete!");

  return {
    pages,
    analysis: {
      category: analysis.category,
      keywords: analysis.keywords,
      complexity: analysis.complexity,
    },
  };
}
