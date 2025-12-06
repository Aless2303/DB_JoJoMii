"use client";

interface TeletextHeaderProps {
  title: string;
  pageNumber: number;
  subtitle?: string;
}

export function TeletextHeader({ title, pageNumber, subtitle }: TeletextHeaderProps) {
  return (
    <div className="mb-4">
      {/* Main Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-teletext-blue via-teletext-cyan to-teletext-blue p-2">
        <div className="flex items-center gap-2">
          <span className="text-teletext-yellow font-bold">████</span>
          <span className="text-teletext-white font-bold tracking-wider text-xl teletext-glow">
            {title}
          </span>
          <span className="text-teletext-yellow font-bold">
            {"█".repeat(Math.max(1, 20 - title.length))}
          </span>
        </div>
        <span className="page-number">P.{pageNumber}</span>
      </div>
      
      {/* Separator */}
      <div className="tt-cyan text-center">
        ═══════════════════════════════════════════════════════════════
      </div>
      
      {/* Subtitle if provided */}
      {subtitle && (
        <div className="mt-2 tt-yellow text-center teletext-glow">
          ▌█▌ {subtitle}
        </div>
      )}
    </div>
  );
}
