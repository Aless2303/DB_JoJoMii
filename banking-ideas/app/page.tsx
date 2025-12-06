"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

// Types
interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  status: string;
  likes: number;
  dislikes: number;
  userId: string;
  githubLink: string;
  createdAt: string;
  userName?: string;
}

interface Stats {
  totalIdeas: number;
  new: number;
  inReview: number;
  approved: number;
  building: number;
  completed: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

type AuthMode = "login" | "register";

export default function HomePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState("browse");
  const [currentPage, setCurrentPage] = useState("P100");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [dateTime, setDateTime] = useState("");
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // Data state
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalIdeas: 0,
    new: 0,
    inReview: 0,
    approved: 0,
    building: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Admin state
  const [users, setUsers] = useState<User[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // User role helper
  const userRole = session?.user?.role || "guest";
  const isLoggedIn = !!session?.user;
  const isAdmin = userRole === "admin";

  // Fetch ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas');
        if (response.ok) {
          const data = await response.json();
          setIdeas(data.ideas || []);
          // Calculate stats
          const ideasList = data.ideas || [];
          setStats({
            totalIdeas: ideasList.length,
            new: ideasList.filter((i: Idea) => i.status === "new").length,
            inReview: ideasList.filter((i: Idea) => i.status === "review").length,
            approved: ideasList.filter((i: Idea) => i.status === "approved").length,
            building: ideasList.filter((i: Idea) => i.status === "build").length,
            completed: ideasList.filter((i: Idea) => i.status === "completed").length,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  // Fetch users for admin
  useEffect(() => {
    if (isAdmin && activeTab === "admin") {
      fetchUsers();
    }
  }, [isAdmin, activeTab]);

  const fetchUsers = async () => {
    setAdminLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setAdminLoading(false);
  };

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
      if (e.key === "Escape") {
        if (selectedIdea) setSelectedIdea(null);
        if (showAuthModal) setShowAuthModal(false);
        return;
      }
      
      const key = e.key;
      if (key >= "1" && key <= "5" && !selectedIdea && !showAuthModal) {
        const tabs = ["browse", "submit", "top", "about", "admin"];
        const tabIndex = parseInt(key) - 1;
        if (tabs[tabIndex] && (tabIndex !== 4 || isAdmin)) {
          showTab(tabs[tabIndex]);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdea, showAuthModal, isAdmin]);

  const showTab = (tabName: string) => {
    if (tabName === "submit" && !isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (tabName === "admin" && !isAdmin) {
      return;
    }
    setActiveTab(tabName);
    const pageMap: Record<string, string> = {
      browse: "P100",
      submit: "P200",
      top: "P300",
      about: "P900",
      admin: "P999",
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
      build: "status-building",
      completed: "status-completed",
    };
    return statusMap[status] || "status-new";
  };

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      new: "NEW",
      review: "REVIEW",
      approved: "APPROVED",
      build: "BUILD",
      completed: "COMPLETED",
    };
    return labelMap[status] || "NEW";
  };

  // Auth handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: authEmail,
        password: authPassword,
        action: authMode,
        name: authName,
      });

      if (result?.error) {
        setAuthError(result.error);
      } else {
        setShowAuthModal(false);
        setAuthEmail("");
        setAuthPassword("");
        setAuthName("");
      }
    } catch (error) {
      setAuthError("An error occurred. Please try again.");
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    signOut({ redirect: false });
  };

  // Admin handlers
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateIdeaStatus = async (ideaId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/ideas/${ideaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Refresh ideas
        const ideasResponse = await fetch('/api/ideas');
        if (ideasResponse.ok) {
          const data = await ideasResponse.json();
          setIdeas(data.ideas || []);
        }
      }
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      const response = await fetch(`/api/admin/ideas/${ideaId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSelectedIdea(null);
        // Refresh ideas
        const ideasResponse = await fetch('/api/ideas');
        if (ideasResponse.ok) {
          const data = await ideasResponse.json();
          setIdeas(data.ideas || []);
        }
      }
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  // Vote handler
  const handleVote = async (ideaId: string, voteType: "like" | "dislike") => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    try {
      const response = await fetch('/api/vote', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, voteType }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update idea in state
        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, likes: data.likes, dislikes: data.dislikes }
            : idea
        ));
        if (selectedIdea?.id === ideaId) {
          setSelectedIdea(prev => prev ? { ...prev, likes: data.likes, dislikes: data.dislikes } : null);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
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
  const topIdeas = [...ideas].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)).slice(0, 5);

  return (
    <>
      <div className="container crt-flicker">
        {/* Header */}
        <div className="header">
          <span className="header-left">◆ {currentPage}</span>
          <div className="auth-buttons">
            {sessionStatus === "loading" ? (
              <span style={{ color: "var(--teletext-cyan)" }}>Loading...</span>
            ) : isLoggedIn ? (
              <div className="user-info">
                <span>◆ {session.user.name}</span>
                <span className={`user-role ${userRole}`}>{userRole.toUpperCase()}</span>
                <button className="auth-btn logout" onClick={handleLogout}>
                  LOGOUT
                </button>
              </div>
            ) : (
              <>
                <button className="auth-btn login" onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}>
                  ► LOGIN
                </button>
                <button className="auth-btn register" onClick={() => { setAuthMode("register"); setShowAuthModal(true); }}>
                  ✎ REGISTER
                </button>
              </>
            )}
          </div>
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
            title={!isLoggedIn ? "Login required to submit ideas" : ""}
          >
            <span className="nav-label">SUBMIT IDEA {!isLoggedIn && "🔒"}</span>
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
          {isAdmin && (
            <button
              className={`nav-item ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => showTab("admin")}
              style={{ borderColor: "var(--teletext-magenta)" }}
            >
              <span className="nav-label" style={{ color: "var(--teletext-magenta)" }}>★ ADMIN</span>
              <span className="nav-page">999</span>
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.totalIdeas}</span>
            <span className="stat-label">TOTAL IDEAS</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.new}</span>
            <span className="stat-label">NEW</span>
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
            <span className="stat-label">BUILDING</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">COMPLETED</span>
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
                  <span className="idea-id">#{idea.id.slice(0, 6)}</span>
                  <span className="idea-title">{idea.title}</span>
                  <span className={`idea-status ${getStatusClass(idea.status)}`}>
                    {getStatusLabel(idea.status)}
                  </span>
                  <span className="idea-votes">
                    <span style={{ color: "var(--teletext-green)" }}>▲{idea.likes}</span>
                    {" / "}
                    <span style={{ color: "var(--teletext-red)" }}>▼{idea.dislikes}</span>
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

            {!isLoggedIn ? (
              <div className="guest-message">
                <p>🔒 You must be logged in to submit ideas.</p>
                <p>
                  <a onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}>Login</a> or{" "}
                  <a onClick={() => { setAuthMode("register"); setShowAuthModal(true); }}>Register</a> to continue.
                </p>
              </div>
            ) : (
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
            )}

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
                      <span style={{ color: "var(--teletext-green)" }}>▲{idea.likes}</span>
                      {" / "}
                      <span style={{ color: "var(--teletext-red)" }}>▼{idea.dislikes}</span>
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

              <p style={{ color: "var(--teletext-white)", marginTop: "20px" }}>
                <span className="about-list-item">◆ Describe your idea in detail</span>
                <br />
                <span className="about-list-item">◆ Our AI automatically generates a visual mockup</span>
                <br />
                <span className="about-list-item">◆ Attach your GitHub link with your project</span>
                <br />
                <span className="about-list-item">◆ The community votes for the best ideas (like/dislike)</span>
                <br />
                <span className="about-list-item">◆ DB teams evaluate and adopt projects</span>
              </p>

              <div style={{ marginTop: "25px", padding: "15px", background: "rgba(0,0,50,0.5)", border: "2px solid var(--teletext-cyan)" }}>
                <p style={{ color: "var(--teletext-yellow)", marginBottom: "10px" }}>★ IDEA STATUS FLOW:</p>
                <p style={{ color: "var(--teletext-white)", fontSize: "18px" }}>
                  <span style={{ color: "var(--teletext-green)" }}>NEW</span> → 
                  <span style={{ color: "var(--teletext-yellow)" }}> REVIEW</span> → 
                  <span style={{ color: "var(--teletext-cyan)" }}> APPROVED</span> → 
                  <span style={{ color: "var(--teletext-red)" }}> BUILD</span> → 
                  <span style={{ color: "var(--teletext-magenta)" }}> COMPLETED</span>
                </p>
              </div>

              <div style={{ marginTop: "25px", padding: "15px", background: "rgba(0,0,50,0.5)", border: "2px solid var(--teletext-yellow)" }}>
                <p style={{ color: "var(--teletext-yellow)", marginBottom: "10px" }}>★ USER ROLES:</p>
                <p style={{ color: "var(--teletext-cyan)", fontSize: "18px" }}>
                  <strong>GUEST:</strong> Browse ideas, view GitHub links
                </p>
                <p style={{ color: "var(--teletext-green)", fontSize: "18px" }}>
                  <strong>USER:</strong> + Submit ideas, vote, comment
                </p>
                <p style={{ color: "var(--teletext-magenta)", fontSize: "18px" }}>
                  <strong>ADMIN:</strong> + Manage users & ideas, change statuses
                </p>
              </div>

              <p className="about-footer" style={{ marginTop: "25px" }}>
                Whether you&apos;re a student, freelancer or passionate developer,
                your ideas can reach Deutsche Bank decision makers!
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content: Admin (Admin only) */}
        {isAdmin && (
          <div className={`tab-content ${activeTab === "admin" ? "active" : ""}`}>
            <div className="content-section">
              <span className="section-title" style={{ color: "var(--teletext-magenta)" }}>★ ADMIN PANEL</span>

              {/* User Management */}
              <div className="admin-section">
                <div className="admin-section-title">◆ USER MANAGEMENT</div>
                {adminLoading ? (
                  <div className="loading">Loading users...</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ROLE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              className="status-select"
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            >
                              <option value="user">USER</option>
                              <option value="admin">ADMIN</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="admin-action-btn delete"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === session?.user?.id}
                            >
                              DELETE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Idea Management */}
              <div className="admin-section">
                <div className="admin-section-title">◆ IDEA MANAGEMENT</div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>TITLE</th>
                      <th>STATUS</th>
                      <th>VOTES</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map((idea) => (
                      <tr key={idea.id}>
                        <td>{idea.title}</td>
                        <td>
                          <select
                            className="status-select"
                            value={idea.status}
                            onChange={(e) => handleUpdateIdeaStatus(idea.id, e.target.value)}
                          >
                            <option value="new">NEW</option>
                            <option value="review">REVIEW</option>
                            <option value="approved">APPROVED</option>
                            <option value="build">BUILD</option>
                            <option value="completed">COMPLETED</option>
                          </select>
                        </td>
                        <td>
                          <span style={{ color: "var(--teletext-green)" }}>▲{idea.likes}</span>
                          {" / "}
                          <span style={{ color: "var(--teletext-red)" }}>▼{idea.dislikes}</span>
                        </td>
                        <td>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDeleteIdea(idea.id)}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Ticker */}
        <div className="ticker">
          <span className="ticker-content">
            ★ Welcome to DB IdeaText! ★ Innovation platform for Deutsche Bank ★ 
            {isLoggedIn ? `Logged in as ${session.user.name} (${userRole})` : "Login to submit ideas and vote!"} ★ 
            Use retro Teletext aesthetics to present your project! ★
          </span>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="color-btn btn-red" onClick={() => showTab("browse")}>
            ⬤ INDEX
          </button>
          <button className="color-btn btn-green" disabled={!isLoggedIn} title={!isLoggedIn ? "Login to vote" : ""}>
            ⬤ VOTE
          </button>
          <button className="color-btn btn-yellow">⬤ SEARCH</button>
          <button className="color-btn btn-blue" onClick={() => showTab("submit")}>
            ⬤ SUBMIT
          </button>
        </div>

        <div className="mosaic-border"></div>

        <div className="footer">
          © 2025 Deutsche Bank Innovation Lab | Powered by AI | Styled by Nostalgia
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <span className="auth-modal-title">
                {authMode === "login" ? "► LOGIN" : "✎ REGISTER"}
              </span>
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>
                ✕
              </button>
            </div>
            <div className="auth-modal-body">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${authMode === "login" ? "active" : ""}`}
                  onClick={() => { setAuthMode("login"); setAuthError(""); }}
                >
                  LOGIN
                </button>
                <button
                  className={`auth-tab ${authMode === "register" ? "active" : ""}`}
                  onClick={() => { setAuthMode("register"); setAuthError(""); }}
                >
                  REGISTER
                </button>
              </div>

              {authError && <div className="auth-error">{authError}</div>}

              <form className="auth-form" onSubmit={handleAuth}>
                {authMode === "register" && (
                  <div className="form-row">
                    <label className="form-label">NAME</label>
                    <input
                      type="text"
                      className="form-input"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>
                )}
                <div className="form-row">
                  <label className="form-label">EMAIL *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="form-row">
                  <label className="form-label">PASSWORD *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={authLoading}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  {authLoading ? "PROCESSING..." : authMode === "login" ? "► LOGIN" : "✎ CREATE ACCOUNT"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Idea Detail */}
      {selectedIdea && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedIdea.title}</div>
                <div className="modal-meta">
                  Submitted by: {selectedIdea.userName || "Anonymous"} | ID: #{selectedIdea.id.slice(0, 8)}
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                ✕ CLOSE
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "20px" }}>
                <span className={`idea-status ${getStatusClass(selectedIdea.status)}`}>
                  {getStatusLabel(selectedIdea.status)}
                </span>
                <div className="vote-buttons">
                  <button
                    className={`vote-btn like`}
                    onClick={() => handleVote(selectedIdea.id, "like")}
                    disabled={!isLoggedIn}
                    title={!isLoggedIn ? "Login to vote" : "Like this idea"}
                  >
                    ▲ LIKE <span>{selectedIdea.likes}</span>
                  </button>
                  <button
                    className={`vote-btn dislike`}
                    onClick={() => handleVote(selectedIdea.id, "dislike")}
                    disabled={!isLoggedIn}
                    title={!isLoggedIn ? "Login to vote" : "Dislike this idea"}
                  >
                    ▼ DISLIKE <span>{selectedIdea.dislikes}</span>
                  </button>
                </div>
              </div>

              {!isLoggedIn && (
                <div className="guest-message" style={{ marginBottom: "15px" }}>
                  <a onClick={() => { closeModal(); setShowAuthModal(true); }}>Login</a> to vote and comment on ideas.
                </div>
              )}

              <div className="modal-description">{selectedIdea.shortDescription}</div>

              <div className="modal-actions">
                <a
                  href={selectedIdea.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  ⬡ GitHub Repository
                </a>
                {isLoggedIn && (
                  <button className="submit-btn ai-btn">💬 COMMENT</button>
                )}
                {isAdmin && (
                  <>
                    <select
                      className="status-select"
                      value={selectedIdea.status}
                      onChange={(e) => handleUpdateIdeaStatus(selectedIdea.id, e.target.value)}
                      style={{ marginLeft: "auto" }}
                    >
                      <option value="new">NEW</option>
                      <option value="review">REVIEW</option>
                      <option value="approved">APPROVED</option>
                      <option value="build">BUILD</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDeleteIdea(selectedIdea.id)}
                    >
                      DELETE IDEA
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
