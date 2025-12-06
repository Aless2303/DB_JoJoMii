"use client";

interface TeletextBoxProps {
  title?: string;
  children: React.ReactNode;
  color?: "cyan" | "yellow" | "green" | "magenta" | "red" | "blue";
  className?: string;
}

export function TeletextBox({ title, children, color = "cyan", className = "" }: TeletextBoxProps) {
  const colorClasses = {
    cyan: "border-teletext-cyan tt-cyan",
    yellow: "border-teletext-yellow tt-yellow",
    green: "border-teletext-green tt-green",
    magenta: "border-teletext-magenta tt-magenta",
    red: "border-teletext-red tt-red",
    blue: "border-teletext-blue tt-blue",
  };

  return (
    <div className={`mb-4 ${className}`}>
      {title && (
        <div className={`text-sm mb-1 ${colorClasses[color]}`}>
          ┌─ {title} {"─".repeat(Math.max(1, 45 - title.length))}┐
        </div>
      )}
      <div className={`border-2 p-3 ${colorClasses[color]} bg-opacity-5`} style={{ backgroundColor: `var(--teletext-${color})`, opacity: 0.05 }}>
        <div className="tt-white">
          {children}
        </div>
      </div>
      {title && (
        <div className={`text-sm mt-1 ${colorClasses[color]}`}>
          └{"─".repeat(50)}┘
        </div>
      )}
    </div>
  );
}
