import Link from "next/link";
import { TeletextScreen, TeletextHeader, TeletextBox } from "@/components/teletext";
import { CATEGORY_LABELS } from "@/lib/schemas";

const categoryIcons: Record<string, string> = {
  "payments": "💳",
  "lending": "🏦",
  "investments": "📈",
  "customer-experience": "👤",
  "security": "🔒",
  "open-banking": "🔗",
  "sustainability": "🌱",
  "other": "💡",
};

const categoryDescriptions: Record<string, string> = {
  "payments": "Transfer bani, plăți instant, wallets",
  "lending": "Credite, împrumuturi, scoring",
  "investments": "Wealth management, trading",
  "customer-experience": "UX/UI, onboarding, suport",
  "security": "Fraud prevention, autentificare",
  "open-banking": "API-uri, PSD2, integrări",
  "sustainability": "ESG, green finance, impact",
  "other": "Alte idei inovative",
};

export default function CategoriesPage() {
  return (
    <TeletextScreen>
      <TeletextHeader 
        title="CATEGORII" 
        pageNumber={102}
        subtitle="EXPLOREAZĂ IDEI PE CATEGORII"
      />

      <div className="grid gap-4 mt-6">
        {Object.entries(CATEGORY_LABELS).map(([key, label], index) => (
          <Link
            key={key}
            href={`/ideas?category=${key}`}
            className="block group"
          >
            <TeletextBox color={index % 2 === 0 ? "cyan" : "green"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[key] || "📁"}</span>
                  <div>
                    <div className="tt-yellow group-hover:tt-white font-bold transition-colors">
                      {label}
                    </div>
                    <div className="tt-cyan text-sm">
                      {categoryDescriptions[key]}
                    </div>
                  </div>
                </div>
                <span className="tt-green group-hover:tt-yellow text-xl">▶</span>
              </div>
            </TeletextBox>
          </Link>
        ))}
      </div>

      {/* ASCII Art decoration */}
      <div className="mt-8 tt-cyan text-center ascii-art text-xs">
        <pre>{`
╔════════════════════════════════════════════╗
║     ▓▓▓ SELECTEAZĂ O CATEGORIE ▓▓▓        ║
║                                            ║
║   [AI]  [BLOCKCHAIN]  [PAYMENTS]  [ESG]   ║
║                                            ║
║       Tastează numărul categoriei          ║
╚════════════════════════════════════════════╝
        `}</pre>
      </div>

      {/* Navigation */}
      <div className="mt-6 tt-cyan text-center">
        ═══════════════════════════════════════════════════════════════
      </div>
      <div className="flex justify-between items-center mt-4">
        <Link href="/" className="tt-cyan hover:tt-yellow">
          ◀ 100 INDEX
        </Link>
        <span className="tt-yellow">P.102</span>
        <Link href="/ideas" className="tt-cyan hover:tt-yellow">
          101 IDEI ▶
        </Link>
      </div>
    </TeletextScreen>
  );
}
