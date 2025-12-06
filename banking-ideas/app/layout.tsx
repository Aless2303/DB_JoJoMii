import type { Metadata } from "next";
import "@/styles/teletext.css";

export const metadata: Metadata = {
  title: "DB IdeaText - Innovation Hub",
  description: "O platformă socială de crowdsourcing pentru idei inovative în banking, cu design retro Teletext.",
  keywords: ["banking", "fintech", "idei", "inovație", "teletext", "retro", "Deutsche Bank"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* CRT Overlay Effect */}
        <div className="crt-overlay" />
        {children}
      </body>
    </html>
  );
}
