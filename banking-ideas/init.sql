-- Banking Ideas Database Initialization Script
-- PostgreSQL Database Schema
-- Synchronized with Drizzle schema.ts

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role support
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    name TEXT,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT users_role_check CHECK (role IN ('guest', 'user', 'admin'))
);

-- Ideas table with updated status flow
CREATE TABLE IF NOT EXISTS ideas (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    
    -- Basic Info
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    category TEXT NOT NULL,
    problem_solved TEXT NOT NULL,
    
    -- Technologies (stored as JSON/comma-separated)
    ai_technologies TEXT,
    blockchain_technologies TEXT,
    other_technologies TEXT,
    
    -- Solution Type
    platform TEXT NOT NULL,
    
    -- Business Context
    target_segment TEXT NOT NULL,
    monetization_model TEXT NOT NULL,
    target_markets TEXT NOT NULL,
    
    -- Regulations
    regulations TEXT,
    compliance_notes TEXT,
    
    -- Differentiators
    unique_value TEXT NOT NULL,
    implementation_level TEXT,           -- TEXT for comma-separated list (e.g., "Backend, Frontend, Database")
    github_link TEXT,                    -- Optional
    competitors TEXT,
    used_ai_research BOOLEAN NOT NULL DEFAULT FALSE,
    ai_research_details TEXT,
    
    -- Additional
    team TEXT,
    estimated_timeline TEXT,
    estimated_budget TEXT,
    community_questions TEXT,
    
    -- Generated content
    generated_pages TEXT,
    page_number INTEGER,
    
    -- Metadata
    status TEXT NOT NULL DEFAULT 'new',
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT ideas_status_check CHECK (status IN ('new', 'review', 'approved', 'build', 'completed'))
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    idea_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT votes_vote_type_check CHECK (vote_type IN ('like', 'dislike')),
    CONSTRAINT votes_unique_user_idea UNIQUE (idea_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    idea_id TEXT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);

-- Accounts table for NextAuth (OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    
    CONSTRAINT accounts_unique_provider UNIQUE (provider, provider_account_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_page_number ON ideas(page_number);
CREATE INDEX IF NOT EXISTS idx_votes_idea_id ON votes(idea_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_idea_id ON comments(idea_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist (for idempotency)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DEFAULT USERS
-- ========================================
-- Passwords are hashed using bcrypt (10 rounds)

-- Admin user (password: admin123)
INSERT INTO users (id, email, password, name, role, created_at, updated_at)
VALUES (
    'admin-001',
    'admin@db.com',
    '$2b$10$ylhSXNdeYJQZg3oTe66dBOKHPTJwVsnx8iJFk3yufXv5GdVe6yQCO',
    'Administrator',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Regular user (password: user123)
INSERT INTO users (id, email, password, name, role, created_at, updated_at)
VALUES (
    'user-001',
    'user@db.com',
    '$2b$10$x5c4Dd8qqryF3yyQTpnM1.czIyEEJamLg/nHn0aTqC3dK/9AzK8fm',
    'Test User',
    'user',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database initialized successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Admin: admin@db.com / admin123';
    RAISE NOTICE 'User:  user@db.com / user123';
    RAISE NOTICE '========================================';
END $$;
