import Link from "next/link";
import { TeletextScreen, TeletextHeader, TeletextTable, StarRating } from "@/components/teletext";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { CATEGORY_LABELS } from "@/lib/schemas";

// Fetch ideas from database
async function getIdeas() {
  const result = await db
    .select({
      id: ideas.id,
      title: ideas.title,
      category: ideas.category,
      likes: ideas.likes,
      dislikes: ideas.dislikes,
      status: ideas.status,
      aiScore: ideas.aiScore,
      pageNumber: ideas.pageNumber,
      createdAt: ideas.createdAt,
    })
    .from(ideas)
    .orderBy(desc(ideas.createdAt))
    .limit(50);
  
  return result;
}

// Map category to short code for display
function getCategoryCode(category: string): string {
  const codeMap: Record<string, string> = {
    "payments": "PAY",
    "lending": "LEND",
    "investments": "INV",
    "customer-experience": "CX",
    "security": "SEC",
    "open-banking": "API",
    "sustainability": "ESG",
    "other": "OTHER",
    "Digital Banking": "DIGI",
    "Payments & Transfers": "PAY",
    "Wealth Management": "WEALTH",
    "Lending & Credit": "LEND",
    "Insurance": "INS",
    "Fraud & Security": "SEC",
    "Customer Experience": "CX",
    "Internal Operations": "OPS",
    "ESG & Sustainability": "ESG",
  };
  return codeMap[category] || category.substring(0, 4).toUpperCase();
}

export default async function IdeasPage() {
  const ideasList = await getIdeas();
  return (
    <TeletextScreen>
      <TeletextHeader 
        title="IDEI RECENTE" 
        pageNumber={101}
        subtitle="LISTA TUTUROR IDEILOR"
      />
      
      <div className="mt-6 overflow-x-auto">
        <table className="teletext-table w-full">
          <thead>
            <tr>
              <th className="w-16">NR</th>
              <th>TITLU</th>
              <th className="w-20">CAT</th>
              <th className="w-28">VOTURI</th>
              <th className="w-16">PAG</th>
            </tr>
          </thead>
          <tbody>
            {ideasList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center tt-yellow py-8">
                  ░░░ NU EXISTĂ IDEI ÎNCĂ ░░░
                  <div className="mt-2 tt-cyan text-sm">Fii primul care adaugă o idee!</div>
                </td>
              </tr>
            ) : (
              ideasList.map((idea, index) => (
                <tr key={idea.id} className="hover:bg-teletext-cyan hover:bg-opacity-10 cursor-pointer">
                  <td className="tt-cyan">{String(index + 1).padStart(3, '0')}</td>
                  <td>
                    <Link 
                      href={`/ideas/${idea.id}`}
                      className="tt-white hover:tt-yellow transition-colors"
                    >
                      {idea.title.length > 35 ? idea.title.substring(0, 35) + '...' : idea.title}
                    </Link>
                  </td>
                  <td className="tt-green">{getCategoryCode(idea.category)}</td>
                  <td>
                    <span className="tt-green">▲{idea.likes || 0}</span>
                    <span className="tt-white">/</span>
                    <span className="tt-red">▼{idea.dislikes || 0}</span>
                  </td>
                  <td>
                    <Link 
                      href={`/ideas/${idea.id}`}
                      className="tt-cyan hover:tt-yellow"
                    >
                      {idea.pageNumber || 100 + index}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 tt-cyan text-center">
        ═══════════════════════════════════════════════════════════════
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="tt-cyan">◀ 100 ÎNAPOI</span>
        <span className="tt-yellow">PAGINA 1/17</span>
        <span className="tt-cyan">URMĂTOAREA ▶ 102</span>
      </div>

      {/* Instructions */}
      <div className="mt-6 tt-green text-center text-sm">
        ═══════════════════════════════════════════════════════════════
        <div className="mt-2">
          ▌ Tastează numărul din coloana PAG pentru detalii ▌
        </div>
      </div>

      {/* Add new idea button */}
      <div className="mt-6 text-center">
        <Link 
          href="/ideas/new"
          className="inline-block teletext-button teletext-button-primary"
        >
          ★ ADAUGĂ IDEE NOUĂ [200]
        </Link>
      </div>
    </TeletextScreen>
  );
}
