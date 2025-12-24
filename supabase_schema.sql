-- TRAN Trading Lab 数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 实况布里夫表
CREATE TABLE IF NOT EXISTS briefs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    importance TEXT DEFAULT 'low' CHECK (importance IN ('high', 'medium', 'low')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 2. 分析文章表
CREATE TABLE IF NOT EXISTS analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT DEFAULT '기술적 분석',
    author TEXT DEFAULT 'TRAN Research',
    read_time TEXT DEFAULT '5분',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 3. 市场新闻表
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    source_url TEXT,
    sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
    category TEXT DEFAULT 'BTC',
    is_breaking BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 4. 研究课程表
CREATE TABLE IF NOT EXISTS lab_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT DEFAULT '초급' CHECK (level IN ('초급', '중급', '고급')),
    lessons INTEGER DEFAULT 0,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- 5. 交易日志表
CREATE TABLE IF NOT EXISTS trade_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pair TEXT NOT NULL DEFAULT 'BTC/USDT',
    type TEXT DEFAULT 'Long' CHECK (type IN ('Long', 'Short')),
    entry DECIMAL(20, 8),
    exit DECIMAL(20, 8),
    pnl DECIMAL(20, 8),
    pnl_percent DECIMAL(10, 4),
    trade_date DATE DEFAULT CURRENT_DATE,
    grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Newsletter订阅者表
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    language TEXT DEFAULT 'ko',
    unsubscribe_token TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 用户课程进度表
CREATE TABLE IF NOT EXISTS user_course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES lab_courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 8. 价格警报表 (可选，如需持久化到服务器)
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    target_price DECIMAL NOT NULL,
    condition TEXT CHECK (condition IN ('above', 'below')),
    is_active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Row Level Security (可选)
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_notes ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略
CREATE POLICY "Public read briefs" ON briefs FOR SELECT USING (is_published = true);
CREATE POLICY "Public read analysis" ON analysis FOR SELECT USING (is_published = true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read lab_courses" ON lab_courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public read trade_notes" ON trade_notes FOR SELECT USING (true);

-- 允许匿名用户进行所有操作（开发阶段）
CREATE POLICY "Allow all briefs" ON briefs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all analysis" ON analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all lab_courses" ON lab_courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all trade_notes" ON trade_notes FOR ALL USING (true) WITH CHECK (true);

-- Newsletter订阅者表策略
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select newsletter" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Allow update newsletter" ON newsletter_subscribers FOR UPDATE USING (true);

-- 用户课程进度策略
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON user_course_progress FOR ALL USING (true) WITH CHECK (true);

-- 价格警报策略
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON price_alerts FOR ALL USING (true) WITH CHECK (true);

-- 插入一些示例数据
INSERT INTO briefs (title, content, importance, tags) VALUES
('비트코인 $101,000 돌파', '비트코인이 역사적인 이정표를 달성했습니다. 기관 투자자들의 지속적인 매수세와 ETF 유입이 상승을 이끌고 있습니다.', 'high', ARRAY['BTC', 'ATH', '기관투자']),
('SEC, 이더리움 ETF 최종 승인', 'SEC가 주요 자산운용사들의 이더리움 현물 ETF를 공식 승인했습니다. 시장은 이에 긍정적으로 반응하고 있습니다.', 'high', ARRAY['ETH', 'ETF', 'SEC']),
('마이크로스트래티지, BTC 추가 매수', '마이크로스트래티지가 2억 달러 규모의 비트코인을 추가 매수했습니다.', 'medium', ARRAY['MSTR', 'BTC', '기관']);

INSERT INTO analysis (title, summary, category, author, read_time, is_featured) VALUES
('2024년 비트코인 시장 전망: 반감기 이후 강세장 분석', '비트코인 반감기 이후 역사적 패턴을 분석하고, 2024년 하반기 시장 전망을 제시합니다.', '온체인 분석', 'TRAN Research', '15분', true),
('온체인 데이터로 보는 시장 심리', '주요 온체인 지표들을 통해 현재 시장 참여자들의 심리 상태를 진단합니다.', '온체인 분석', 'TRAN Research', '8분', false);

INSERT INTO news (title, summary, source, sentiment, is_breaking) VALUES
('비트코인 $101,000 돌파 — 역사상 최대 시가총액 기록 경신', '비트코인이 10만 달러를 돌파하며 새로운 역사를 썼습니다.', 'Bloomberg', 'bullish', true),
('블랙록 비트코인 ETF, 역대 최대 거래량 기록 — 기관 수요 급증', '블랙록의 IBIT가 출시 이후 최대 일일 거래량을 기록했습니다.', 'Reuters', 'bullish', false);

INSERT INTO lab_courses (title, description, level, lessons, order_index) VALUES
('트레이딩 기초 마스터', '차트 분석의 기본부터 주문 체결까지, 트레이딩의 기초를 다집니다.', '초급', 12, 1),
('기술적 분석 심화', '지표 활용법과 패턴 분석을 통한 고급 기술적 분석 기법을 학습합니다.', '중급', 15, 2),
('리스크 관리 전략', '포지션 사이징, 손절 전략, 자금 관리의 핵심 원칙을 배웁니다.', '중급', 10, 3);

INSERT INTO trade_notes (pair, type, entry, exit, pnl, pnl_percent, trade_date, grade, notes) VALUES
('BTC/USDT', 'Long', 99500, 101200, 1700, 1.71, '2024-12-15', 'A', '지지선 반등 확인 후 진입. 계획대로 익절.'),
('ETH/USDT', 'Long', 3750, 3850, 500, 2.67, '2024-12-14', 'B', 'ETF 승인 뉴스 기대 매매. 목표가 1차 도달.');
