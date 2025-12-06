"use client";

interface TeletextProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "green" | "cyan" | "yellow" | "red";
}

export function TeletextProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "green",
}: TeletextProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const blocks = 20;
  const filledBlocks = Math.round((percentage / 100) * blocks);
  const emptyBlocks = blocks - filledBlocks;

  const colorClass = {
    green: "tt-green",
    cyan: "tt-cyan",
    yellow: "tt-yellow",
    red: "tt-red",
  };

  return (
    <div className="mb-2">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="tt-cyan">{label}</span>
          {showPercentage && <span className="tt-yellow">{percentage}%</span>}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className={colorClass[color]}>
          {"█".repeat(filledBlocks)}
          {"░".repeat(emptyBlocks)}
        </span>
      </div>
    </div>
  );
}

interface TeletextSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  labels?: { [key: number]: string };
}

export function TeletextSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 25,
  label,
  labels,
}: TeletextSliderProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block tt-cyan mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="teletext-slider"
        />
        <div className="flex justify-between text-sm">
          {labels ? (
            Object.entries(labels).map(([key, labelText]) => (
              <span
                key={key}
                className={Number(key) === value ? "tt-yellow" : "tt-cyan"}
              >
                {labelText}
              </span>
            ))
          ) : (
            <>
              <span className="tt-cyan">{min}%</span>
              <span className="tt-yellow font-bold">{value}%</span>
              <span className="tt-cyan">{max}%</span>
            </>
          )}
        </div>
      </div>
      <TeletextProgress value={value} max={max} showPercentage={false} />
    </div>
  );
}
