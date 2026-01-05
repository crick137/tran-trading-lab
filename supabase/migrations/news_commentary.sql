-- Supabase Migration: news_commentary table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS news_commentary (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    source text,
    source_url text,
    oneliner text,
    analysis text,
    signal text CHECK (signal IN ('green', 'red', 'neutral')),
    importance integer CHECK (importance >= 1 AND importance <= 5),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE news_commentary ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read access" ON news_commentary
    FOR SELECT USING (true);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_news_commentary_created_at 
    ON news_commentary (created_at DESC);
