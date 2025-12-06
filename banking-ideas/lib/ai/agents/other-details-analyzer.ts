import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { OtherDetailsAnalysisSchema, OtherDetailsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeOtherDetails(data: ValidatedIdea): Promise<OtherDetailsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: OtherDetailsAnalysisSchema,
    prompt: `Tu ești un PROGRAM MANAGER pentru un accelerator de startups la Deutsche Bank.

Evaluează echipa și resursele necesare pentru a duce acest proiect la succes.

=== INPUT DE LA DEVELOPER ===
Titlu: ${data.ideaTitle}
Descriere: ${data.bigIdea}
Echipă: ${data.teamComposition || "nespecificat"}
Demo video: ${data.demoVideo || "N/A"}
Ce au nevoie de la DB: ${data.needsFromDB || "nespecificat"}
Note adiționale: ${data.additionalNotes || "nespecificat"}
Stadiu proiect: ${data.projectStage || "N/A"}
Tehnologii: ${data.coreTechnologies?.join(", ") || "N/A"}

=== CE TREBUIE SĂ FACI ===

1. **teamSize**: Evaluează și COMENTEAZĂ echipa (nu doar numărul)
   - Dacă e un singur developer: "Solo developer - impressive for scope achieved, will need team expansion for enterprise deployment"
   - Dacă e echipă: evaluează dacă au skillurile necesare
   - Sugerează ce ROLURI lipsesc
   - Exemplu: "1 backend developer. For enterprise banking deployment, team would benefit from: DevOps engineer, security specialist, QA lead. Current size is suitable for PoC phase."

2. **hasDemo**: true/false - există demonstrație?

3. **supportNeeded**: Lista de 4-6 tipuri de SUPORT concret de la Deutsche Bank
   - NU copia ce a zis developerul
   - ADAUGĂ ce ar avea nevoie dar nu a cerut
   - Fii SPECIFIC: nu "mentorship" ci "Technical mentorship from API Platform team"
   - Include: sandbox access, technical review, pilot customers, regulatory guidance, infrastructure
   - Exemplu: ["Sandbox API access with test transaction data", "Code review from DB Security team", "Pilot deployment with 5 internal users", "Regulatory guidance on DORA compliance", "Cloud infrastructure budget (est. €5K/month)"]

4. **additionalHighlights**: 4-6 PUNCTE FORTE suplimentare pentru pitch
   - Extrage insight-uri din toate datele disponibile
   - Fii CREATIV - ce ar impresiona un investitor?
   - Include aspecte pe care developerul le-a menționat dar nu le-a evidențiat
   - Exemplu: 
     - "Open-source approach enables community contributions and trust"
     - "Extensible architecture allows rapid feature development"
     - "No vendor lock-in - runs on any cloud provider"
     - "Battle-tested C codebase - memory safe, no GC pauses"
     - "Developer has proven backend expertise"
   
IMPORTANT: Fii un ADVOCATE pentru acest proiect - găsește și evidențiază punctele forte!`,
  });

  return object;
}
