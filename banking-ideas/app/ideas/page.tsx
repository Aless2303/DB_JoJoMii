import Link from "next/link";
import { TeletextScreen, TeletextHeader, TeletextTable, StarRating } from "@/components/teletext";

// Mock data - în producție va veni din baza de date
const mockIdeas = [
  { id: "1", number: "001", title: "AI Credit Scoring", category: "AI", rating: 4, pageNumber: 110 },
  { id: "2", number: "002", title: "Blockchain KYC", category: "BLOCK", rating: 3, pageNumber: 120 },
  { id: "3", number: "003", title: "Voice Banking Assistant", category: "AI", rating: 5, pageNumber: 130 },
  { id: "4", number: "004", title: "Green Investment Tracker", category: "ESG", rating: 3, pageNumber: 140 },
  { id: "5", number: "005", title: "Instant Micro-Loans", category: "LEND", rating: 4, pageNumber: 150 },
  { id: "6", number: "006", title: "Biometric Auth 2.0", category: "SEC", rating: 4, pageNumber: 160 },
  { id: "7", number: "007", title: "Open Banking Dashboard", category: "API", rating: 3, pageNumber: 170 },
  { id: "8", number: "008", title: "Carbon Footprint Card", category: "ESG", rating: 5, pageNumber: 180 },
];

export default function IdeasPage() {
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
            {mockIdeas.map((idea) => (
              <tr key={idea.id} className="hover:bg-teletext-cyan hover:bg-opacity-10 cursor-pointer">
                <td className="tt-cyan">{idea.number}</td>
                <td>
                  <Link 
                    href={`/ideas/${idea.id}`}
                    className="tt-white hover:tt-yellow transition-colors"
                  >
                    {idea.title}
                  </Link>
                </td>
                <td className="tt-green">{idea.category}</td>
                <td>
                  <StarRating rating={idea.rating} readonly />
                </td>
                <td>
                  <Link 
                    href={`/ideas/${idea.id}`}
                    className="tt-cyan hover:tt-yellow"
                  >
                    {idea.pageNumber}
                  </Link>
                </td>
              </tr>
            ))}
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
