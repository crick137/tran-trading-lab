-- Supabase Migration: Membership System
-- Run this in Supabase SQL Editor

-- 会员订阅表
CREATE TABLE IF NOT EXISTS memberships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type text NOT NULL CHECK (plan_type IN ('free', 'pro', 'premium')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    stripe_customer_id text,
    stripe_subscription_id text,
    started_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 会员计划配置
CREATE TABLE IF NOT EXISTS membership_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    name_ko text,
    description text,
    description_ko text,
    price_monthly decimal(10,2) DEFAULT 0,
    price_yearly decimal(10,2) DEFAULT 0,
    currency text DEFAULT 'USD',
    features jsonb DEFAULT '[]',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 内容访问权限
CREATE TABLE IF NOT EXISTS content_access (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id uuid NOT NULL,
    content_type text NOT NULL CHECK (content_type IN ('article', 'course', 'lesson', 'tool')),
    required_plan text NOT NULL CHECK (required_plan IN ('free', 'pro', 'premium')),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_access ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的会员信息
CREATE POLICY "Users can view own membership" ON memberships
    FOR SELECT USING (auth.uid() = user_id);

-- 服务端可以管理会员
CREATE POLICY "Service role full access" ON memberships
    FOR ALL USING (auth.role() = 'service_role');

-- 所有人可以查看计划配置
CREATE POLICY "Public read plans" ON membership_plans
    FOR SELECT USING (is_active = true);

-- 所有人可以查看内容访问配置
CREATE POLICY "Public read content_access" ON content_access
    FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships (status);
CREATE INDEX IF NOT EXISTS idx_content_access_content ON content_access (content_type, content_id);

-- 插入默认计划
INSERT INTO membership_plans (name, name_ko, description, description_ko, price_monthly, price_yearly, features) VALUES
('Free', '무료', 'Basic access to news and articles', '뉴스 및 기본 분석 접근', 0, 0, '["news", "basic_articles", "newsletter"]'),
('Pro', '프로', 'Premium analysis and tools', '프리미엄 분석 및 도구', 9.99, 99, '["news", "all_articles", "tools", "priority_alerts", "monthly_report"]'),
('Premium', '프리미엄', 'Full access including courses', '코스를 포함한 전체 접근', 29.99, 299, '["news", "all_articles", "tools", "courses", "1on1_consultation", "private_group"]')
ON CONFLICT DO NOTHING;
