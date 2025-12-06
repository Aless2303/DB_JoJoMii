import { z } from "zod";

// ============================================
// FORM SCHEMAS - Validation for each step
// ============================================

// Step 1: Basic Info
export const BasicInfoSchema = z.object({
  title: z.string().min(3, "Titlul trebuie să aibă minim 3 caractere").max(60, "Titlul nu poate depăși 60 caractere"),
  shortDescription: z.string().min(10, "Descrierea trebuie să aibă minim 10 caractere").max(280, "Descrierea nu poate depăși 280 caractere"),
  category: z.enum([
    "payments",
    "lending",
    "investments",
    "customer-experience",
    "security",
    "open-banking",
    "sustainability",
    "other"
  ], { required_error: "Selectează o categorie" }),
  problemSolved: z.string().min(20, "Descrie problema în minim 20 caractere"),
});

// Step 2: Technologies
export const TechnologiesSchema = z.object({
  aiTechnologies: z.array(z.enum([
    "machine-learning",
    "nlp",
    "computer-vision",
    "predictive-analytics",
    "generative-ai"
  ])).optional(),
  blockchainTechnologies: z.array(z.enum([
    "smart-contracts",
    "tokenization",
    "defi",
    "digital-identity"
  ])).optional(),
  otherTechnologies: z.array(z.enum([
    "iot",
    "biometrics",
    "cloud-native",
    "edge-computing",
    "quantum-safe"
  ])).optional(),
});

// Step 3: Solution Type
export const SolutionTypeSchema = z.object({
  platform: z.enum([
    "web-app",
    "mobile-app",
    "api-backend",
    "embedded",
    "chatbot",
    "hardware-software"
  ], { required_error: "Selectează tipul de platformă" }),
});

// Step 4: Business Context
export const BusinessContextSchema = z.object({
  targetSegment: z.enum([
    "retail",
    "corporate",
    "sme",
    "private-banking",
    "neo-banks",
    "insurance"
  ], { required_error: "Selectează segmentul țintă" }),
  monetizationModel: z.array(z.enum([
    "subscription",
    "transaction-fees",
    "licensing",
    "freemium",
    "revenue-sharing",
    "data-monetization"
  ])).min(1, "Selectează cel puțin un model de monetizare"),
  targetMarkets: z.array(z.enum([
    "romania",
    "europe",
    "global"
  ])).min(1, "Selectează cel puțin o piață țintă"),
});

// Step 5: Regulations
export const RegulationsSchema = z.object({
  regulations: z.array(z.enum([
    "psd2-psd3",
    "gdpr",
    "aml-kyc",
    "mica",
    "dora",
    "ai-act",
    "not-applicable"
  ])),
  complianceNotes: z.string().optional(),
});

// Step 6: Differentiators
export const DifferentiatorsSchema = z.object({
  uniqueValue: z.string().min(20, "Descrie ce face ideea unică în minim 20 caractere"),
  implementationLevel: z.number().min(0).max(100),
  githubLink: z.string().url("Introdu un URL valid pentru GitHub").refine(
    (url) => url.includes("github.com"),
    "Link-ul trebuie să fie de pe GitHub"
  ),
  competitors: z.string().optional(),
  usedAIResearch: z.boolean(),
  aiResearchDetails: z.string().optional(),
});

// Step 7: Additional Details
export const AdditionalDetailsSchema = z.object({
  team: z.string().optional(),
  estimatedTimeline: z.string().optional(),
  estimatedBudget: z.enum([
    "under-10k",
    "10k-50k",
    "50k-100k",
    "100k-500k",
    "over-500k"
  ]).optional(),
  communityQuestions: z.string().optional(),
});

// Complete Idea Schema
export const IdeaFormSchema = z.object({
  ...BasicInfoSchema.shape,
  ...TechnologiesSchema.shape,
  ...SolutionTypeSchema.shape,
  ...BusinessContextSchema.shape,
  ...RegulationsSchema.shape,
  ...DifferentiatorsSchema.shape,
  ...AdditionalDetailsSchema.shape,
});

export type IdeaFormData = z.infer<typeof IdeaFormSchema>;
export type BasicInfoData = z.infer<typeof BasicInfoSchema>;
export type TechnologiesData = z.infer<typeof TechnologiesSchema>;
export type SolutionTypeData = z.infer<typeof SolutionTypeSchema>;
export type BusinessContextData = z.infer<typeof BusinessContextSchema>;
export type RegulationsData = z.infer<typeof RegulationsSchema>;
export type DifferentiatorsData = z.infer<typeof DifferentiatorsSchema>;
export type AdditionalDetailsData = z.infer<typeof AdditionalDetailsSchema>;

// ============================================
// AI AGENT SCHEMAS - Structured outputs
// ============================================

// Content Analysis Schema
export const ContentAnalysisSchema = z.object({
  category: z.string(),
  keywords: z.array(z.string()).max(10),
  complexity: z.enum(["simple", "medium", "complex"]),
  tone: z.enum(["formal", "innovative", "technical", "accessible"]),
  targetAudience: z.string(),
  mainValueProposition: z.string().max(100),
});

export type ContentAnalysis = z.infer<typeof ContentAnalysisSchema>;

// Page Structure Schema
export const PageSectionSchema = z.object({
  type: z.enum(["header", "text", "list", "stats", "navigation"]),
  contentHint: z.string(),
});

export const PageDefinitionSchema = z.object({
  pageNumber: z.number(),
  title: z.string().max(30),
  type: z.enum(["overview", "details", "tech", "business", "contact"]),
  sections: z.array(PageSectionSchema),
});

export const PageStructureSchema = z.object({
  totalPages: z.number().min(3).max(10),
  pages: z.array(PageDefinitionSchema),
});

export type PageStructure = z.infer<typeof PageStructureSchema>;

// ASCII Elements Schema
export const ASCIIElementsSchema = z.object({
  logo: z.string(),
  icons: z.record(z.string(), z.string()),
  borders: z.object({
    top: z.string(),
    bottom: z.string(),
    separator: z.string(),
  }),
  progressBars: z.array(z.string()),
});

export type ASCIIElements = z.infer<typeof ASCIIElementsSchema>;

// Teletext Copy Schema
export const TeletextLineSchema = z.object({
  content: z.string().max(40),
  color: z.enum(["white", "yellow", "cyan", "green", "magenta", "red", "blue"]),
  style: z.enum(["normal", "double_height", "flash"]),
});

export const TeletextPageCopySchema = z.object({
  pageNumber: z.number(),
  lines: z.array(TeletextLineSchema),
});

export const TeletextCopySchema = z.object({
  pages: z.array(TeletextPageCopySchema),
});

export type TeletextCopy = z.infer<typeof TeletextCopySchema>;

// Rendered Page Schema
export const RenderedPageSchema = z.object({
  pageNumber: z.number(),
  html: z.string(),
  css: z.string(),
  navigation: z.object({
    prev: z.number().nullable(),
    next: z.number().nullable(),
    related: z.array(z.number()),
  }),
});

export type RenderedPage = z.infer<typeof RenderedPageSchema>;

// ============================================
// CATEGORY LABELS
// ============================================

export const CATEGORY_LABELS: Record<string, string> = {
  "payments": "Plăți & Transferuri",
  "lending": "Lending & Credit",
  "investments": "Investiții & Wealth Management",
  "customer-experience": "Customer Experience",
  "security": "Securitate & Fraud Prevention",
  "open-banking": "Open Banking & API",
  "sustainability": "Sustainability & ESG",
  "other": "Altele",
};

export const AI_TECH_LABELS: Record<string, string> = {
  "machine-learning": "Machine Learning / Deep Learning",
  "nlp": "Natural Language Processing (NLP)",
  "computer-vision": "Computer Vision",
  "predictive-analytics": "Predictive Analytics",
  "generative-ai": "Generative AI (LLMs)",
};

export const BLOCKCHAIN_TECH_LABELS: Record<string, string> = {
  "smart-contracts": "Smart Contracts",
  "tokenization": "Tokenization",
  "defi": "DeFi Integration",
  "digital-identity": "Digital Identity",
};

export const OTHER_TECH_LABELS: Record<string, string> = {
  "iot": "IoT",
  "biometrics": "Biometrics",
  "cloud-native": "Cloud Native",
  "edge-computing": "Edge Computing",
  "quantum-safe": "Quantum-safe Cryptography",
};

export const PLATFORM_LABELS: Record<string, string> = {
  "web-app": "Web Application",
  "mobile-app": "Mobile App (iOS/Android)",
  "api-backend": "API / Backend Service",
  "embedded": "Embedded / White-label",
  "chatbot": "Chatbot / Voice Assistant",
  "hardware-software": "Hardware + Software",
};

export const SEGMENT_LABELS: Record<string, string> = {
  "retail": "Retail Banking (B2C)",
  "corporate": "Corporate Banking (B2B)",
  "sme": "SME Banking",
  "private-banking": "Private Banking / Wealth",
  "neo-banks": "Neo-banks / Challengers",
  "insurance": "Insurance (Bancassurance)",
};

export const MONETIZATION_LABELS: Record<string, string> = {
  "subscription": "Subscription (SaaS)",
  "transaction-fees": "Transaction-based fees",
  "licensing": "Licensing",
  "freemium": "Freemium",
  "revenue-sharing": "Revenue sharing",
  "data-monetization": "Data monetization (anonimizat)",
};

export const MARKET_LABELS: Record<string, string> = {
  "romania": "România",
  "europe": "Europa (EU)",
  "global": "Global",
};

export const REGULATION_LABELS: Record<string, string> = {
  "psd2-psd3": "PSD2 / PSD3",
  "gdpr": "GDPR",
  "aml-kyc": "AML / KYC",
  "mica": "MiCA (Crypto)",
  "dora": "DORA (Digital Operational Resilience)",
  "ai-act": "AI Act",
  "not-applicable": "Nu este cazul",
};

export const BUDGET_LABELS: Record<string, string> = {
  "under-10k": "Sub €10,000",
  "10k-50k": "€10,000 - €50,000",
  "50k-100k": "€50,000 - €100,000",
  "100k-500k": "€100,000 - €500,000",
  "over-500k": "Peste €500,000",
};

export const IMPLEMENTATION_LABELS: Record<number, string> = {
  0: "Doar concept",
  25: "Design / Mockups",
  50: "Prototip funcțional",
  75: "MVP testat",
  100: "Produs live",
};
