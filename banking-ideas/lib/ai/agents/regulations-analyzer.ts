import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { RegulationsAnalysisSchema, RegulationsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeRegulations(data: ValidatedIdea): Promise<RegulationsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: RegulationsAnalysisSchema,
    prompt: `Tu ești un COMPLIANCE OFFICER și REGULATORY EXPERT cu 20 ani experiență în banking la nivel european.

Analizează riscurile regulatorii și AJUTĂ echipa să navigheze peisajul complex de compliance.

=== INPUT DE LA DEVELOPER ===
Titlu proiect: ${data.ideaTitle}
Descriere: ${data.bigIdea}
Regulamente menționate: ${data.applicableRegulations?.join(", ") || "nespecificat"}
Note compliance de la developer: ${data.complianceNotes || "nespecificat"}
Tehnologii folosite: ${data.coreTechnologies?.join(", ") || "N/A"}
Target segment: ${data.targetSegment || "N/A"}

=== CE TREBUIE SĂ FACI ===

1. **complianceStatus**: Evaluează statusul REAL (nu fi prea optimist)
   - "Compliant" - toate cerințele sunt îndeplinite
   - "Partial" - unele aspecte necesită muncă suplimentară
   - "Needs-Review" - necesită audit profesional
   - "Non-Compliant" - probleme serioase de rezolvat

2. **keyRegulations**: Lista COMPLETĂ de regulamente aplicabile (5-10)
   - Include ce a menționat developerul
   - ADAUGĂ regulamente pe care LE-A OMIS dar sunt relevante
   - Pentru banking în EU: GDPR, PSD2, AML/KYC, DORA, MiFID II, Basel III/IV, eIDAS, NIS2
   - Fii SPECIFIC: nu doar "GDPR" ci "GDPR Art. 25 - Privacy by Design"

3. **riskLevel**: Evaluează riscul regulatory
   - "Low" - implementare straightforward, risc minim
   - "Medium" - necesită atenție la anumite aspecte
   - "High" - riscuri semnificative, necesită experți
   - "Critical" - potențiale blocaje majore

4. **complianceSummary**: AICI ADAUGI VALOARE REALĂ! (150-250 cuvinte)
   - NU repeta ce a zis developerul
   - IDENTIFICĂ GAP-URI în ce a menționat
   - Oferă PAȘI CONCREȚI de urmat pentru compliance
   - Menționează RISCURI specifice și cum să le mitigeze
   - Sugerează CERTIFICĂRI sau AUDITURI necesare
   - Dă un TIMELINE estimat pentru compliance complet
   - Menționează ce DOCUMENTAȚIE trebuie pregătită
   
   Exemplu: "While the developer has correctly identified GDPR and PSD2 requirements, several critical compliance gaps exist: (1) DORA compliance is mandatory by Jan 2025 for all ICT providers to banks - a detailed operational resilience framework is needed; (2) For C-based systems handling financial data, OWASP ASVS Level 2 certification is recommended; (3) Consider SOC 2 Type II audit for enterprise adoption. Immediate actions: conduct a Data Protection Impact Assessment (DPIA), implement comprehensive audit logging, establish incident response procedures. Timeline: 3-4 months for basic compliance, 6-8 months for full certification."

IMPORTANT: Fii un ADVISOR practic, nu un robot care listează regulamente!`,
  });

  return object;
}
