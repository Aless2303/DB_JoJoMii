"use client";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  onRate,
  readonly = false,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const emptyStars = maxRating - fullStars;

  const handleClick = (newRating: number) => {
    if (!readonly && onRate) {
      onRate(newRating);
    }
  };

  return (
    <div className="star-rating flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i + 1)}
          disabled={readonly}
          className={`
            text-xl transition-transform
            ${!readonly ? "hover:scale-125 cursor-pointer" : "cursor-default"}
            ${i < fullStars ? "tt-yellow" : "star-empty"}
          `}
        >
          ★
        </button>
      ))}
    </div>
  );
}

interface VotingBoxProps {
  onVote: (rating: number) => void;
  currentVote?: number;
}

export function VotingBox({ onVote, currentVote }: VotingBoxProps) {
  const options = [
    { rating: 1, label: "Nu mă convinge" },
    { rating: 2, label: "Interesant, dar..." },
    { rating: 3, label: "Promițător" },
    { rating: 4, label: "Foarte bun!" },
    { rating: 5, label: "Trebuie implementat!" },
  ];

  return (
    <div className="teletext-box p-4">
      <div className="tt-yellow mb-3 teletext-glow">
        ▌█▌ VOTEAZĂ ACEASTĂ IDEE
      </div>
      <div className="tt-cyan mb-4">─────────────────────────────────────</div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.rating}
            onClick={() => onVote(option.rating)}
            className={`
              w-full text-left p-2 flex items-center gap-3 transition-all
              ${currentVote === option.rating 
                ? "tt-yellow teletext-glow" 
                : "tt-white hover:tt-cyan"
              }
            `}
          >
            <span className="tt-cyan">[{option.rating}]</span>
            <span>{"★".repeat(option.rating)}{"☆".repeat(5 - option.rating)}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 tt-green text-sm">
        Apasă tasta [1-5] pentru a vota
      </div>
    </div>
  );
}
