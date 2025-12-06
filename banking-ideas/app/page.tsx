"use client";

import { useState, useEffect } from "react";

// Type for an idea
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

// Type for statistics
interface Stats {
  totalIdeas: number;
  inReview: number;
  approved: number;
  building: number;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [currentPage, setCurrentPage] = useState("P100");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [dateTime, setDateTime] = useState("");
  
  // State for database data (initially empty)
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalIdeas: 0,
    inReview: 0,
    approved: 0,
    building: 0,
  });
  const [loading, setLoading] = useState(true);

  // TODO: Fetch ideas from database
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/ideas');
        // const data = await response.json();
        // setIdeas(data.ideas);
        // setStats(data.stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

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
      new: "NEW",
      review: "REVIEW",
      approved: "APPROVED",
      building: "BUILD",
    };
    return labelMap[status] || "NEW";
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
  const topIdeas = [...ideas].sort((a, b) => b.votes - a.votes).slice(0, 5);

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
          <div className="subtitle">Innovation Hub for Deutsche Bank</div>
        </div>

        <div className="mosaic-border"></div>

        {/* Navigation Menu */}
        <div className="nav-menu">
          <button
            className={`nav-item ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => showTab("browse")}
          >
            <span className="nav-label">BROWSE IDEAS</span>
            <span className="nav-page">100-199</span>
          </button>
          <button
            className={`nav-item ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => showTab("submit")}
          >
            <span className="nav-label">SUBMIT IDEA</span>
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
            <span className="nav-label">ABOUT</span>
            <span className="nav-page">900</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.totalIdeas}</span>
            <span className="stat-label">TOTAL IDEAS</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.inReview}</span>
            <span className="stat-label">IN REVIEW</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">APPROVED</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.building}</span>
            <span className="stat-label">IN DEVELOPMENT</span>
          </div>
        </div>

        {/* Tab Content: Browse */}
        <div className={`tab-content ${activeTab === "browse" ? "active" : ""}`}>
          <div className="content-section">
            <span className="section-title">★ RECENT IDEAS</span>

            {loading ? (
              <div className="loading">
                <span style={{ color: "var(--teletext-green)" }}>
                  LOADING<span className="loading-dots"></span>
                </span>
              </div>
            ) : ideas.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--teletext-cyan)" }}>
                <p style={{ fontSize: "24px", marginBottom: "10px" }}>No ideas yet.</p>
                <p style={{ color: "var(--teletext-yellow)" }}>
                  Be the first to add an idea! Click on SUBMIT IDEA.
                </p>
              </div>
            ) : (
              ideas.map((idea) => (
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
              ))
            )}
          </div>
        </div>

        {/* Tab Content: Submit */}
        <div className={`tab-content ${activeTab === "submit" ? "active" : ""}`}>
          <div className="content-section submit-section">
            <span className="section-title section-title-alt">✎ SUBMIT NEW IDEA</span>

            <form style={{ marginTop: "15px" }}>
              {/* SECTION 1: Basic Information */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">1</span>
                  <span className="section-name">BASIC INFORMATION</span>
                </div>
                
                <div className="form-row">
                  <label className="form-label">IDEA TITLE *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., SmartSave - AI-Powered Savings Assistant for Gen Z"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">THE BIG IDEA *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="e.g., An intelligent savings app that analyzes spending patterns and automatically transfers small amounts to savings goals. Uses gamification and social features to make saving money engaging for younger demographics."
                  ></textarea>
                </div>

                <div className="form-row">
                  <label className="form-label">MAIN CATEGORY *</label>
                  <select className="form-input">
                    <option value="">-- Select Category --</option>
                    <option>Digital Banking</option>
                    <option>Payments & Transfers</option>
                    <option>Wealth Management</option>
                    <option>Lending & Credit</option>
                    <option>Insurance</option>
                    <option>Fraud & Security</option>
                    <option>Customer Experience</option>
                    <option>Internal Operations</option>
                    <option>ESG & Sustainability</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">PROBLEM IT SOLVES *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="e.g., Young adults struggle to build savings habits due to lack of engagement with traditional banking tools. 67% of Gen Z report having no emergency fund, and traditional savings accounts feel disconnected from their digital lifestyle."
                  ></textarea>
                </div>
              </div>

              {/* SECTION 2: Preferred Technologies */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">2</span>
                  <span className="section-name">PREFERRED TECHNOLOGIES</span>
                </div>

                <div className="form-row">
                  <label className="form-label">CORE TECHNOLOGIES (select all that apply)</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Artificial Intelligence / ML
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Blockchain / DLT
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Cloud Computing
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Big Data / Analytics
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> IoT / Embedded Systems
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> API / Open Banking
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Biometrics
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> AR / VR
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">SOLUTION TYPE *</label>
                  <select className="form-input">
                    <option value="">-- Select Solution Type --</option>
                    <option>Mobile App (iOS/Android)</option>
                    <option>Web Application</option>
                    <option>Desktop Application</option>
                    <option>API / Backend Service</option>
                    <option>Browser Extension</option>
                    <option>Chatbot / Conversational AI</option>
                    <option>Hardware + Software</option>
                    <option>Platform / Marketplace</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">TECH STACK DETAILS (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., React Native, Node.js, PostgreSQL, TensorFlow, AWS Lambda"
                  />
                </div>
              </div>

              {/* SECTION 3: Context */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">3</span>
                  <span className="section-name">BUSINESS CONTEXT</span>
                </div>

                <div className="form-row">
                  <label className="form-label">TARGET SEGMENT *</label>
                  <select className="form-input">
                    <option value="">-- Select Target Segment --</option>
                    <option>Retail Banking - Gen Z (18-25)</option>
                    <option>Retail Banking - Millennials (26-41)</option>
                    <option>Retail Banking - Gen X (42-57)</option>
                    <option>Retail Banking - Seniors (58+)</option>
                    <option>Small Business / SME</option>
                    <option>Corporate Clients</option>
                    <option>High Net Worth Individuals</option>
                    <option>Internal - Bank Employees</option>
                    <option>B2B - Other Financial Institutions</option>
                    <option>Universal / All Segments</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">MONETIZATION MODEL</label>
                  <select className="form-input">
                    <option value="">-- Select Monetization Model --</option>
                    <option>Subscription (Monthly/Annual)</option>
                    <option>Transaction Fees</option>
                    <option>Freemium (Basic Free + Premium)</option>
                    <option>One-time Purchase</option>
                    <option>Commission Based</option>
                    <option>Advertising Supported</option>
                    <option>Cost Savings (Internal Tool)</option>
                    <option>Data Monetization</option>
                    <option>White Label / Licensing</option>
                    <option>Not Applicable / TBD</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">ESTIMATED MARKET SIZE (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., €2.5B European digital savings market, growing 15% YoY"
                  />
                </div>
              </div>

              {/* SECTION 4: Regulations */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">4</span>
                  <span className="section-name">REGULATORY CONSIDERATIONS</span>
                </div>

                <div className="form-row">
                  <label className="form-label">APPLICABLE REGULATIONS (select all that apply)</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" /> GDPR (Data Protection)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> PSD2 / Open Banking
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> MiFID II (Investment Services)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> AML / KYC Requirements
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Basel III / IV
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> DORA (Digital Operational Resilience)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> AI Act (EU)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Not Sure / Need Guidance
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">COMPLIANCE NOTES (optional)</label>
                  <textarea
                    className="form-input form-textarea-small"
                    placeholder="e.g., We've designed with privacy-by-default. All user data is encrypted and stored in EU data centers. We need guidance on cross-border data transfers."
                  ></textarea>
                </div>
              </div>

              {/* SECTION 5: Differentiators */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">5</span>
                  <span className="section-name">DIFFERENTIATORS & IMPLEMENTATION</span>
                </div>

                <div className="form-row">
                  <label className="form-label">WHAT MAKES THIS UNIQUE? *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="e.g., Unlike existing apps, we use behavioral psychology and social proof to create 'savings challenges' with friends. Our AI predicts the optimal micro-transfer amount based on upcoming expenses, ensuring users never overdraft."
                  ></textarea>
                </div>

                <div className="form-row">
                  <label className="form-label">CURRENT IMPLEMENTATION LEVEL *</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Frontend UI/UX
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Backend / API
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Database Schema
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Authentication / Security
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> AI/ML Models
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Third-party Integrations
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Testing / QA
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Documentation
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">PROJECT STAGE *</label>
                  <select className="form-input">
                    <option value="">-- Select Stage --</option>
                    <option>Proof of Concept (PoC)</option>
                    <option>Working Prototype</option>
                    <option>Alpha Version</option>
                    <option>Beta Version</option>
                    <option>MVP Ready</option>
                    <option>Production Ready</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label">GITHUB REPOSITORY LINK *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://github.com/your-username/your-project"
                  />
                  <span className="form-hint">⚠ Required: Must have at least a basic implementation</span>
                </div>

                <div className="form-row">
                  <label className="form-label">MARKET RESEARCH / COMPETITOR ANALYSIS</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="e.g., Analyzed: Acorns (US - $3B valuation, lacks social features), Plum (UK - AI-based but limited personalization), Revolut Vaults (no gamification). Our edge: Social challenges + predictive AI + DB's trust factor."
                  ></textarea>
                </div>
              </div>

              {/* SECTION 6: Other Details */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-number">6</span>
                  <span className="section-name">OTHER DETAILS</span>
                </div>

                <div className="form-row">
                  <label className="form-label">TEAM COMPOSITION (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 2 Full-stack devs, 1 ML engineer, 1 UX designer"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">DEMO VIDEO / PRESENTATION LINK (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://youtube.com/watch?v=... or https://docs.google.com/presentation/..."
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">WHAT DO YOU NEED FROM DB? (optional)</label>
                  <textarea
                    className="form-input form-textarea-small"
                    placeholder="e.g., Access to sandbox API for account data, mentorship from product team, regulatory guidance, potential pilot with 1000 users"
                  ></textarea>
                </div>

                <div className="form-row">
                  <label className="form-label">ADDITIONAL NOTES</label>
                  <textarea
                    className="form-input form-textarea-small"
                    placeholder="Any other information you'd like to share about your idea..."
                  ></textarea>
                </div>
              </div>

              <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "2px dashed var(--teletext-cyan)" }}>
                <button type="button" className="submit-btn ai-btn" onClick={generateMockup}>
                  🤖 GENERATE AI MOCKUP
                </button>
                <button type="submit" className="submit-btn">
                  ▶ SUBMIT IDEA
                </button>
              </div>
            </form>

            <div id="ai-preview" style={{ display: "none", marginTop: "20px" }}>
              <div className="mockup-preview">
                <div className="mockup-label">◄ AI GENERATING MOCKUP... ►</div>
                <div className="mockup-frame" id="ai-mockup-frame">
                  <div className="loading">
                    <span style={{ color: "var(--teletext-green)" }}>
                      AI PROCESSING<span className="loading-dots"></span>
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
            <span className="section-title section-title-yellow">★ TOP 5 VOTED IDEAS</span>

            {loading ? (
              <div className="loading">
                <span style={{ color: "var(--teletext-green)" }}>
                  LOADING<span className="loading-dots"></span>
                </span>
              </div>
            ) : topIdeas.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--teletext-cyan)" }}>
                <p style={{ fontSize: "24px", marginBottom: "10px" }}>No voted ideas yet.</p>
                <p style={{ color: "var(--teletext-yellow)" }}>
                  Add the first idea and get votes from the community!
                </p>
              </div>
            ) : (
              topIdeas.map((idea, index) => {
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
              })
            )}
          </div>
        </div>

        {/* Tab Content: About */}
        <div className={`tab-content ${activeTab === "about" ? "active" : ""}`}>
          <div className="content-section">
            <span className="section-title">ℹ ABOUT DB IDEATEXT</span>

            <div className="about-content">
              <p>
                <span className="about-highlight">DB IdeaText</span> is Deutsche Bank&apos;s 
                open innovation platform, where developers from around the world can 
                present their ideas using the retro aesthetics of the Teletext service.
              </p>

              <p style={{ color: "var(--teletext-white)" }}>
                <span className="about-list-item">Describe your idea in detail</span>
                <br />
                <span className="about-list-item">
                  Our AI automatically generates a visual mockup
                </span>
                <br />
                <span className="about-list-item">
                  Attach your GitHub link with your project
                </span>
                <br />
                <span className="about-list-item">
                  The community votes for the best ideas
                </span>
                <br />
                <span className="about-list-item">
                  DB teams evaluate and adopt projects
                </span>
              </p>

              <p className="about-footer">
                Whether you&apos;re a student, freelancer or passionate developer,
                your ideas can reach Deutsche Bank decision makers!
              </p>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker">
          <span className="ticker-content">
            ★ Welcome to DB IdeaText! ★ Innovation platform for Deutsche Bank ★ 
            Add your idea and get feedback from the community! ★ 
            Use retro Teletext aesthetics to present your project! ★
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
                  Submitted by: {selectedIdea.author} | {selectedIdea.date} | ID: #{selectedIdea.id}
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                ✕ CLOSE
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: "15px" }}>
                <span className={`idea-status ${getStatusClass(selectedIdea.status)}`}>
                  {getStatusLabel(selectedIdea.status)}
                </span>
                <span style={{ marginLeft: "15px", color: "var(--teletext-green)", fontSize: "22px" }}>
                  ▲ {selectedIdea.votes} votes
                </span>
              </div>

              <div className="modal-description">{selectedIdea.description}</div>

              <div className="mockup-preview">
                <div className="mockup-label">◄ AI GENERATED MOCKUP ►</div>
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
                <button className="submit-btn ai-btn">💬 COMMENT</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
