import type { Metadata } from "next";
import "@/styles/teletext.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "DB IdeaText - Innovation Hub",
  description: "A social crowdsourcing platform for innovative banking ideas, with retro Teletext design.",
  keywords: ["banking", "fintech", "ideas", "innovation", "teletext", "retro", "Deutsche Bank"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {/* CRT Overlay Effect */}
          <div className="crt-overlay" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
