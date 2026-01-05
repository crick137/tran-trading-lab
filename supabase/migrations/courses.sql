-- Supabase Migration: Course System Enhancement
-- Run this in Supabase SQL Editor

-- 确保课程表存在 (lab_courses)
-- 这个表可能已经存在，这里只是添加新字段

-- 课程购买记录
CREATE TABLE IF NOT EXISTS course_purchases (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id uuid NOT NULL,
    purchase_type text DEFAULT 'individual' CHECK (purchase_type IN ('individual', 'membership')),
    amount_paid decimal(10,2) DEFAULT 0,
    currency text DEFAULT 'USD',
    stripe_payment_id text,
    purchased_at timestamp with time zone DEFAULT now()
);

-- 课程进度表 (如果不存在)
CREATE TABLE IF NOT EXISTS user_course_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id uuid NOT NULL,
    lesson_id uuid,
    progress integer DEFAULT 0,
    completed boolean DEFAULT false,
    last_accessed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- 课程评价
CREATE TABLE IF NOT EXISTS course_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id uuid NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    is_verified_purchase boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的购买记录
CREATE POLICY "Users view own purchases" ON course_purchases
    FOR SELECT USING (auth.uid() = user_id);

-- 用户只能查看/更新自己的进度
CREATE POLICY "Users manage own progress" ON user_course_progress
    FOR ALL USING (auth.uid() = user_id);

-- 所有人可以查看评价
CREATE POLICY "Public read reviews" ON course_reviews
    FOR SELECT USING (true);

-- 用户只能写自己的评价
CREATE POLICY "Users write own reviews" ON course_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON course_purchases (user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON user_course_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews (course_id);
