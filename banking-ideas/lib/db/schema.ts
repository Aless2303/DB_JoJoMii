import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// Users table with role support
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"), // hashed password for credentials auth
  name: text("name"),
  image: text("image"),
  role: text("role").notNull().default("user"), // guest, user, admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ideas table with updated status flow
export const ideas = pgTable("ideas", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  
  // Basic Info
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  category: text("category").notNull(),
  problemSolved: text("problem_solved").notNull(),
  
  // Technologies (stored as JSON)
  aiTechnologies: text("ai_technologies"), // JSON array
  blockchainTechnologies: text("blockchain_technologies"), // JSON array
  otherTechnologies: text("other_technologies"), // JSON array
  
  // Solution Type
  platform: text("platform").notNull(),
  
  // Business Context
  targetSegment: text("target_segment").notNull(),
  monetizationModel: text("monetization_model").notNull(), // JSON array
  targetMarkets: text("target_markets").notNull(), // JSON array
  
  // Regulations
  regulations: text("regulations"), // JSON array
  complianceNotes: text("compliance_notes"),
  
  // Differentiators
  uniqueValue: text("unique_value").notNull(),
  implementationLevel: text("implementation_level"), // Changed to text to store comma-separated list
  githubLink: text("github_link"),
  competitors: text("competitors"),
  usedAIResearch: boolean("used_ai_research").notNull(),
  aiResearchDetails: text("ai_research_details"),
  
  // Additional
  team: text("team"),
  estimatedTimeline: text("estimated_timeline"),
  estimatedBudget: text("estimated_budget"),
  communityQuestions: text("community_questions"),
  
  // Generated content
  generatedPages: text("generated_pages"), // JSON - array of rendered pages
  pageNumber: integer("page_number"), // Base page number for this idea (e.g., 110)
  
  // Metadata - Updated status flow: new -> review -> approved -> build -> completed
  status: text("status").notNull().default("new"), // new, review, approved, build, completed
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  viewCount: integer("view_count").default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Votes table - Updated for like/dislike system
export const votes = pgTable("votes", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(), // 'like' or 'dislike'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Comments table - Users only
export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table for NextAuth
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").references(() => users.id).notNull(),
  expires: timestamp("expires").notNull(),
});

// Accounts table for NextAuth (OAuth providers)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;

// Role types
export type UserRole = "guest" | "user" | "admin";

// Idea status types
export type IdeaStatus = "new" | "review" | "approved" | "build" | "completed";

