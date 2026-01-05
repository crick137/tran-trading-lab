-- Supabase Migration: subscribers table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text,
    source text DEFAULT 'website', -- website, telegram, etc.
    status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow insert from anyone (for signup form)
CREATE POLICY "Allow public insert" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Admin read access (optional: restrict to service role only)
CREATE POLICY "Admin read" ON subscribers
    FOR SELECT USING (auth.role() = 'service_role');

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);
