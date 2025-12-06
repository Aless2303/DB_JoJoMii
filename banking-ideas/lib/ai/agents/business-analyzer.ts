import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BusinessContextAnalysisSchema, BusinessContextAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeBusinessContext(data: ValidatedIdea): Promise<BusinessContextAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: BusinessContextAnalysisSchema,
    prompt: `Tu ești un BUSINESS STRATEGIST și INVESTMENT ANALYST specializat în fintech cu experiență la McKinsey și Goldman Sachs.

Analizează potențialul de business al acestei idei și CREEAZĂ UN CASUS DE INVESTIȚIE convingător.

=== INPUT DE LA DEVELOPER ===
Titlu: ${data.ideaTitle}
Descriere: ${data.bigIdea}
Target segment: ${data.targetSegment || "nespecificat"}
Model monetizare: ${data.monetizationModel || "nespecificat"}
Estimare piață: ${data.estimatedMarketSize || "nespecificat"}
Competitori: ${data.marketResearch || "nespecificat"}
Problema rezolvată: ${data.problemSolved}

=== CE TREBUIE SĂ FACI ===

1. **segment**: Definește CLAR segmentul de piață
   - Nu "Banking" generic, ci specific: "Enterprise Transaction Processing", "Retail Banking Infrastructure"
   - Include dimensiunea estimată dacă poți

2. **revenueModel**: Detaliază modelul de revenue (50-100 cuvinte)
   - Dacă e "cost savings", CALCULEAZĂ economiile concrete
   - Exemplu: "At 40% infrastructure cost reduction on a typical €5M annual server budget, this translates to €2M yearly savings. Payback period: 6 months."
   - Dacă e SaaS, estimează pricing și TAM
   - Adaugă și ALTE moduri de monetizare pe care le-ar putea explora

3. **marketOpportunity**: VINDE oportunitatea! (100-150 cuvinte)
   - Include CIFRE și TENDINȚE de piață
   - Menționează timing-ul: de ce ACUM e momentul potrivit
   - Compară cu exit-uri și evaluări din industrie
   - Exemplu: "The global banking API market is projected to reach $25.4B by 2027 (CAGR 23.4%). With legacy modernization being a top-3 priority for 78% of bank CTOs, and the average bank spending €50M+ annually on infrastructure, even capturing 0.1% of this market represents a €25M+ opportunity."

4. **businessValue**: Articolează VALOAREA pentru Deutsche Bank specific (80-120 cuvinte)
   - Ce probleme rezolvă PENTRU EI
   - Cum se aliniază cu strategia lor (digitalizare, eficiență, inovație)
   - Ce avantaj competitiv le oferă
   - Include ROI estimat și timeline

5. **scalabilityScore**: Evaluează scalabilitatea pe o scară descriptivă
   - "Massive" - poate scala global, platformă
   - "High" - poate scala la nivel enterprise
   - "Medium" - scalabil dar cu limitări
   - "Limited" - soluție de nișă
   - Justifică alegerea

IMPORTANT: Fii un INVESTMENT BANKER care vinde un deal, nu un birocrat care completează formulare!`,
  });

  return object;
}
