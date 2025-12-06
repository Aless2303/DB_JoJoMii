import { 
  FinalVisualOutput, 
  AggregatedData, 
  HTMLBuilderOutput, 
  StatisticsOutput,
} from "../schemas";

/**
 * VISUAL DESIGNER - Generează HTML pentru popup
 * NU folosește AI - construiește HTML determinist din date
 * 
 * ȘABLON TELETEXT:
 * - Font: VT323, monospace
 * - Background: #0000AA (albastru închis teletext)
 * - Culori: Cyan (#00FFFF), Yellow (#FFFF00), Magenta (#FF00FF), Green (#00FF00), White (#FFFFFF)
 * - Separatori: ═══════════════════════════════════════════
 * - Secțiuni cu titlu galben și iconiță ►
 * - Badge-uri cu border și background semi-transparent
 * - Progress bars: [████████░░] 80%
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
    return `<span style="color:${scoreColor(s)};">[${"\u2588".repeat(filled)}${"\u2591".repeat(empty)}] ${s}%</span>`;
  };

  const makeSeparator = (): string => 
    `<div style="color:#00FFFF;text-align:center;margin:16px 0;font-size:11px;">═══════════════════════════════════════════</div>`;

  const makeSectionTitle = (title: string): string => 
    `<div style="color:#FFFF00;font-size:14px;margin:16px 0 8px 0;font-weight:bold;">► ${title}</div>`;

  const makeList = (items: string[] | undefined, color: string = "#00FF00", icon: string = "✓"): string => {
    if (!items || items.length === 0) return `<div style="color:#666;font-style:italic;padding-left:12px;">Not specified</div>`;
    return items.map(item => 
      `<div style="color:${color};margin:4px 0;padding-left:12px;">${icon} ${item}</div>`
    ).join("");
  };

  const makeBadge = (text: string, borderColor: string = "#00FFFF", bgColor: string = "rgba(0,255,255,0.1)"): string =>
    `<span style="display:inline-block;background:${bgColor};color:${borderColor};padding:4px 12px;margin:3px;border:1px solid ${borderColor};border-radius:3px;font-size:12px;">${text}</span>`;

  const makeInfoRow = (label: string, value: string, valueColor: string = "#FFFFFF"): string =>
    `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #333;">
      <span style="color:#888;">${label}</span>
      <span style="color:${valueColor};">${value}</span>
    </div>`;

  // === BUILD HTML ===
  const html = `
<div style="font-family:'VT323',monospace;background:#0000AA;padding:20px;color:#FFFFFF;">
  
  <!-- HEADER -->
  <div style="text-align:center;margin-bottom:20px;">
    ${makeSeparator()}
    <div style="color:#FFFF00;font-size:28px;font-weight:bold;margin:12px 0;line-height:1.2;text-shadow:2px 2px 0 #000;">${originalTitle}</div>
    <div style="color:#00FFFF;font-size:14px;font-style:italic;margin:8px 0;">"${data.basicInfo.tagline || "Innovation for Banking"}"</div>
    <div style="margin:12px 0;">
      ${makeBadge(data.basicInfo.category?.toUpperCase() || "GENERAL", "#FF00FF", "rgba(255,0,255,0.15)")}
    </div>
    ${makeSeparator()}
  </div>

  <!-- SCORE BOX -->
  <div style="text-align:center;margin:20px auto;padding:20px;background:rgba(0,0,0,0.4);border-radius:8px;border:2px solid ${scoreColor(statistics.overallScore)};max-width:300px;">
    <div style="color:#888;font-size:11px;letter-spacing:2px;margin-bottom:8px;">AI EVALUATION SCORE</div>
    <div style="color:${scoreColor(statistics.overallScore)};font-size:56px;font-weight:bold;line-height:1;">${statistics.overallScore}%</div>
    <div style="margin:10px 0;">${makeProgressBar(statistics.overallScore)}</div>
    <div style="margin-top:12px;">
      ${makeBadge(`★ ${(statistics.recommendation || "PENDING").replace(/-/g, " ").toUpperCase()} ★`, "#00FFFF")}
    </div>
  </div>

  ${makeSeparator()}

  <!-- PROBLEM & SOLUTION -->
  ${makeSectionTitle("PROBLEM ADDRESSED")}
  <div style="color:#FFFFFF;font-size:14px;line-height:1.5;padding:0 12px;">${data.basicInfo.problemSummary || "Addressing banking innovation challenges"}</div>

  ${makeSectionTitle("UNIQUE VALUE PROPOSITION")}
  <div style="color:#FF00FF;font-size:14px;line-height:1.5;padding:0 12px;">${data.differentiators.uniqueSellingPoint || "Innovative approach to banking"}</div>

  ${makeSectionTitle("KEY BENEFITS")}
  ${makeList(data.basicInfo.keyBenefits, "#00FF00", "✓")}

  ${makeSeparator()}

  <!-- TECHNOLOGIES -->
  ${makeSectionTitle("TECHNOLOGY STACK")}
  <div style="padding:8px 12px;line-height:2.2;">
    ${(data.technologies.primaryTech || []).map(t => makeBadge(t, "#00FFFF")).join(" ")}
  </div>
  
  <div style="color:#FFFFFF;font-size:13px;line-height:1.5;padding:8px 12px;margin-top:8px;">
    ${data.technologies.techSummary || "Technology details not provided"}
  </div>

  <div style="display:flex;gap:16px;margin:16px 12px;flex-wrap:wrap;">
    <div style="flex:1;min-width:120px;background:rgba(0,0,0,0.3);padding:12px;border-radius:4px;text-align:center;">
      <div style="color:#888;font-size:10px;margin-bottom:4px;">INNOVATION</div>
      <div style="color:#FF00FF;font-size:18px;font-weight:bold;">${(data.technologies.innovationLevel || "MODERATE").toUpperCase()}</div>
    </div>
    <div style="flex:1;min-width:120px;background:rgba(0,0,0,0.3);padding:12px;border-radius:4px;text-align:center;">
      <div style="color:#888;font-size:10px;margin-bottom:4px;">READINESS</div>
      <div style="color:#00FFFF;font-size:18px;font-weight:bold;">${(data.differentiators.readinessLevel || "PROTOTYPE").toUpperCase()}</div>
    </div>
  </div>

  ${makeSeparator()}

  <!-- BUSINESS CONTEXT -->
  ${makeSectionTitle("BUSINESS CONTEXT")}
  <div style="padding:0 12px;">
    ${makeInfoRow("Segment", data.businessContext.segment || "Banking")}
    ${makeInfoRow("Revenue Model", data.businessContext.revenueModel || "To be defined")}
    ${makeInfoRow("Target Audience", data.basicInfo.targetAudience || "Financial institutions")}
    ${makeInfoRow("Market Opportunity", data.businessContext.marketOpportunity || "Growing market", "#00FF00")}
    ${makeInfoRow("Business Value", data.businessContext.businessValue || "High potential")}
    ${makeInfoRow("Scalability", data.businessContext.scalabilityScore || "Medium", "#FFFF00")}
  </div>

  <div style="margin:16px 12px;">
    ${data.differentiators.githubAvailable ? makeBadge("GITHUB AVAILABLE", "#00FF00", "rgba(0,255,0,0.1)") : ""}
    ${data.otherDetails.hasDemo ? makeBadge("DEMO READY", "#00FFFF", "rgba(0,255,255,0.1)") : ""}
    ${data.differentiators.competitiveAdvantage ? makeBadge("COMPETITIVE EDGE", "#FF00FF", "rgba(255,0,255,0.1)") : ""}
  </div>

  ${makeSeparator()}

  <!-- EVALUATION SCORES -->
  ${makeSectionTitle("DETAILED SCORES")}
  <div style="padding:0 12px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
      <span style="color:#FFFFFF;width:120px;">Innovation</span>
      ${makeProgressBar(statistics.categoryScores?.innovation || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
      <span style="color:#FFFFFF;width:120px;">Feasibility</span>
      ${makeProgressBar(statistics.categoryScores?.feasibility || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
      <span style="color:#FFFFFF;width:120px;">Business Value</span>
      ${makeProgressBar(statistics.categoryScores?.businessValue || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
      <span style="color:#FFFFFF;width:120px;">Compliance</span>
      ${makeProgressBar(statistics.categoryScores?.compliance || 0)}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
      <span style="color:#FFFFFF;width:120px;">Readiness</span>
      ${makeProgressBar(statistics.categoryScores?.readiness || 0)}
    </div>
  </div>

  <!-- STRENGTHS & IMPROVEMENTS -->
  <div style="display:flex;gap:20px;margin:20px 12px;flex-wrap:wrap;">
    <div style="flex:1;min-width:200px;">
      <div style="color:#00FF00;font-size:13px;margin-bottom:10px;border-bottom:1px solid #003300;padding-bottom:4px;">✓ STRENGTHS</div>
      ${makeList(statistics.strengths, "#00FF00", "+")}
    </div>
    <div style="flex:1;min-width:200px;">
      <div style="color:#FFAA00;font-size:13px;margin-bottom:10px;border-bottom:1px solid #333300;padding-bottom:4px;">○ AREAS TO IMPROVE</div>
      ${makeList(statistics.improvements, "#FFAA00", "○")}
    </div>
  </div>

  ${makeSeparator()}

  <!-- COMPLIANCE & REGULATIONS -->
  ${makeSectionTitle("COMPLIANCE STATUS")}
  <div style="padding:0 12px;">
    <div style="display:flex;align-items:center;gap:12px;margin:10px 0;">
      ${makeBadge(
        (data.regulations.complianceStatus || "PENDING").toUpperCase(),
        data.regulations.complianceStatus === "compliant" ? "#00FF00" : 
        data.regulations.complianceStatus === "partial" ? "#FFFF00" : "#FF6600"
      )}
      <span style="color:#888;">Risk Level:</span>
      ${makeBadge(
        (data.regulations.riskLevel || "Unknown").toUpperCase(),
        data.regulations.riskLevel === "low" ? "#00FF00" : 
        data.regulations.riskLevel === "medium" ? "#FFFF00" : "#FF6600"
      )}
    </div>
    
    ${data.regulations.keyRegulations && data.regulations.keyRegulations.length > 0 ? `
      <div style="margin:12px 0;">
        <div style="color:#888;font-size:11px;margin-bottom:6px;">APPLICABLE REGULATIONS:</div>
        ${data.regulations.keyRegulations.map(r => makeBadge(r, "#888", "rgba(128,128,128,0.1)")).join(" ")}
      </div>
    ` : ""}
    
    <div style="color:#FFFFFF;font-size:12px;line-height:1.4;margin-top:8px;">
      ${data.regulations.complianceSummary || "Compliance assessment pending"}
    </div>
  </div>

  ${makeSeparator()}

  <!-- TEAM & RESOURCES -->
  ${makeSectionTitle("TEAM & RESOURCES")}
  <div style="padding:0 12px;">
    ${makeInfoRow("Team Size", data.otherDetails.teamSize || "Not specified")}
    
    ${data.otherDetails.supportNeeded && data.otherDetails.supportNeeded.length > 0 ? `
      <div style="margin:12px 0;">
        <div style="color:#888;font-size:11px;margin-bottom:6px;">SUPPORT NEEDED:</div>
        ${data.otherDetails.supportNeeded.map(s => makeBadge(s, "#00FFFF")).join(" ")}
      </div>
    ` : ""}
    
    ${data.otherDetails.additionalHighlights && data.otherDetails.additionalHighlights.length > 0 ? `
      <div style="margin:12px 0;">
        <div style="color:#888;font-size:11px;margin-bottom:6px;">HIGHLIGHTS:</div>
        ${makeList(data.otherDetails.additionalHighlights, "#FFFF00", "★")}
      </div>
    ` : ""}
  </div>

  ${makeSeparator()}

  <!-- AI SUMMARY -->
  <div style="text-align:center;margin:20px 0;padding:16px;background:rgba(0,255,255,0.05);border-radius:8px;border:1px solid #00FFFF;">
    <div style="color:#888;font-size:10px;letter-spacing:2px;margin-bottom:8px;">AI ANALYSIS SUMMARY</div>
    <div style="color:#00FFFF;font-size:14px;line-height:1.5;">${statistics.summaryText || "Analysis complete. Review the scores above for detailed evaluation."}</div>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;margin-top:20px;padding-top:12px;border-top:1px solid #333;">
    <div style="color:#666;font-size:11px;">Generated by AI Analysis Pipeline • BCR Innovation Hub</div>
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
