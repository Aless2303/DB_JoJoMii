import Link from "next/link";
import { TeletextScreen, TeletextHeader, TeletextBox, StarRating } from "@/components/teletext";

// Mock data pentru top idei
const topIdeas = [
  { id: "1", rank: 1, title: "Voice Banking Assistant", rating: 4.9, votes: 156, category: "AI" },
  { id: "2", rank: 2, title: "Carbon Footprint Card", rating: 4.8, votes: 142, category: "ESG" },
  { id: "3", rank: 3, title: "AI Credit Scoring", rating: 4.7, votes: 128, category: "AI" },
  { id: "4", rank: 4, title: "Instant Micro-Loans", rating: 4.6, votes: 115, category: "LEND" },
  { id: "5", rank: 5, title: "Biometric Auth 2.0", rating: 4.5, votes: 98, category: "SEC" },
  { id: "6", rank: 6, title: "Open Banking Dashboard", rating: 4.4, votes: 87, category: "API" },
  { id: "7", rank: 7, title: "Blockchain KYC", rating: 4.3, votes: 76, category: "BLOCK" },
  { id: "8", rank: 8, title: "Green Investment Tracker", rating: 4.2, votes: 65, category: "ESG" },
];

export default function TopPage() {
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
        {topIdeas.map((idea, index) => (
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
                    #{idea.rank}
                  </span>
                  <div>
                    <div className="font-bold group-hover:tt-white">
                      {idea.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="tt-green">[{idea.category}]</span>
                      <span className="tt-cyan">{idea.votes} voturi</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={Math.round(idea.rating)} readonly />
                  <div className="tt-yellow text-sm">{idea.rating.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
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
