import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Ideas table
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
  
  // Metadata
  status: text("status").notNull().default("draft"), // draft, processing, published
  averageRating: real("average_rating").default(0),
  totalVotes: integer("total_votes").default(0),
  viewCount: integer("view_count").default(0),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Votes table
export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  odp: text("user_id").references(() => users.id),
  sessionId: text("session_id"), // For anonymous voting
  rating: integer("rating").notNull(), // 1-5
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Comments table
export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  ideaId: text("idea_id").references(() => ideas.id).notNull(),
  userId: text("user_id").references(() => users.id),
  username: text("username").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
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
