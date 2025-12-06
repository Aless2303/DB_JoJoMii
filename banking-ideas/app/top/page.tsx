import Link from "next/link";
import { TeletextScreen, TeletextHeader, TeletextBox, StarRating } from "@/components/teletext";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

// Fetch top ideas sorted by (likes - dislikes) descending
async function getTopIdeas() {
  const result = await db
    .select({
      id: ideas.id,
      title: ideas.title,
      category: ideas.category,
      likes: ideas.likes,
      dislikes: ideas.dislikes,
      aiScore: ideas.aiScore,
      status: ideas.status,
    })
    .from(ideas)
    .orderBy(desc(sql`${ideas.likes} - ${ideas.dislikes}`))
    .limit(10);
  
  return result;
}

// Map category to short code
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

export default async function TopPage() {
  const topIdeas = await getTopIdeas();
  return (
    <TeletextScreen>
      <TeletextHeader 
        title="TOP VOTAT" 
        pageNumber={103}
        subtitle="CELE MAI POPULARE IDEI"
      />

      {/* Trophy ASCII */}
      <div className="text-center mt-4 tt-yellow ascii-art">
        <pre className="text-xs">{`
       ___________
      '._==_==_=_.'
      .-\\:      /-.
     | (|:.     |) |
      '-|:.     |-'
        \\::.    /
         '::. .'
           ) (
         _.' '._
        '-------'
        `}</pre>
      </div>

      <div className="space-y-3 mt-6">
        {topIdeas.length === 0 ? (
          <div className="text-center py-8">
            <div className="tt-yellow text-xl">░░░ NU EXISTĂ IDEI VOTATE ░░░</div>
            <div className="tt-cyan mt-2">Fii primul care adaugă și votează o idee!</div>
          </div>
        ) : (
          topIdeas.map((idea, index) => {
            const netVotes = (idea.likes || 0) - (idea.dislikes || 0);
            const aiScoreDisplay = idea.aiScore ? `${idea.aiScore}%` : 'N/A';
            
            return (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="block group"
              >
                <div className={`
                  p-3 border-2 transition-all
                  ${index === 0 ? "border-teletext-yellow tt-yellow" : 
                    index === 1 ? "border-teletext-white tt-white" :
                    index === 2 ? "border-teletext-yellow tt-yellow opacity-80" :
                    "border-teletext-cyan tt-cyan"}
                  group-hover:bg-teletext-cyan group-hover:bg-opacity-10
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`
                        text-2xl font-bold
                        ${index === 0 ? "tt-yellow" : 
                          index === 1 ? "tt-white" :
                          index === 2 ? "tt-yellow" : "tt-cyan"}
                      `}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-bold group-hover:tt-white">
                          {idea.title.length > 40 ? idea.title.substring(0, 40) + '...' : idea.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="tt-green">[{getCategoryCode(idea.category)}]</span>
                          <span className="tt-cyan">
                            <span className="tt-green">▲{idea.likes || 0}</span>
                            /
                            <span className="tt-red">▼{idea.dislikes || 0}</span>
                            {" "}({netVotes > 0 ? '+' : ''}{netVotes} net)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="tt-yellow text-lg font-bold">AI: {aiScoreDisplay}</div>
                      <div className="text-sm tt-cyan">{idea.status.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Legend */}
      <TeletextBox title="LEGENDĂ" color="cyan" className="mt-6">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="tt-yellow">█</span>
            <span>Locul 1 (Aur)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tt-white">█</span>
            <span>Locul 2 (Argint)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="tt-yellow opacity-80">█</span>
            <span>Locul 3 (Bronz)</span>
          </div>
        </div>
      </TeletextBox>

      {/* Navigation */}
      <div className="mt-6 tt-cyan text-center">
        ═══════════════════════════════════════════════════════════════
      </div>
      <div className="flex justify-between items-center mt-4">
        <Link href="/categories" className="tt-cyan hover:tt-yellow">
          ◀ 102 CATEGORII
        </Link>
        <span className="tt-yellow">P.103</span>
        <Link href="/ideas/new" className="tt-green hover:tt-yellow">
          200 ADAUGĂ IDEE ▶
        </Link>
      </div>
    </TeletextScreen>
  );
}
