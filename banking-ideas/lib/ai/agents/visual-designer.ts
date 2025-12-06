import { 
  FinalVisualOutput, 
  AggregatedData, 
  HTMLBuilderOutput, 
  StatisticsOutput,
} from "../schemas";

/**
 * VISUAL DESIGNER - Generates HTML for popup display
 * Does NOT use AI - builds deterministic HTML from data
 * 
 * TELETEXT TEMPLATE - OPTIMIZED FOR MAXIMUM READABILITY:
 * - Font: VT323, monospace
 * - Background: #0000AA (dark teletext blue)
 * - Colors: Cyan (#00FFFF), Yellow (#FFFF00), Magenta (#FF00FF), Green (#00FF00), White (#FFFFFF)
 * - Large font sizes (20-28px for text, 40px+ for titles)
 * - Generous line-height (1.8-2.0)
 * - Ample spacing between sections (40px+)
 */
export function designVisualOutput(
  data: AggregatedData,
  htmlContent: HTMLBuilderOutput,
  statistics: StatisticsOutput,
  originalTitle: string
): FinalVisualOutput {
  
  // === UTILITY FUNCTIONS ===
  const scoreColor = (score: number): string => 
    score >= 70 ? "#00FF00" : score >= 50 ? "#FFFF00" : "#FF6600";

  const makeProgressBar = (score: number): string => {
    const s = Math.min(100, Math.max(0, score));
    const filled = Math.round(s / 10);
    const empty = 10 - filled;
    return `<span style="color:${scoreColor(s)};font-size:24px;letter-spacing:2px;">[${"\u2588".repeat(filled)}${"\u2591".repeat(empty)}] ${s}%</span>`;
  };

  const makeSeparator = (): string => 
    `<div style="color:#00FFFF;text-align:center;margin:40px 0;font-size:20px;letter-spacing:4px;">═══════════════════════════════════════════</div>`;

  const makeSectionTitle = (title: string): string => 
    `<div style="color:#FFFF00;font-size:28px;margin:40px 0 20px 0;font-weight:bold;letter-spacing:2px;">► ${title}</div>`;

  const makeList = (items: string[] | undefined, color: string = "#00FF00", icon: string = "✓"): string => {
    if (!items || items.length === 0) return `<div style="color:#888;font-style:italic;padding-left:24px;font-size:22px;">Not specified</div>`;
    return items.map(item => 
      `<div style="color:${color};margin:16px 0;padding-left:24px;font-size:22px;line-height:1.8;">${icon} ${item}</div>`
    ).join("");
  };

  const makeBadge = (text: string, borderColor: string = "#00FFFF", bgColor: string = "rgba(0,255,255,0.1)"): string =>
    `<span style="display:inline-block;background:${bgColor};color:${borderColor};padding:12px 24px;margin:8px;border:3px solid ${borderColor};border-radius:6px;font-size:20px;font-weight:bold;">${text}</span>`;

  const makeInfoRow = (label: string, value: string, valueColor: string = "#FFFFFF"): string =>
    `<div style="display:flex;justify-content:space-between;padding:16px 0;border-bottom:2px solid #333;font-size:22px;flex-wrap:wrap;gap:10px;">
      <span style="color:#AAA;">${label}</span>
      <span style="color:${valueColor};font-weight:bold;text-align:right;">${value}</span>
    </div>`;

  // === BUILD HTML ===
  const html = `
<div style="font-family:'VT323',monospace;background:#0000AA;padding:50px;color:#FFFFFF;font-size:22px;line-height:1.9;">
  
  <!-- HEADER -->
  <div style="text-align:center;margin-bottom:50px;">
    ${makeSeparator()}
    <div style="color:#FFFF00;font-size:42px;font-weight:bold;margin:24px 0;line-height:1.4;text-shadow:3px 3px 0 #000;">${originalTitle}</div>
    <div style="color:#00FFFF;font-size:26px;font-style:italic;margin:20px 0;line-height:1.6;">"${data.basicInfo.tagline || "Innovation for Banking"}"</div>
    <div style="margin:24px 0;">
      ${makeBadge(data.basicInfo.category?.toUpperCase() || "GENERAL", "#FF00FF", "rgba(255,0,255,0.15)")}
    </div>
    ${makeSeparator()}
  </div>

  <!-- SCORE BOX -->
  <div style="text-align:center;margin:50px auto;padding:40px;background:rgba(0,0,0,0.4);border-radius:12px;border:4px solid ${scoreColor(statistics.overallScore)};max-width:450px;">
    <div style="color:#AAA;font-size:18px;letter-spacing:4px;margin-bottom:20px;">EVALUATION SCORE</div>
    <div style="color:${scoreColor(statistics.overallScore)};font-size:96px;font-weight:bold;line-height:1;">${statistics.overallScore}%</div>
    <div style="margin:24px 0;">${makeProgressBar(statistics.overallScore)}</div>
    <div style="margin-top:24px;">
      ${makeBadge(`★ ${(statistics.recommendation || "PENDING").replace(/-/g, " ").toUpperCase()} ★`, "#00FFFF")}
    </div>
  </div>

  ${makeSeparator()}

  <!-- PROBLEM & SOLUTION -->
  ${makeSectionTitle("PROBLEM ADDRESSED")}
  <div style="color:#FFFFFF;font-size:24px;line-height:2;padding:10px 24px;">${data.basicInfo.problemSummary || "Addressing banking innovation challenges"}</div>

  ${makeSectionTitle("UNIQUE VALUE PROPOSITION")}
  <div style="color:#FF00FF;font-size:24px;line-height:2;padding:10px 24px;">${data.differentiators.uniqueSellingPoint || "Innovative approach to banking"}</div>

  ${makeSectionTitle("KEY BENEFITS")}
  ${makeList(data.basicInfo.keyBenefits, "#00FF00", "✓")}

  ${makeSeparator()}

  <!-- TECHNOLOGIES -->
  ${makeSectionTitle("TECHNOLOGY STACK")}
  <div style="padding:0 24px;">
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin:20px 0;">
      ${(data.technologies.primaryTech || []).map(tech => makeBadge(tech, "#00FF00", "rgba(0,255,0,0.1)")).join("")}
    </div>
    <div style="color:#FFFFFF;font-size:22px;line-height:2;margin-top:20px;">
      ${data.technologies.techSummary || "Technology analysis pending"}
    </div>
  </div>

  ${makeSeparator()}

  <!-- BUSINESS CONTEXT -->
  ${makeSectionTitle("BUSINESS CONTEXT")}
  <div style="padding:0 24px;">
    ${makeInfoRow("Market Segment", data.businessContext.segment || "Not specified")}
    ${makeInfoRow("Revenue Model", data.businessContext.revenueModel || "Not specified")}
    ${makeInfoRow("Scalability", (data.businessContext.scalabilityScore || "Unknown").toUpperCase(), "#00FFFF")}
    
    <div style="margin:30px 0;">
      <div style="color:#AAA;font-size:20px;margin-bottom:12px;letter-spacing:2px;">MARKET OPPORTUNITY:</div>
      <div style="color:#FFFFFF;font-size:22px;line-height:2;">${data.businessContext.marketOpportunity || "Market analysis pending"}</div>
    </div>
    
    <div style="margin:30px 0;">
      <div style="color:#AAA;font-size:20px;margin-bottom:12px;letter-spacing:2px;">VALUE FOR DEUTSCHE BANK:</div>
      <div style="color:#FFFF00;font-size:22px;line-height:2;">${data.businessContext.businessValue || "Business value analysis pending"}</div>
    </div>
  </div>

  ${makeSeparator()}

  <!-- STATUS BADGES -->
  <div style="text-align:center;padding:30px;">
    ${makeBadge(`${(data.technologies.innovationLevel || "Modern").toUpperCase()} TECHNOLOGY`, "#FF00FF", "rgba(255,0,255,0.1)")}
    ${makeBadge(`${(data.differentiators.readinessLevel || "Concept").toUpperCase().replace(/-/g, " ")}`, "#FFFF00", "rgba(255,255,0,0.1)")}
    ${data.differentiators.githubAvailable ? makeBadge("GITHUB AVAILABLE", "#00FF00", "rgba(0,255,0,0.1)") : ""}
    ${data.otherDetails.hasDemo ? makeBadge("DEMO READY", "#00FFFF", "rgba(0,255,255,0.1)") : ""}
    ${data.differentiators.competitiveAdvantage ? makeBadge("COMPETITIVE EDGE", "#FF00FF", "rgba(255,0,255,0.1)") : ""}
  </div>

  ${makeSeparator()}

  <!-- EVALUATION SCORES -->
  ${makeSectionTitle("DETAILED SCORES")}
  <div style="padding:0 24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
      <span style="color:#FFFFFF;width:200px;font-size:22px;">Innovation</span>
      ${makeProgressBar(statistics.categoryScores?.innovation || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
      <span style="color:#FFFFFF;width:200px;font-size:22px;">Feasibility</span>
      ${makeProgressBar(statistics.categoryScores?.feasibility || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
      <span style="color:#FFFFFF;width:200px;font-size:22px;">Business Value</span>
      ${makeProgressBar(statistics.categoryScores?.businessValue || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
      <span style="color:#FFFFFF;width:200px;font-size:22px;">Compliance</span>
      ${makeProgressBar(statistics.categoryScores?.compliance || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0;">
      <span style="color:#FFFFFF;width:200px;font-size:22px;">Readiness</span>
      ${makeProgressBar(statistics.categoryScores?.readiness || 0)}
    </div>
  </div>

  <!-- STRENGTHS & IMPROVEMENTS -->
  <div style="display:flex;gap:40px;margin:40px 24px;flex-wrap:wrap;">
    <div style="flex:1;min-width:300px;">
      <div style="color:#00FF00;font-size:24px;margin-bottom:20px;border-bottom:3px solid #003300;padding-bottom:10px;">✓ STRENGTHS</div>
      ${makeList(statistics.strengths, "#00FF00", "+")}
    </div>
    <div style="flex:1;min-width:300px;">
      <div style="color:#FFAA00;font-size:24px;margin-bottom:20px;border-bottom:3px solid #333300;padding-bottom:10px;">○ AREAS TO IMPROVE</div>
      ${makeList(statistics.improvements, "#FFAA00", "○")}
    </div>
  </div>

  ${makeSeparator()}

  <!-- COMPLIANCE & REGULATIONS -->
  ${makeSectionTitle("COMPLIANCE STATUS")}
  <div style="padding:0 24px;">
    <div style="display:flex;align-items:center;gap:24px;margin:20px 0;flex-wrap:wrap;">
      ${makeBadge(
        (data.regulations.complianceStatus || "PENDING").toUpperCase().replace(/-/g, " "),
        data.regulations.complianceStatus === "compliant" ? "#00FF00" : 
        data.regulations.complianceStatus === "partial" ? "#FFFF00" : "#FF6600"
      )}
      <span style="color:#AAA;font-size:22px;">Risk Level:</span>
      ${makeBadge(
        (data.regulations.riskLevel || "Unknown").toUpperCase(),
        data.regulations.riskLevel === "low" ? "#00FF00" : 
        data.regulations.riskLevel === "medium" ? "#FFFF00" : "#FF6600"
      )}
    </div>
    
    ${data.regulations.keyRegulations && data.regulations.keyRegulations.length > 0 ? `
      <div style="margin:24px 0;">
        <div style="color:#AAA;font-size:18px;margin-bottom:16px;letter-spacing:2px;">APPLICABLE REGULATIONS:</div>
        ${data.regulations.keyRegulations.map(r => makeBadge(r, "#888", "rgba(128,128,128,0.1)")).join(" ")}
      </div>
    ` : ""}
    
    <div style="color:#FFFFFF;font-size:22px;line-height:2;margin-top:20px;">
      ${data.regulations.complianceSummary || "Compliance assessment pending"}
    </div>
  </div>

  ${makeSeparator()}

  <!-- TEAM & RESOURCES -->
  ${makeSectionTitle("TEAM & RESOURCES")}
  <div style="padding:0 24px;">
    ${makeInfoRow("Team Size", data.otherDetails.teamSize || "Not specified")}
    
    ${data.otherDetails.supportNeeded && data.otherDetails.supportNeeded.length > 0 ? `
      <div style="margin:30px 0;">
        <div style="color:#AAA;font-size:20px;margin-bottom:16px;letter-spacing:2px;">SUPPORT NEEDED:</div>
        ${data.otherDetails.supportNeeded.map(s => makeBadge(s, "#00FFFF")).join(" ")}
      </div>
    ` : ""}
    
    ${data.otherDetails.additionalHighlights && data.otherDetails.additionalHighlights.length > 0 ? `
      <div style="margin:30px 0;">
        <div style="color:#AAA;font-size:20px;margin-bottom:16px;letter-spacing:2px;">HIGHLIGHTS:</div>
        ${makeList(data.otherDetails.additionalHighlights, "#FFFF00", "★")}
      </div>
    ` : ""}
  </div>

  ${makeSeparator()}

  <!-- EXPERT SUMMARY -->
  <div style="text-align:center;margin:50px 0;padding:40px;background:rgba(0,255,255,0.05);border-radius:12px;border:3px solid #00FFFF;">
    <div style="color:#AAA;font-size:18px;letter-spacing:4px;margin-bottom:20px;">EXPERT SUMMARY</div>
    <div style="color:#00FFFF;font-size:26px;line-height:1.9;">${statistics.summaryText || "Analysis complete. Review the scores above for detailed evaluation."}</div>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;margin-top:50px;padding-top:24px;border-top:2px solid #333;">
    <div style="color:#666;font-size:18px;">Generated by BANK//IDEAS Platform • Deutsche Bank Innovation Hub</div>
  </div>

</div>`;

  return {
    pages: [
      { pageNumber: 100, title: originalTitle, sections: [{ type: "header", lines: [{ text: originalTitle, color: "yellow" }] }] }
    ],
    htmlOutput: html,
    cssVariables: { primaryColor: "cyan", accentColor: "yellow" }
  };
}