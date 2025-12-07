"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

// --- BOOT LOADER COMPONENT ---
function TeletextBootLoader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const BOOT_SEQUENCE = [
    "╔══════════════════════════════════════════════════╗",
    "║         D B   I D E A T E X T   v 2 . 0          ║",
    "║      DEUTSCHE BANK INNOVATION HUB  -  2025       ║",
    "╚══════════════════════════════════════════════════╝",
    "",
    "BOOT SEQUENCE INITIATED...",
    "",
    "LOADING CORE MODULES..................[ OK ]",
    "CONNECTING TO POSTGRESQL DB...........[ OK ]",
    "INITIALIZING NEXT.JS 14 SERVER........[ OK ]",
    "MOUNTING DRIZZLE ORM..................[ OK ]",
    "LOADING AI EVALUATION PIPELINE........[ OK ]",
    "  → VALIDATOR AGENT...................[ OK ]",
    "  → BASIC INFO ANALYZER...............[ OK ]",
    "  → TECHNOLOGY ANALYZER...............[ OK ]",
    "  → BUSINESS ANALYZER.................[ OK ]",
    "  → REGULATIONS ANALYZER..............[ OK ]",
    "  → DIFFERENTIATORS ANALYZER..........[ OK ]",
    "  → STATISTICIAN AGENT................[ OK ]",
    "  → HTML BUILDER AGENT................[ OK ]",
    "  → VISUAL DESIGNER AGENT.............[ OK ]",
    "AUTHENTICATING NEXTAUTH SESSION.......[ OK ]",
    "LOADING TELETEXT CSS ENGINE...........[ OK ]",
    "INITIALIZING CRT VISUAL EFFECTS.......[ OK ]",
    "",
    "════════════════════════════════════════════════════",
    "ALL 11 AI AGENTS OPERATIONAL",
    "SYSTEM READY - WELCOME TO DB IDEATEXT",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentIndex = 0;
    let currentProgress = 0;
    
    // Smooth progress animation function
    const animateProgress = (from: number, to: number, duration: number, onDone?: () => void) => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        // Ease out for smooth feeling
        const eased = 1 - Math.pow(1 - t, 3);
        currentProgress = from + (to - from) * eased;
        setProgress(Math.round(currentProgress));
        
        if (t < 1) {
          requestAnimationFrame(animate);
        } else if (onDone) {
          onDone();
        }
      };
      requestAnimationFrame(animate);
    };
    
    // Phase 1: Show lines and progress quickly to 60%
    const interval = setInterval(() => {
      if (currentIndex >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        
        // Brief pause at 60%
        setTimeout(() => {
          // Phase 2: Slow smooth crawl from 60% to 75% over 2.5 seconds
          animateProgress(60, 75, 2500, () => {
            // Phase 3: Quick smooth finish to 100%
            animateProgress(75, 100, 400, () => {
              setTimeout(onComplete, 300);
            });
          });
        }, 200);
        
        return;
      }
      
      setLines(prev => [...prev, BOOT_SEQUENCE[currentIndex]]);
      // Progress goes to 60% during text display
      const targetProgress = Math.min(60, Math.round(((currentIndex + 1) / BOOT_SEQUENCE.length) * 60));
      setProgress(targetProgress);
      currentIndex++;
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        fontFamily: "'VT323', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "40px",
      }}
    >
      {/* Boot log */}
      <div 
        ref={scrollRef}
        style={{
          height: "350px",
          overflow: "hidden",
          marginBottom: "40px",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#a3a3a3",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ marginBottom: "2px" }}>
            <span style={{ color: "#525252", marginRight: "12px" }}>
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <span style={{ 
              color: (line || "").includes("OK") || (line || "").includes("GRANTED") || (line || "").includes("READY")
                ? "#22c55e" 
                : (line || "").includes("→")
                  ? "#60a5fa"
                  : (line || "").includes("═") || (line || "").includes("╔") || (line || "").includes("╚") || (line || "").includes("║")
                    ? "#facc15"
                    : "#a3a3a3" 
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Progress percentage */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "8px",
        fontSize: "14px",
        color: "#a3a3a3",
      }}>
        <span style={{ color: progress >= 100 ? "#22c55e" : "#fff" }}>
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: "4px",
        width: "100%",
        background: "#171717",
      }}>
        <div 
          style={{
            height: "100%",
            width: `${progress}%`,
            background: progress >= 100 ? "#22c55e" : "#fff",
            transition: "width 0.1s ease-out",
          }}
        />
      </div>
    </div>
  );
}

// --- AI PIPELINE OVERLAY COMPONENT ---
interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: "waiting" | "running" | "completed" | "error";
  icon: string;
}

interface AIPipelineOverlayProps {
  isVisible: boolean;
  steps: PipelineStep[];
  logs: string[];
  progress: number;
  statusText: string;
}

function AIPipelineOverlay({ isVisible, steps, logs, progress, statusText }: AIPipelineOverlayProps) {
  const logsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(0, 0, 30, 0.98)",
      fontFamily: "'VT323', monospace",
      display: "flex",
      flexDirection: "column",
      padding: "30px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "20px",
        borderBottom: "2px solid #00FFFF",
        paddingBottom: "15px",
      }}>
        <div style={{ color: "#FFFF00", fontSize: "28px", fontWeight: "bold", letterSpacing: "4px" }}>
          🤖 AI EVALUATION PIPELINE
        </div>
        <div style={{ color: "#00FFFF", fontSize: "16px", marginTop: "5px" }}>
          Processing your innovation idea...
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, gap: "20px", minHeight: 0 }}>
        {/* Left: Pipeline visualization */}
        <div style={{
          flex: "0 0 400px",
          background: "rgba(0, 0, 0, 0.5)",
          border: "2px solid #333",
          borderRadius: "8px",
          padding: "15px",
          overflowY: "auto",
        }}>
          <div style={{ color: "#888", fontSize: "14px", marginBottom: "15px", letterSpacing: "2px" }}>
            PIPELINE STAGES ({steps.filter(s => s.status === "completed").length}/{steps.length})
          </div>
          {steps.map((step, index) => (
            <div 
              key={step.id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                marginBottom: "6px",
                background: step.status === "running" ? "rgba(0, 255, 255, 0.1)" : 
                           step.status === "completed" ? "rgba(0, 255, 0, 0.05)" : "transparent",
                border: step.status === "running" ? "2px solid #00FFFF" : 
                       step.status === "completed" ? "1px solid #00FF00" : "1px solid #333",
                borderRadius: "6px",
                transition: "all 0.3s ease",
              }}
            >
              {/* Status indicator */}
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
                background: step.status === "completed" ? "#00FF00" : 
                           step.status === "running" ? "#00FFFF" : 
                           step.status === "error" ? "#FF0000" : "#333",
                color: step.status === "waiting" ? "#666" : "#000",
                animation: step.status === "running" ? "pulse 1s infinite" : "none",
              }}>
                {step.status === "completed" ? "✓" : 
                 step.status === "running" ? "⟳" : 
                 step.status === "error" ? "✗" : step.icon}
              </div>
              
              {/* Step info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: step.status === "completed" ? "#00FF00" : 
                         step.status === "running" ? "#00FFFF" : 
                         step.status === "error" ? "#FF0000" : "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {step.name}
                </div>
                <div style={{
                  color: step.status === "running" ? "#888" : "#444",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Logs */}
        <div style={{
          flex: 1,
          background: "rgba(0, 0, 0, 0.7)",
          border: "2px solid #333",
          borderRadius: "8px",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ color: "#888", fontSize: "14px", marginBottom: "10px", letterSpacing: "2px" }}>
            LIVE LOGS
          </div>
          <div 
            ref={logsRef}
            style={{
              flex: 1,
              overflowY: "auto",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            {logs.map((log, i) => (
              <div key={i} style={{
                color: log.includes("✓") || log.includes("✅") ? "#00FF00" : 
                       log.includes("▶") ? "#00FFFF" :
                       log.includes("→") ? "#60a5fa" :
                       log.includes("🚀") || log.includes("🎉") ? "#FFFF00" :
                       log.includes("❌") ? "#FF6666" : "#888",
                marginBottom: "4px",
              }}>
                {log}
              </div>
            ))}
            <span style={{ color: "#00FFFF", animation: "blink 1s infinite" }}>█</span>
          </div>
        </div>
      </div>

      {/* Bottom: Progress */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        background: "rgba(0, 0, 0, 0.5)",
        border: "2px solid #333",
        borderRadius: "8px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "16px",
        }}>
          <span style={{ color: progress >= 100 ? "#00FF00" : "#888" }}>{statusText}</span>
          <span style={{ color: progress >= 100 ? "#00FF00" : "#00FFFF" }}>{progress}%</span>
        </div>
        <div style={{
          height: "8px",
          background: "#1a1a1a",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: progress >= 100 
              ? "linear-gradient(90deg, #00FF00, #00FF88)" 
              : "linear-gradient(90deg, #00FFFF, #0088FF)",
            borderRadius: "4px",
            transition: "width 0.3s ease-out",
            boxShadow: progress >= 100 
              ? "0 0 10px #00FF00" 
              : "0 0 10px #00FFFF",
          }} />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

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
  // AI Generated fields
  generatedHtml?: string | null;
  generatedPages?: string | null;
  aiScore?: number | null;
  aiAnalysis?: string | null;
  aiRecommendation?: string | null;
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
  
  // Boot loader state
  const [booting, setBooting] = useState(true);
  
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

  // Comments state
  interface Comment {
    id: string;
    ideaId: string;
    userId: string;
    content: string;
    createdAt: string;
    userName: string | null;
    userEmail: string | null;
  }
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Submit form state
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "",
    problemSolved: "",
    technologies: [] as string[],
    solutionType: "",
    techStackDetails: "",
    targetSegment: "",
    monetizationModel: "",
    marketSize: "",
    regulations: [] as string[],
    complianceNotes: "",
    uniqueValue: "",
    implementationLevel: [] as string[],
    projectStage: "",
    githubLink: "",
    competitors: "",
    team: "",
    demoLink: "",
    needFromDB: "",
    additionalNotes: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // AI Pipeline overlay state
  const [showPipelineOverlay, setShowPipelineOverlay] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState("");

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
    setShowComments(false);
    setComments([]);
    setNewComment("");
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

  // Comments handlers
  const fetchComments = async (ideaId: string) => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/comments?ideaId=${ideaId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setCommentsLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedIdea) return;
    
    setCommentSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ideaId: selectedIdea.id, 
          content: newComment.trim() 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data]);
        setNewComment("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
    setCommentSubmitting(false);
  };

  const toggleComments = () => {
    if (!showComments && selectedIdea) {
      fetchComments(selectedIdea.id);
    }
    setShowComments(!showComments);
  };

  // Form handlers
  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      category: "",
      problemSolved: "",
      technologies: [],
      solutionType: "",
      techStackDetails: "",
      targetSegment: "",
      monetizationModel: "",
      marketSize: "",
      regulations: [],
      complianceNotes: "",
      uniqueValue: "",
      implementationLevel: [],
      projectStage: "",
      githubLink: "",
      competitors: "",
      team: "",
      demoLink: "",
      needFromDB: "",
      additionalNotes: "",
    });
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitLoading(true);

    // Validate required fields
    if (!formData.title.trim()) {
      setSubmitError("Please enter an idea title");
      setSubmitLoading(false);
      return;
    }
    if (!formData.shortDescription.trim()) {
      setSubmitError("Please enter a description (The Big Idea)");
      setSubmitLoading(false);
      return;
    }
    if (!formData.category) {
      setSubmitError("Please select a category");
      setSubmitLoading(false);
      return;
    }
    if (!formData.problemSolved.trim()) {
      setSubmitError("Please describe the problem it solves");
      setSubmitLoading(false);
      return;
    }

    // Initialize pipeline overlay
    const initialSteps: PipelineStep[] = [
      { id: "input", name: "DATA INPUT", description: "Receiving idea data", icon: "📥", status: "waiting" },
      { id: "validator", name: "VALIDATOR", description: "Validating & normalizing input", icon: "✓", status: "waiting" },
      { id: "basic", name: "BASIC INFO ANALYZER", description: "Analyzing core idea details", icon: "📋", status: "waiting" },
      { id: "tech", name: "TECH ANALYZER", description: "Evaluating technology stack", icon: "⚙️", status: "waiting" },
      { id: "business", name: "BUSINESS ANALYZER", description: "Assessing business viability", icon: "💼", status: "waiting" },
      { id: "regulations", name: "REGULATIONS ANALYZER", description: "Checking compliance requirements", icon: "📜", status: "waiting" },
      { id: "differentiators", name: "DIFFERENTIATORS ANALYZER", description: "Finding unique value props", icon: "⭐", status: "waiting" },
      { id: "other", name: "OTHER DETAILS ANALYZER", description: "Processing additional info", icon: "📝", status: "waiting" },
      { id: "ascii", name: "ASCII ARTIST", description: "Generating visual representation", icon: "🎨", status: "waiting" },
      { id: "aggregator", name: "AGGREGATOR", description: "Combining all analyses", icon: "🔗", status: "waiting" },
      { id: "html", name: "HTML BUILDER", description: "Building presentation", icon: "🏗️", status: "waiting" },
      { id: "stats", name: "STATISTICIAN", description: "Calculating final scores", icon: "📊", status: "waiting" },
      { id: "visual", name: "VISUAL DESIGNER", description: "Applying final design", icon: "✨", status: "waiting" },
    ];

    setPipelineSteps(initialSteps);
    setPipelineLogs([`[${new Date().toISOString().split('T')[1].split('.')[0]}] 🚀 Starting AI Pipeline...`]);
    setPipelineProgress(0);
    setPipelineStatus("Initializing AI agents...");
    setShowPipelineOverlay(true);

    // Helper to update a step
    const updateStep = (stepId: string, status: PipelineStep["status"]) => {
      setPipelineSteps(prev => prev.map(s => s.id === stepId ? { ...s, status } : s));
    };

    // Helper to add log
    const addLog = (message: string) => {
      const time = new Date().toISOString().split('T')[1].split('.')[0];
      setPipelineLogs(prev => [...prev, `[${time}] ${message}`]);
    };

    try {
      // Step 1: Data Input
      updateStep("input", "running");
      setPipelineStatus("Receiving idea data...");
      addLog("📥 Receiving idea data from form...");
      await new Promise(r => setTimeout(r, 400));
      addLog("✓ Data received: " + formData.title.slice(0, 30) + "...");
      updateStep("input", "completed");
      setPipelineProgress(8);

      // Step 2: Make the actual API call
      updateStep("validator", "running");
      setPipelineStatus("Sending to AI pipeline...");
      addLog("▶ Initiating validator agent...");

      const response = await fetch('/api/ideas', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.join(", "),
          regulations: formData.regulations.join(", "),
          implementationLevel: formData.implementationLevel.join(", "),
        }),
      });

      // Simulate pipeline steps while waiting (the actual AI is running server-side)
      const simulateSteps = async () => {
        // Validator
        addLog("→ Normalizing input fields...");
        await new Promise(r => setTimeout(r, 300));
        addLog("✓ Input validated successfully");
        updateStep("validator", "completed");
        setPipelineProgress(15);

        // Parallel analyzers
        setPipelineStatus("Running parallel analyzers...");
        const parallelSteps = ["basic", "tech", "business", "regulations", "differentiators", "other", "ascii"];
        parallelSteps.forEach(s => updateStep(s, "running"));
        
        addLog("▶ Starting BASIC INFO ANALYZER...");
        addLog("▶ Starting TECH ANALYZER...");
        addLog("▶ Starting BUSINESS ANALYZER...");
        await new Promise(r => setTimeout(r, 500));
        setPipelineProgress(25);
        
        addLog("▶ Starting REGULATIONS ANALYZER...");
        addLog("▶ Starting DIFFERENTIATORS ANALYZER...");
        addLog("▶ Starting OTHER DETAILS ANALYZER...");
        addLog("▶ Starting ASCII ARTIST...");
        await new Promise(r => setTimeout(r, 600));
        setPipelineProgress(35);

        addLog("→ Analyzing idea category and scope...");
        await new Promise(r => setTimeout(r, 400));
        addLog("→ Evaluating technology feasibility...");
        await new Promise(r => setTimeout(r, 400));
        setPipelineProgress(45);
        
        addLog("→ Assessing market potential...");
        addLog("→ Checking banking regulations...");
        await new Promise(r => setTimeout(r, 500));
        setPipelineProgress(55);

        addLog("✓ Basic info analysis complete");
        updateStep("basic", "completed");
        addLog("✓ Technology analysis complete");
        updateStep("tech", "completed");
        await new Promise(r => setTimeout(r, 300));
        setPipelineProgress(62);

        addLog("✓ Business analysis complete");
        updateStep("business", "completed");
        addLog("✓ Regulations check complete");
        updateStep("regulations", "completed");
        await new Promise(r => setTimeout(r, 300));
        setPipelineProgress(70);

        addLog("✓ Differentiators identified");
        updateStep("differentiators", "completed");
        addLog("✓ Additional details processed");
        updateStep("other", "completed");
        addLog("✓ ASCII visualization generated");
        updateStep("ascii", "completed");
        setPipelineProgress(78);

        // Aggregator
        setPipelineStatus("Aggregating results...");
        updateStep("aggregator", "running");
        addLog("▶ AGGREGATOR combining all analyses...");
        await new Promise(r => setTimeout(r, 500));
        addLog("→ Merging insights from 7 agents...");
        await new Promise(r => setTimeout(r, 400));
        addLog("✓ Analysis aggregation complete");
        updateStep("aggregator", "completed");
        setPipelineProgress(85);

        // HTML Builder
        updateStep("html", "running");
        addLog("▶ HTML BUILDER creating presentation...");
        await new Promise(r => setTimeout(r, 400));
        addLog("→ Generating teletext-style HTML...");
        await new Promise(r => setTimeout(r, 300));
        addLog("✓ HTML structure built");
        updateStep("html", "completed");
        setPipelineProgress(90);

        // Statistician
        updateStep("stats", "running");
        addLog("▶ STATISTICIAN calculating scores...");
        await new Promise(r => setTimeout(r, 400));
        addLog("→ Computing innovation score...");
        addLog("→ Computing feasibility score...");
        await new Promise(r => setTimeout(r, 300));
        addLog("✓ Final scores calculated");
        updateStep("stats", "completed");
        setPipelineProgress(95);

        // Visual Designer
        updateStep("visual", "running");
        addLog("▶ VISUAL DESIGNER applying final touches...");
        await new Promise(r => setTimeout(r, 400));
        addLog("→ Enhancing visual presentation...");
        await new Promise(r => setTimeout(r, 200));
        addLog("✓ Visual design complete");
        updateStep("visual", "completed");
        setPipelineProgress(100);
      };

      // Run simulation while API processes
      await simulateSteps();

      const data = await response.json();

      if (!response.ok) {
        addLog("❌ Error: " + (data.error || "Failed to submit idea"));
        setPipelineStatus("Error occurred!");
        setSubmitError(data.error || "Failed to submit idea");
        await new Promise(r => setTimeout(r, 2000));
        setShowPipelineOverlay(false);
        setSubmitLoading(false);
        return;
      }

      // Success!
      addLog("✅ PIPELINE COMPLETE!");
      addLog("✅ Idea successfully submitted and analyzed!");
      setPipelineStatus("🎉 Pipeline complete! Idea submitted successfully!");
      
      await new Promise(r => setTimeout(r, 1500));
      
      setSubmitSuccess(true);
      resetForm();
      setShowPipelineOverlay(false);
      
      // Refresh ideas list
      const ideasResponse = await fetch('/api/ideas');
      if (ideasResponse.ok) {
        const ideasData = await ideasResponse.json();
        setIdeas(ideasData.ideas || []);
        // Update stats
        const ideasList = ideasData.ideas || [];
        setStats({
          totalIdeas: ideasList.length,
          new: ideasList.filter((i: Idea) => i.status === "new").length,
          inReview: ideasList.filter((i: Idea) => i.status === "review").length,
          approved: ideasList.filter((i: Idea) => i.status === "approved").length,
          building: ideasList.filter((i: Idea) => i.status === "build").length,
          completed: ideasList.filter((i: Idea) => i.status === "completed").length,
        });
      }

      // Switch to browse tab after short delay
      setTimeout(() => {
        setActiveTab("browse");
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error("Error submitting idea:", error);
      addLog("❌ Network error occurred");
      setPipelineStatus("Error occurred!");
      setSubmitError("An error occurred. Please try again.");
      await new Promise(r => setTimeout(r, 2000));
      setShowPipelineOverlay(false);
    }
    setSubmitLoading(false);
  };

  // Sort ideas by votes for top tab
  const topIdeas = [...ideas].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)).slice(0, 5);

  // Show boot loader first
  if (booting) {
    return <TeletextBootLoader onComplete={() => setBooting(false)} />;
  }

  return (
    <>
      {/* AI Pipeline Overlay */}
      <AIPipelineOverlay
        isVisible={showPipelineOverlay}
        steps={pipelineSteps}
        logs={pipelineLogs}
        progress={pipelineProgress}
        statusText={pipelineStatus}
      />
      
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
              ideas.map((idea, index) => (
                <div
                  key={idea.id}
                  className="idea-item"
                  onClick={() => openIdeaModal(idea)}
                >
                  <span className="idea-id">#{index + 1}</span>
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
            ) : submitSuccess ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ color: "var(--teletext-green)", fontSize: "32px", marginBottom: "20px" }}>
                  ✓ IDEA SUBMITTED SUCCESSFULLY!
                </div>
                <p style={{ color: "var(--teletext-cyan)" }}>
                  Redirecting to Browse Ideas...
                </p>
              </div>
            ) : (
              <form style={{ marginTop: "15px" }} onSubmit={handleSubmitIdea}>
                {submitError && (
                  <div style={{ 
                    background: "rgba(255,0,0,0.2)", 
                    border: "2px solid var(--teletext-red)", 
                    padding: "10px", 
                    marginBottom: "15px",
                    color: "var(--teletext-red)"
                  }}>
                    ⚠ {submitError}
                  </div>
                )}

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
                      placeholder="e.g., SmartSave - Intelligent Savings Assistant for Gen Z"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">THE BIG IDEA *</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="e.g., An intelligent savings app that analyzes spending patterns and automatically transfers small amounts to savings goals. Uses gamification and social features to make saving money engaging for younger demographics."
                      value={formData.shortDescription}
                      onChange={(e) => handleFormChange("shortDescription", e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <label className="form-label">MAIN CATEGORY *</label>
                    <select 
                      className="form-input"
                      value={formData.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                    >
                      <option value="">-- Select Category --</option>
                      <option value="Digital Banking">Digital Banking</option>
                      <option value="Payments & Transfers">Payments & Transfers</option>
                      <option value="Wealth Management">Wealth Management</option>
                      <option value="Lending & Credit">Lending & Credit</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Fraud & Security">Fraud & Security</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Internal Operations">Internal Operations</option>
                      <option value="ESG & Sustainability">ESG & Sustainability</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">PROBLEM IT SOLVES *</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="e.g., Young adults struggle to build savings habits due to lack of engagement with traditional banking tools. 67% of Gen Z report having no emergency fund, and traditional savings accounts feel disconnected from their digital lifestyle."
                      value={formData.problemSolved}
                      onChange={(e) => handleFormChange("problemSolved", e.target.value)}
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
                      {["Artificial Intelligence / ML", "Blockchain / DLT", "Cloud Computing", "Big Data / Analytics", "IoT / Embedded Systems", "API / Open Banking", "Biometrics", "AR / VR"].map((tech) => (
                        <label key={tech} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={formData.technologies.includes(tech)}
                            onChange={(e) => handleCheckboxChange("technologies", tech, e.target.checked)}
                          /> {tech}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label">SOLUTION TYPE</label>
                    <select 
                      className="form-input"
                      value={formData.solutionType}
                      onChange={(e) => handleFormChange("solutionType", e.target.value)}
                    >
                      <option value="">-- Select Solution Type --</option>
                      <option value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</option>
                      <option value="Web Application">Web Application</option>
                      <option value="Desktop Application">Desktop Application</option>
                      <option value="API / Backend Service">API / Backend Service</option>
                      <option value="Browser Extension">Browser Extension</option>
                      <option value="Chatbot / Conversational AI">Chatbot / Conversational AI</option>
                      <option value="Hardware + Software">Hardware + Software</option>
                      <option value="Platform / Marketplace">Platform / Marketplace</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">TECH STACK DETAILS (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., React Native, Node.js, PostgreSQL, TensorFlow, AWS Lambda"
                      value={formData.techStackDetails}
                      onChange={(e) => handleFormChange("techStackDetails", e.target.value)}
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
                    <label className="form-label">TARGET SEGMENT</label>
                    <select 
                      className="form-input"
                      value={formData.targetSegment}
                      onChange={(e) => handleFormChange("targetSegment", e.target.value)}
                    >
                      <option value="">-- Select Target Segment --</option>
                      <option value="Retail Banking - Gen Z (18-25)">Retail Banking - Gen Z (18-25)</option>
                      <option value="Retail Banking - Millennials (26-41)">Retail Banking - Millennials (26-41)</option>
                      <option value="Retail Banking - Gen X (42-57)">Retail Banking - Gen X (42-57)</option>
                      <option value="Retail Banking - Seniors (58+)">Retail Banking - Seniors (58+)</option>
                      <option value="Small Business / SME">Small Business / SME</option>
                      <option value="Corporate Clients">Corporate Clients</option>
                      <option value="High Net Worth Individuals">High Net Worth Individuals</option>
                      <option value="Internal - Bank Employees">Internal - Bank Employees</option>
                      <option value="B2B - Other Financial Institutions">B2B - Other Financial Institutions</option>
                      <option value="Universal / All Segments">Universal / All Segments</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">MONETIZATION MODEL</label>
                    <select 
                      className="form-input"
                      value={formData.monetizationModel}
                      onChange={(e) => handleFormChange("monetizationModel", e.target.value)}
                    >
                      <option value="">-- Select Monetization Model --</option>
                      <option value="Subscription (Monthly/Annual)">Subscription (Monthly/Annual)</option>
                      <option value="Transaction Fees">Transaction Fees</option>
                      <option value="Freemium (Basic Free + Premium)">Freemium (Basic Free + Premium)</option>
                      <option value="One-time Purchase">One-time Purchase</option>
                      <option value="Commission Based">Commission Based</option>
                      <option value="Advertising Supported">Advertising Supported</option>
                      <option value="Cost Savings (Internal Tool)">Cost Savings (Internal Tool)</option>
                      <option value="Data Monetization">Data Monetization</option>
                      <option value="White Label / Licensing">White Label / Licensing</option>
                      <option value="Not Applicable / TBD">Not Applicable / TBD</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">ESTIMATED MARKET SIZE (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., €2.5B European digital savings market, growing 15% YoY"
                      value={formData.marketSize}
                      onChange={(e) => handleFormChange("marketSize", e.target.value)}
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
                      {["GDPR (Data Protection)", "PSD2 / Open Banking", "MiFID II (Investment Services)", "AML / KYC Requirements", "Basel III / IV", "DORA (Digital Operational Resilience)", "AI Act (EU)", "Not Sure / Need Guidance"].map((reg) => (
                        <label key={reg} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={formData.regulations.includes(reg)}
                            onChange={(e) => handleCheckboxChange("regulations", reg, e.target.checked)}
                          /> {reg}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label">COMPLIANCE NOTES (optional)</label>
                    <textarea
                      className="form-input form-textarea-small"
                      placeholder="e.g., We've designed with privacy-by-default. All user data is encrypted and stored in EU data centers. We need guidance on cross-border data transfers."
                      value={formData.complianceNotes}
                      onChange={(e) => handleFormChange("complianceNotes", e.target.value)}
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
                    <label className="form-label">WHAT MAKES THIS UNIQUE?</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="e.g., Unlike existing apps, we use behavioral psychology and social proof to create 'savings challenges' with friends. Our AI predicts the optimal micro-transfer amount based on upcoming expenses, ensuring users never overdraft."
                      value={formData.uniqueValue}
                      onChange={(e) => handleFormChange("uniqueValue", e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <label className="form-label">CURRENT IMPLEMENTATION LEVEL</label>
                    <div className="checkbox-group">
                      {["Frontend UI/UX", "Backend / API", "Database Schema", "Authentication / Security", "AI/ML Models", "Third-party Integrations", "Testing / QA", "Documentation"].map((level) => (
                        <label key={level} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={formData.implementationLevel.includes(level)}
                            onChange={(e) => handleCheckboxChange("implementationLevel", level, e.target.checked)}
                          /> {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="form-label">PROJECT STAGE</label>
                    <select 
                      className="form-input"
                      value={formData.projectStage}
                      onChange={(e) => handleFormChange("projectStage", e.target.value)}
                    >
                      <option value="">-- Select Stage --</option>
                      <option value="Proof of Concept (PoC)">Proof of Concept (PoC)</option>
                      <option value="Working Prototype">Working Prototype</option>
                      <option value="Alpha Version">Alpha Version</option>
                      <option value="Beta Version">Beta Version</option>
                      <option value="MVP Ready">MVP Ready</option>
                      <option value="Production Ready">Production Ready</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">GITHUB REPOSITORY LINK</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://github.com/your-username/your-project"
                      value={formData.githubLink}
                      onChange={(e) => handleFormChange("githubLink", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">MARKET RESEARCH / COMPETITOR ANALYSIS</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="e.g., Analyzed: Acorns (US - $3B valuation, lacks social features), Plum (UK - AI-based but limited personalization), Revolut Vaults (no gamification). Our edge: Social challenges + predictive AI + DB's trust factor."
                      value={formData.competitors}
                      onChange={(e) => handleFormChange("competitors", e.target.value)}
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
                      value={formData.team}
                      onChange={(e) => handleFormChange("team", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">DEMO VIDEO / PRESENTATION LINK (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://youtube.com/watch?v=... or https://docs.google.com/presentation/..."
                      value={formData.demoLink}
                      onChange={(e) => handleFormChange("demoLink", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">WHAT DO YOU NEED FROM DB? (optional)</label>
                    <textarea
                      className="form-input form-textarea-small"
                      placeholder="e.g., Access to sandbox API for account data, mentorship from product team, regulatory guidance, potential pilot with 1000 users"
                      value={formData.needFromDB}
                      onChange={(e) => handleFormChange("needFromDB", e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <label className="form-label">ADDITIONAL NOTES</label>
                    <textarea
                      className="form-input form-textarea-small"
                      placeholder="Any other information you'd like to share about your idea..."
                      value={formData.additionalNotes}
                      onChange={(e) => handleFormChange("additionalNotes", e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "2px dashed var(--teletext-cyan)" }}>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "⏳ SUBMITTING..." : "▶ SUBMIT IDEA"}
                  </button>
                </div>
              </form>
            )}
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
              {/* AI Generated Content - Afișează HTML-ul generat dacă există */}
              {selectedIdea.generatedHtml ? (
                <>
                  <div 
                    className="ai-generated-content"
                    dangerouslySetInnerHTML={{ __html: selectedIdea.generatedHtml }}
                    style={{
                      background: "#0000AA",
                      padding: "0",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      fontFamily: "VT323, monospace",
                      maxHeight: "calc(90vh - 200px)",
                      overflow: "auto",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#00FFFF #000033"
                    }}
                  />
                </>
              ) : (
                <>
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
                </>
              )}

              {/* AI Score Badge */}
              {selectedIdea.aiScore !== null && selectedIdea.aiScore !== undefined && (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  marginBottom: "15px",
                  padding: "10px",
                  background: "rgba(0, 255, 255, 0.1)",
                  borderRadius: "4px"
                }}>
                  <span style={{ color: "#00ffff", fontWeight: "bold" }}>AI SCORE:</span>
                  <span style={{ 
                    color: selectedIdea.aiScore >= 70 ? "#00ff00" : selectedIdea.aiScore >= 50 ? "#ffff00" : "#ff0000",
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}>
                    {selectedIdea.aiScore}%
                  </span>
                  {selectedIdea.aiRecommendation && (
                    <span style={{
                      background: selectedIdea.aiRecommendation === "highly-recommended" ? "#00ff00" :
                                 selectedIdea.aiRecommendation === "recommended" ? "#00ffff" :
                                 selectedIdea.aiRecommendation === "consider" ? "#ffff00" : "#ff6600",
                      color: "#000",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      textTransform: "uppercase"
                    }}>
                      {selectedIdea.aiRecommendation.replace("-", " ")}
                    </span>
                  )}
                </div>
              )}

              {/* Voting și acțiuni - afișate mereu */}
              {selectedIdea.generatedHtml && (
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
              )}

              <div className="modal-actions">
                <a
                  href={selectedIdea.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  ⬡ GitHub Repository
                </a>
                <button 
                  className="submit-btn ai-btn"
                  onClick={toggleComments}
                >
                  💬 {showComments ? "HIDE" : "SHOW"} COMMENTS ({comments.length})
                </button>
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

              {/* Comments Section */}
              {showComments && (
                <div className="comments-section" style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "rgba(0, 255, 255, 0.05)",
                  border: "1px solid #00ffff",
                  borderRadius: "4px"
                }}>
                  <h3 style={{ color: "#ffff00", marginBottom: "15px", fontSize: "18px" }}>
                    💬 COMMENTS ({comments.length})
                  </h3>
                  
                  {/* Comment Input - only for logged in users */}
                  {isLoggedIn ? (
                    <div style={{ marginBottom: "20px" }}>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here... (3-500 characters)"
                        maxLength={500}
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "10px",
                          background: "#000033",
                          border: "1px solid #00ffff",
                          color: "#fff",
                          fontFamily: "VT323, monospace",
                          fontSize: "16px",
                          borderRadius: "4px",
                          resize: "vertical"
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <span style={{ color: "#888", fontSize: "12px" }}>
                          {newComment.length}/500 characters
                        </span>
                        <button
                          onClick={handleSubmitComment}
                          disabled={commentSubmitting || newComment.trim().length < 3}
                          className="submit-btn"
                          style={{
                            padding: "8px 20px",
                            fontSize: "14px",
                            opacity: (commentSubmitting || newComment.trim().length < 3) ? 0.5 : 1
                          }}
                        >
                          {commentSubmitting ? "POSTING..." : "POST COMMENT"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      marginBottom: "20px", 
                      padding: "10px", 
                      background: "rgba(255, 255, 0, 0.1)", 
                      borderRadius: "4px",
                      textAlign: "center"
                    }}>
                      <a 
                        onClick={() => { closeModal(); setShowAuthModal(true); }}
                        style={{ color: "#00ffff", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Login
                      </a> to post a comment
                    </div>
                  )}

                  {/* Comments List */}
                  {commentsLoading ? (
                    <div style={{ textAlign: "center", color: "#888" }}>Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#888" }}>
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  ) : (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          style={{
                            padding: "12px",
                            marginBottom: "10px",
                            background: "rgba(0, 0, 0, 0.3)",
                            borderLeft: "3px solid #00ffff",
                            borderRadius: "0 4px 4px 0"
                          }}
                        >
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            marginBottom: "8px",
                            fontSize: "12px"
                          }}>
                            <span style={{ color: "#ffff00", fontWeight: "bold" }}>
                              {comment.userName || "Anonymous"}
                            </span>
                            <span style={{ color: "#666" }}>
                              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <div style={{ color: "#fff", lineHeight: "1.5" }}>
                            {comment.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
