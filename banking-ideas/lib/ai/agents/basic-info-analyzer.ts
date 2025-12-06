import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BasicInfoAnalysisSchema, BasicInfoAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeBasicInfo(data: ValidatedIdea): Promise<BasicInfoAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: BasicInfoAnalysisSchema,
    prompt: `Tu ești un EXPERT în pitch-uri pentru investitori și un copywriter de top în fintech.

Ai primit o idee de la un developer. Rolul tău este să transformi această idee într-o PREZENTARE CAPTIVANTĂ care să convingă Deutsche Bank să investească.

=== IDEEA ORIGINALĂ ===
Titlu: ${data.ideaTitle}
Descriere: ${data.bigIdea}
Categorie: ${data.mainCategory}
Problema rezolvată: ${data.problemSolved}
Tehnologii: ${data.coreTechnologies?.join(", ") || "N/A"}
Target: ${data.targetSegment || "N/A"}

=== CE TREBUIE SĂ FACI ===

1. **headline**: Creează un titlu CAPTIVANT și MEMORABIL (nu copia titlul original). 
   - Folosește cuvinte puternice: "Revolutionary", "Next-Gen", "Game-Changing", "Ultra-Fast"
   - Adaugă beneficiul principal: "10x Faster", "Zero Latency", "Bank-Grade Security"
   - Exemplu: "HyperBank Engine: The 10x Faster API That Saves Millions"

2. **tagline**: Un slogan de marketing PERCUTANT care vinde ideea în 10 cuvinte.
   - Folosește tehnici de copywriting: rime, aliterații, contraste
   - Exemplu: "Where Milliseconds Mean Millions" sau "Speed Meets Security"

3. **category**: Categoria simplificată (1-2 cuvinte)

4. **problemSummary**: Rescrie problema ca pe o CRIZĂ URGENTĂ pe care banca trebuie să o rezolve ACUM.
   - Adaugă cifre și statistici (poți estima dacă nu sunt date)
   - Folosește limbaj urgent: "costs banks millions", "legacy systems failing", "critical bottleneck"
   - Fă cititorul să simtă DUREREA problemei

5. **keyBenefits**: Generează 5 beneficii CONCRETE și CUANTIFICABILE (nu generice!)
   - NU: "Fast", "Secure", "Efficient" 
   - DA: "Sub-millisecond response times", "40% infrastructure cost reduction", "Zero-downtime deployments"
   - Fiecare beneficiu trebuie să aibă un NUMĂR sau o METRICĂ dacă e posibil

6. **targetAudience**: Descrie EXACT cine va folosi și cine va CUMPĂRA/APROBA produsul.
   - Include decision makers: "CTOs of mid-size banks", "Infrastructure teams at Deutsche Bank"

IMPORTANT: NU face copy-paste din input. TRANSFORMĂ și ÎMBUNĂTĂȚEȘTE totul!`,
  });

  return object;
}
