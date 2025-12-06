import { TeletextCopy, ASCIIElements, PageStructure, RenderedPage } from "@/lib/schemas";

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  green: "#00FF00",
  magenta: "#FF00FF",
  red: "#FF0000",
  blue: "#0000FF",
};

export function renderPages(
  copy: TeletextCopy,
  ascii: ASCIIElements,
  structure: PageStructure
): RenderedPage[] {
  return copy.pages.map((pageCopy, index) => {
    const pageStructure = structure.pages[index];
    
    // Generate HTML for this page
    const html = generatePageHTML(pageCopy, ascii, pageStructure);
    const css = generatePageCSS();
    
    // Calculate navigation
    const prevPage = index > 0 ? copy.pages[index - 1].pageNumber : null;
    const nextPage = index < copy.pages.length - 1 ? copy.pages[index + 1].pageNumber : null;
    const relatedPages = copy.pages
      .filter((_, i) => i !== index)
      .map(p => p.pageNumber)
      .slice(0, 3);

    return {
      pageNumber: pageCopy.pageNumber,
      html,
      css,
      navigation: {
        prev: prevPage,
        next: nextPage,
        related: relatedPages,
      },
    };
  });
}

function generatePageHTML(
  pageCopy: TeletextCopy["pages"][0],
  ascii: ASCIIElements,
  pageStructure: PageStructure["pages"][0]
): string {
  const lines = pageCopy.lines.map(line => {
    const color = COLOR_MAP[line.color] || COLOR_MAP.white;
    const classes = [
      "teletext-line",
      line.style === "double_height" ? "teletext-double" : "",
      line.style === "flash" ? "teletext-flash" : "",
    ].filter(Boolean).join(" ");

    return `<div class="${classes}" style="color: ${color}">${escapeHtml(line.content)}</div>`;
  }).join("\n");

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>P.${pageCopy.pageNumber} - ${pageStructure.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
  <style>${generatePageCSS()}</style>
</head>
<body>
  <div class="teletext-screen">
    <div class="teletext-header">
      <span class="header-logo">████ BANK//IDEAS</span>
      <span class="page-number">P.${pageCopy.pageNumber}</span>
    </div>
    <div class="teletext-separator">═══════════════════════════════════════</div>
    <div class="teletext-content">
      ${lines}
    </div>
    <div class="teletext-separator">═══════════════════════════════════════</div>
    <div class="teletext-footer">
      <span>FASTTXT ▌ Navigare: folosește numerele de pagină</span>
    </div>
  </div>
</body>
</html>`;
}

function generatePageCSS(): string {
  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #000;
  color: #fff;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 20px;
  line-height: 1.2;
  min-height: 100vh;
}

.teletext-screen {
  max-width: 640px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.teletext-screen::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

.teletext-header {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg, #0000FF, #00FFFF, #0000FF);
  padding: 8px 16px;
  color: #fff;
}

.header-logo {
  color: #FFFF00;
  font-weight: bold;
}

.page-number {
  background: #FFFF00;
  color: #000;
  padding: 2px 8px;
  font-weight: bold;
}

.teletext-separator {
  color: #00FFFF;
  text-align: center;
  margin: 8px 0;
}

.teletext-content {
  min-height: 400px;
  padding: 10px 0;
}

.teletext-line {
  white-space: pre;
  overflow: hidden;
  text-overflow: clip;
  max-width: 40ch;
  text-shadow: 0 0 2px currentColor;
}

.teletext-double {
  font-size: 2em;
  line-height: 1;
}

.teletext-flash {
  animation: flash 1s step-end infinite;
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.teletext-footer {
  color: #00FF00;
  text-align: center;
  font-size: 0.9em;
}
`;
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}
