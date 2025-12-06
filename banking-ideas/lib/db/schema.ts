import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table with role support
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"), // hashed password for credentials auth
  name: text("name"),
  image: text("image"),
  role: text("role").notNull().default("user"), // guest, user, admin
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Ideas table with updated status flow
export const ideas = sqliteTable("ideas", {
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
  implementationLevel: integer("implementation_level").notNull(),
  githubLink: text("github_link").notNull(),
  competitors: text("competitors"),
  usedAIResearch: integer("used_ai_research", { mode: "boolean" }).notNull(),
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
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Votes table - Updated for like/dislike system
export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(), // 'like' or 'dislike'
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Comments table - Users only
export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Sessions table for NextAuth
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").references(() => users.id).notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// Accounts table for NextAuth (OAuth providers)
export const accounts = sqliteTable("accounts", {
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

