"use client";

import { useState, useEffect } from "react";

// Tipul pentru o idee
interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  votes: number;
  author: string;
  date: string;
  github: string;
}

// Mock data - în producție va veni din baza de date
const mockIdeas: Idea[] = [
  {
    id: 247,
    title: "AI Portfolio Advisor - Robo-consultant retro",
    description: "Un consultant de portofoliu bazat pe AI care folosește interfață text-mode pentru a oferi sfaturi de investiții. Utilizatorii primesc recomandări personalizate într-un format retro, făcând finanțele accesibile și nostalgice în același timp. Include analiză de risc, diversificare și tracking în timp real.",
    status: "new",
    votes: 42,
    author: "@maria.developer",
    date: "05 Dec 2025",
    github: "https://github.com/maria/ai-portfolio",
  },
  {
    id: 246,
    title: "Teletext Banking - Mobile banking în stil 80s",
    description: "O aplicație de mobile banking care recreează experiența teletext pentru operațiuni bancare simple. Navigare cu taste numerice, afișare solduri, transferuri rapide - totul într-un format vizual retro dar cu securitate modernă. Perfect pentru nostalgici și pentru cei care preferă simplitatea.",
    status: "review",
    votes: 89,
    author: "@alex.coder",
    date: "03 Dec 2025",
    github: "https://github.com/alex/teletext-banking",
  },
  {
    id: 245,
    title: "Expense Tracker DOS - Gestiune cheltuieli CLI",
    description: "Un tracker de cheltuieli cu interfață DOS care rulează în terminal. Comenzi simple, rapoarte ASCII, export CSV. Nostalgie pură pentru developeri.",
    status: "approved",
    votes: 156,
    author: "@retro.dev",
    date: "01 Dec 2025",
    github: "https://github.com/retro/expense-dos",
  },
  {
    id: 244,
    title: "Retro Stock Ticker - Date bursiere în ASCII",
    description: "Aplicație desktop care afișează date bursiere în timp real folosind caractere ASCII și grafice text-mode. Include alarme și notificări.",
    status: "building",
    votes: 203,
    author: "@stock.wizard",
    date: "28 Nov 2025",
    github: "https://github.com/wizard/stock-ticker",
  },
  {
    id: 243,
    title: "Pixel Budget - Planificator financiar 8-bit",
    description: "Planificator de buget cu grafică 8-bit și sunete retro. Gamification pentru economisire cu achievement-uri și level-uri.",
    status: "new",
    votes: 31,
    author: "@pixel.master",
    date: "25 Nov 2025",
    github: "https://github.com/pixel/budget-game",
  },
];

const stats = {
  totalIdeas: 247,
  inReview: 38,
  approved: 12,
  building: 5,
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [currentPage, setCurrentPage] = useState("P100");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [dateTime, setDateTime] = useState("");

  // Update datetime
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setDateTime(now.toLocaleDateString("en-GB", options).replace(",", ""));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal on Escape
      if (e.key === "Escape" && selectedIdea) {
        setSelectedIdea(null);
        return;
      }
      
      const key = e.key;
      if (key >= "1" && key <= "4" && !selectedIdea) {
        const tabs = ["browse", "submit", "top", "about"];
        const tabIndex = parseInt(key) - 1;
        if (tabs[tabIndex]) {
          showTab(tabs[tabIndex]);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdea]);

  const showTab = (tabName: string) => {
    setActiveTab(tabName);
    const pageMap: Record<string, string> = {
      browse: "P100",
      submit: "P200",
      top: "P300",
      about: "P900",
    };
    setCurrentPage(pageMap[tabName] || "P100");
  };

  const openIdeaModal = (idea: Idea) => {
    setSelectedIdea(idea);
  };

  const closeModal = () => {
    setSelectedIdea(null);
  };

  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      new: "status-new",
      review: "status-review",
      approved: "status-approved",
      building: "status-building",
    };
    return statusMap[status] || "status-new";
  };

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      new: "NOU",
      review: "REVIEW",
      approved: "APROBAT",
      building: "BUILD",
    };
    return labelMap[status] || "NOU";
  };

  const generateMockup = () => {
    const preview = document.getElementById("ai-preview");
    const frame = document.getElementById("ai-mockup-frame");
    if (preview && frame) {
      preview.style.display = "block";
      setTimeout(() => {
        frame.innerHTML = `
          <div class="mockup-content">
            <div style="color: #0f0; font-size: 12px;">┌────────────────────────────┐</div>
            <div style="color: #ff0;">YOUR PROJECT MOCKUP</div>
            <div style="color: #0ff; font-size: 12px;">════════════════════════</div>
            <div style="color: #fff;">[ AI Generated Preview ]</div>
            <div style="color: #0f0;">Status: READY</div>
            <div style="color: #0f0; font-size: 12px;">└────────────────────────────┘</div>
          </div>
        `;
      }, 2000);
    }
  };

  // Sort ideas by votes for top tab
  const topIdeas = [...mockIdeas].sort((a, b) => b.votes - a.votes).slice(0, 5);

  return (
    <>
      <div className="container crt-flicker">
        {/* Header */}
        <div className="header">
          <span className="header-left">◆ {currentPage}</span>
          <span className="header-right">{dateTime}</span>
        </div>

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-text">
            <span className="db-square"></span>
            <span className="logo-db">DB</span>
            <span className="logo-idea">Idea</span>
            <span className="logo-text-sub">Text</span>
          </div>
          <div className="subtitle">Innovation Hub für Deutsche Bank</div>
        </div>

        <div className="mosaic-border"></div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          <button
            className={`nav-item ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => showTab("browse")}
          >
            <span className="nav-label">BROWSE IDEI</span>
            <span className="nav-page">100-199</span>
          </button>
          <button
            className={`nav-item ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => showTab("submit")}
          >
            <span className="nav-label">SUBMIT IDEE</span>
            <span className="nav-page">200</span>
          </button>
          <button
            className={`nav-item ${activeTab === "top" ? "active" : ""}`}
            onClick={() => showTab("top")}
          >
            <span className="nav-label">TOP VOTED</span>
            <span className="nav-page">300</span>
          </button>
          <button
            className={`nav-item ${activeTab === "about" ? "active" : ""}`}
            onClick={() => showTab("about")}
          >
            <span className="nav-label">DESPRE</span>
            <span className="nav-page">900</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.totalIdeas}</span>
            <span className="stat-label">IDEI TOTALE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.inReview}</span>
            <span className="stat-label">ÎN REVIEW</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">APROBATE</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.building}</span>
            <span className="stat-label">ÎN DEZVOLTARE</span>
          </div>
        </div>

        {/* Tab Content: Browse */}
        <div className={`tab-content ${activeTab === "browse" ? "active" : ""}`}>
          <div className="content-section">
            <span className="section-title">★ IDEI RECENTE</span>

            {mockIdeas.map((idea) => (
              <div
                key={idea.id}
                className="idea-item"
                onClick={() => openIdeaModal(idea)}
              >
                <span className="idea-id">#{idea.id}</span>
                <span className="idea-title">{idea.title}</span>
                <span className={`idea-status ${getStatusClass(idea.status)}`}>
                  {getStatusLabel(idea.status)}
                </span>
                <span className="idea-votes">
                  ▲ <span className="vote-count">{idea.votes}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content: Submit */}
        <div className={`tab-content ${activeTab === "submit" ? "active" : ""}`}>
          <div className="content-section submit-section">
            <span className="section-title section-title-alt">✎ SUBMIT IDEE NOUĂ</span>

            <form style={{ marginTop: "15px" }}>
              <div className="form-row">
                <label className="form-label">TITLU IDEE:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Numele proiectului tău..."
                />
              </div>

              <div className="form-row">
                <label className="form-label">DESCRIERE DETALIATĂ:</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Descrie ideea ta în detaliu. AI-ul va genera un mockup bazat pe această descriere..."
                ></textarea>
              </div>

              <div className="form-row">
                <label className="form-label">LINK GITHUB (obligatoriu):</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="form-row">
                <label className="form-label">STADIU PROIECT:</label>
                <select className="form-input">
                  <option>Concept / Idee</option>
                  <option>Prototip</option>
                  <option>În dezvoltare</option>
                  <option>MVP Ready</option>
                  <option>Production Ready</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">CATEGORIE:</label>
                <select className="form-input">
                  <option>Fintech</option>
                  <option>Banking</option>
                  <option>AI/ML</option>
                  <option>UX/UI</option>
                  <option>Security</option>
                  <option>Altele</option>
                </select>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button type="button" className="submit-btn ai-btn" onClick={generateMockup}>
                  🤖 GENEREAZĂ MOCKUP AI
                </button>
                <button type="submit" className="submit-btn">
                  ▶ TRIMITE IDEEA
                </button>
              </div>
            </form>

            <div id="ai-preview" style={{ display: "none", marginTop: "20px" }}>
              <div className="mockup-preview">
                <div className="mockup-label">◄ AI GENEREAZĂ MOCKUP... ►</div>
                <div className="mockup-frame" id="ai-mockup-frame">
                  <div className="loading">
                    <span style={{ color: "var(--teletext-green)" }}>
                      PROCESARE AI<span className="loading-dots"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content: Top Voted */}
        <div className={`tab-content ${activeTab === "top" ? "active" : ""}`}>
          <div className="content-section">
            <span className="section-title section-title-yellow">★ TOP 5 IDEI VOTATE</span>

            {topIdeas.map((idea, index) => {
              const medalClass =
                index === 0
                  ? "idea-item-gold"
                  : index === 1
                  ? "idea-item-silver"
                  : index === 2
                  ? "idea-item-bronze"
                  : "";
              const medal =
                index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
              const medalColorClass =
                index === 0
                  ? "medal-gold"
                  : index === 1
                  ? "medal-silver"
                  : index === 2
                  ? "medal-bronze"
                  : "";

              return (
                <div
                  key={idea.id}
                  className={`idea-item ${medalClass}`}
                  onClick={() => openIdeaModal(idea)}
                >
                  <span className={`idea-id ${medalColorClass}`}>{medal}</span>
                  <span className="idea-title">{idea.title}</span>
                  <span className={`idea-status ${getStatusClass(idea.status)}`}>
                    {getStatusLabel(idea.status)}
                  </span>
                  <span className="idea-votes">
                    ▲{" "}
                    <span className="vote-count" style={{ fontSize: index < 3 ? "24px" : "20px" }}>
                      {idea.votes}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Content: About */}
        <div className={`tab-content ${activeTab === "about" ? "active" : ""}`}>
          <div className="content-section">
            <span className="section-title">ℹ DESPRE DB IDEATEXT</span>

            <div className="about-content">
              <p>
                <span className="about-highlight">DB IdeaText</span> este platforma de
                inovație deschisă a Deutsche Bank, unde dezvoltatorii din întreaga lume
                își pot prezenta ideile folosind estetica retro a serviciului Teletext.
              </p>

              <p style={{ color: "var(--teletext-white)" }}>
                <span className="about-list-item">Descrie ideea ta în detaliu</span>
                <br />
                <span className="about-list-item">
                  AI-ul nostru generează automat un mockup vizual
                </span>
                <br />
                <span className="about-list-item">
                  Atașează link-ul GitHub cu proiectul tău
                </span>
                <br />
                <span className="about-list-item">
                  Comunitatea votează cele mai bune idei
                </span>
                <br />
                <span className="about-list-item">
                  Echipele DB evaluează și adoptă proiecte
                </span>
              </p>

              <p className="about-footer">
                Indiferent dacă ești student, freelancer sau developer pasionat,
                ideile tale pot ajunge pe masa decidenților Deutsche Bank!
              </p>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker">
          <span className="ticker-content">
            ★ ANUNȚ: Hackathon DB IdeaText - 15-17 Dec 2025 ★ Noua idee #247 primește
            rapid voturi! ★ Felicitări @retro.dev pentru ideea aprobată! ★ Deutsche
            Bank caută inovatori - Trimite-ți ideea astăzi! ★
          </span>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="color-btn btn-red" onClick={() => showTab("browse")}>
            ⬤ INDEX
          </button>
          <button className="color-btn btn-green">⬤ VOTE</button>
          <button className="color-btn btn-yellow">⬤ SEARCH</button>
          <button className="color-btn btn-blue" onClick={() => showTab("submit")}>
            ⬤ SUBMIT
          </button>
        </div>

        <div className="mosaic-border"></div>

        <div className="footer">
          © 2025 Deutsche Bank Innovation Lab | Powered by AI | Styled by Nostalgia
        </div>

        {/* Page Indicator */}
        <div className="page-indicator">
          <span className="page-num">{currentPage}</span>
        </div>
      </div>

      {/* Modal Popup for Idea Detail */}
      {selectedIdea && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedIdea.title.split(" - ")[0]}</div>
                <div className="modal-meta">
                  Submis de: {selectedIdea.author} | {selectedIdea.date} | ID: #{selectedIdea.id}
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                ✕ ÎNCHIDE
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: "15px" }}>
                <span className={`idea-status ${getStatusClass(selectedIdea.status)}`}>
                  {getStatusLabel(selectedIdea.status)}
                </span>
                <span style={{ marginLeft: "15px", color: "var(--teletext-green)", fontSize: "22px" }}>
                  ▲ {selectedIdea.votes} voturi
                </span>
              </div>

              <div className="modal-description">{selectedIdea.description}</div>

              <div className="mockup-preview">
                <div className="mockup-label">◄ AI MOCKUP GENERAT ►</div>
                <div className="mockup-frame">
                  <div className="mockup-content">
                    <div style={{ color: "#00ff00", fontSize: "14px" }}>
                      ┌─────────────────────────────────┐
                    </div>
                    <div style={{ color: "#ffff00" }}>
                      {selectedIdea.title.split(" - ")[0].toUpperCase()}
                    </div>
                    <div style={{ color: "#00ffff", fontSize: "14px" }}>
                      ━━━━━━━━━━━━━━━━━━━━━━━━
                    </div>
                    <div style={{ color: "#fff" }}>Status: {getStatusLabel(selectedIdea.status)}</div>
                    <div style={{ color: "#00ff00" }}>Votes: {selectedIdea.votes}</div>
                    <div style={{ color: "#00ff00", fontSize: "14px" }}>
                      └─────────────────────────────────┘
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <a
                  href={selectedIdea.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  ⬡ GitHub Repository
                </a>
                <button className="submit-btn">▲ VOTE</button>
                <button className="submit-btn ai-btn">💬 COMENTEAZĂ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
