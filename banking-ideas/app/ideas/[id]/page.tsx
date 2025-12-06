"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  TeletextScreen, 
  TeletextHeader, 
  TeletextBox, 
  TeletextProgress,
  VotingBox,
  StarRating 
} from "@/components/teletext";
import { CATEGORY_LABELS, PLATFORM_LABELS, SEGMENT_LABELS, IMPLEMENTATION_LABELS } from "@/lib/schemas";

interface IdeaDetail {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  problemSolved: string;
  platform: string;
  targetSegment: string;
  implementationLevel: number;
  githubLink: string;
  uniqueValue: string;
  pageNumber: number;
  status: string;
  averageRating: number;
  totalVotes: number;
  viewCount: number;
  generatedPages: any[];
  aiTechnologies: string[];
  blockchainTechnologies: string[];
  otherTechnologies: string[];
}

export default function IdeaDetailPage() {
  const params = useParams();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [userVote, setUserVote] = useState<number | undefined>();

  useEffect(() => {
    fetchIdea();
  }, [params.id]);

  const fetchIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIdea(data);
      }
    } catch (error) {
      console.error("Error fetching idea:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (rating: number) => {
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: params.id,
          rating,
          sessionId: `session-${Date.now()}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserVote(rating);
        setIdea(prev => prev ? {
          ...prev,
          averageRating: result.averageRating,
          totalVotes: result.totalVotes,
        } : null);
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (loading) {
    return (
      <TeletextScreen>
        <TeletextHeader title="ÎNCĂRCARE..." pageNumber={0} />
        <div className="text-center mt-20">
          <div className="tt-cyan text-2xl teletext-loading">
            ░░░ SE ÎNCARCĂ DATELE ░░░
          </div>
        </div>
      </TeletextScreen>
    );
  }

  if (!idea) {
    return (
      <TeletextScreen>
        <TeletextHeader title="EROARE" pageNumber={404} />
        <div className="text-center mt-20">
          <div className="tt-red text-2xl">
            ⚠ IDEEA NU A FOST GĂSITĂ
          </div>
        </div>
      </TeletextScreen>
    );
  }

  // Get all technologies
  const allTechnologies = [
    ...(idea.aiTechnologies || []),
    ...(idea.blockchainTechnologies || []),
    ...(idea.otherTechnologies || []),
  ];

  return (
    <TeletextScreen>
      <TeletextHeader 
        title={idea.title.substring(0, 20).toUpperCase()} 
        pageNumber={idea.pageNumber || 110}
        subtitle={idea.title}
      />

      {/* Status indicator */}
      {idea.status === "processing" && (
        <div className="mb-4 p-3 border-2 border-teletext-yellow animate-pulse">
          <div className="tt-yellow text-center">
            ░░░ SE GENEREAZĂ PAGINILE TELETEXT ░░░
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {/* Main Info Box */}
        <TeletextBox title="PREZENTARE GENERALĂ" color="cyan">
          <div className="space-y-3">
            <div>
              <span className="tt-cyan">▶ Categorie: </span>
              <span className="tt-yellow">{CATEGORY_LABELS[idea.category] || idea.category}</span>
            </div>
            <div>
              <span className="tt-cyan">▶ Platformă: </span>
              <span className="tt-green">{PLATFORM_LABELS[idea.platform] || idea.platform}</span>
            </div>
            <div>
              <span className="tt-cyan">▶ Segment: </span>
              <span className="tt-white">{SEGMENT_LABELS[idea.targetSegment] || idea.targetSegment}</span>
            </div>
            <div className="mt-4">
              <span className="tt-cyan">▶ Descriere:</span>
              <p className="tt-white mt-1">{idea.shortDescription}</p>
            </div>
          </div>
        </TeletextBox>

        {/* Implementation Status */}
        <TeletextBox title="STATUS IMPLEMENTARE" color="green">
          <TeletextProgress 
            value={idea.implementationLevel} 
            max={100}
            label={IMPLEMENTATION_LABELS[idea.implementationLevel as keyof typeof IMPLEMENTATION_LABELS] || `${idea.implementationLevel}%`}
            color="green"
          />
          <div className="mt-3">
            <span className="tt-cyan">▶ GitHub: </span>
            <a 
              href={idea.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="tt-yellow hover:tt-white underline"
            >
              {idea.githubLink}
            </a>
          </div>
        </TeletextBox>

        {/* Technologies */}
        {allTechnologies.length > 0 && (
          <TeletextBox title="TEHNOLOGII" color="magenta">
            <div className="flex flex-wrap gap-2">
              {allTechnologies.map((tech, index) => (
                <span key={index} className="tt-cyan">
                  [{tech}]
                </span>
              ))}
            </div>
          </TeletextBox>
        )}

        {/* Problem & Solution */}
        <TeletextBox title="PROBLEMA REZOLVATĂ" color="yellow">
          <p className="tt-white">{idea.problemSolved}</p>
        </TeletextBox>

        <TeletextBox title="VALOARE UNICĂ" color="cyan">
          <p className="tt-white">{idea.uniqueValue}</p>
        </TeletextBox>

        {/* Stats */}
        <TeletextBox title="STATISTICI" color="blue">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="tt-yellow text-2xl">{idea.totalVotes || 0}</div>
              <div className="tt-cyan text-sm">VOTURI</div>
            </div>
            <div>
              <div className="tt-yellow text-2xl">{idea.averageRating?.toFixed(1) || "N/A"}</div>
              <div className="tt-cyan text-sm">RATING</div>
            </div>
            <div>
              <div className="tt-yellow text-2xl">{idea.viewCount || 0}</div>
              <div className="tt-cyan text-sm">VIZUALIZĂRI</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <StarRating rating={Math.round(idea.averageRating || 0)} readonly />
          </div>
        </TeletextBox>

        {/* Voting */}
        <VotingBox onVote={handleVote} currentVote={userVote} />

        {/* Generated Pages Preview */}
        {idea.generatedPages && idea.generatedPages.length > 0 && (
          <TeletextBox title="PAGINI GENERATE" color="green">
            <div className="space-y-2">
              {idea.generatedPages.map((page: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`
                    w-full text-left p-2 transition-colors
                    ${currentPage === index ? "tt-yellow bg-teletext-yellow bg-opacity-10" : "tt-cyan hover:tt-white"}
                  `}
                >
                  ▶ P.{page.pageNumber} - Pagina {index + 1}
                </button>
              ))}
            </div>
          </TeletextBox>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 tt-cyan text-center">
        ═══════════════════════════════════════════════════════════════
      </div>
      <div className="flex justify-between items-center mt-4">
        <a href="/ideas" className="tt-cyan hover:tt-yellow">
          ◀ 101 ÎNAPOI LA LISTĂ
        </a>
        <span className="tt-yellow">P.{idea.pageNumber}</span>
        <a href="/ideas/new" className="tt-green hover:tt-yellow">
          200 ADAUGĂ IDEE ▶
        </a>
      </div>
    </TeletextScreen>
  );
}
