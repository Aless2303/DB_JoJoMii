"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  pageNumber: number;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { pageNumber: 100, label: "INDEX", href: "/" },
  { pageNumber: 101, label: "IDEI", href: "/ideas" },
  { pageNumber: 102, label: "CATEGORII", href: "/categories" },
  { pageNumber: 103, label: "TOP", href: "/top" },
  { pageNumber: 200, label: "ADAUGĂ", href: "/ideas/new" },
];

export function TeletextNav() {
  const pathname = usePathname();

  return (
    <nav className="teletext-nav">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.pageNumber}
                  href={item.href}
                  className={`
                    flex items-center gap-1 transition-all
                    ${isActive 
                      ? "tt-yellow teletext-glow-strong" 
                      : "tt-cyan hover:tt-white"
                    }
                  `}
                >
                  <span className="text-sm">{item.pageNumber}</span>
                  <span>▶</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="tt-green text-sm">
            FASTTXT ▌ Navigare rapidă
          </div>
        </div>
      </div>
    </nav>
  );
}
