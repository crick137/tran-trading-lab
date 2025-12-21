/**
 * i18n - Internationalization Support
 */
import { useCallback } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'

const translations = {
    ko: {
        nav: {
            home: '홈',
            dashboard: '대시보드',
            brief: '실황 브리프',
            analysis: '분석 아카이브',
            news: '마켓 뉴스',
            lab: '지식 연구소',
            note: '트레이딩 노트',
            tools: '도구',
            about: '소개',
            logout: '로그아웃',
            profile: '프로필',
            settings: '설정',
            login: '로그인',
        },
        common: {
            search: '검색',
            loading: '로딩 중...',
            error: '오류 발생',
            retry: '다시 시도',
            cancel: '취소',
            confirm: '확인',
            save: '저장',
            delete: '삭제',
            edit: '편집',
            close: '닫기',
        },
        trading: {
            buy: '매수',
            sell: '매도',
            long: '롱',
            short: '숏',
            leverage: '레버리지',
            position: '포지션',
            position: '포지션',
            pnl: '손익',
        },
        auth: {
            title_signin: '돌아오신 것을 환영합니다',
            title_signup: '계정 생성',
            subtitle_signin: '트레이딩 여정을 계속하시려면 로그인하세요',
            subtitle_signup: '전문 트레이딩 경력을 시작하세요',
            username: '사용자명',
            username_placeholder: '이름을 입력하세요',
            email: '이메일',
            email_placeholder: 'name@example.com',
            password: '비밀번호',
            password_placeholder: '비밀번호를 입력하세요',
            signin_btn: '로그인',
            signup_btn: '가입하기',
            no_account: '계정이 없으신가요?',
            has_account: '이미 계정이 있으신가요?',
            go_signup: '지금 가입하기',
            go_signin: '로그인하기',
            error_required: '모든 필수 항목을 입력해주세요',
            error_username: '사용자 이름을 입력해주세요',
            success_signup: '가입 성공! 이메일을 확인하여 인증해주세요.',
            or: '또는',
            features: {
                security: '은행급 보안 암호화',
                realtime: '실시간 시세 밀리초 단위 푸시',
                ai: 'AI 보조 트레이딩 분석'
            },
            mask: {
                title: '전문가처럼 트레이딩하세요',
                desc: '심층 시장 분석, 독점 지표 및 트레이딩 인사이트를 확인하려면 로그인하세요.',
                btn: '커뮤니티 입장 / 로그인',
                features: ['심층 시장 분석', '독점 보조지표', '실전 트레이딩 전략', '커뮤니티']
            },
        },
        intro: {
            subtitle: '전문 글로벌 시장 분석 및 전략',
            desc: '데이터 기반의 시장 분석, 자체 개발 지표, 그리고 실전 트레이딩 교육을 제공합니다.'
        },
        time: {
            now: '지금',
            secondsAgo: '{n}초 전',
            minutesAgo: '{n}분 전',
            hoursAgo: '{n}시간 전',
            daysAgo: '{n}일 전',
        },
        home: {
            badge: '전문 트레이딩 리서치 플랫폼',
            heroDesc: '실시간 시장 정보 · 심층 분석 보고서 · 체계적 학습 · 트레이딩 복기 도구',
            statBriefs: '개 브리프',
            statAnalysis: '개 분석',
            statCourses: '개 강좌',
            exploreModules: '모듈 탐색',
            recentBriefs: '최신 브리프',
            viewAll: '전체 보기',
            urgent: '긴급',
            important: '중요',
            normal: '일반',
            footerText: '전문 암호화폐 트레이딩 리서치 플랫폼 · 데이터 기반 의사결정',
            modules: {
                brief: {
                    title: '실황 브리프',
                    desc: '암호화폐 시장 최신 동향, 중요한 정보를 가장 먼저 파악하세요'
                },
                analysis: {
                    title: '분석 아카이브',
                    desc: '심층 시장 리서치 보고서, 기술적 및 온체인 데이터 분석'
                },
                news: {
                    title: '마켓 뉴스',
                    desc: '글로벌 암호화폐 산업 뉴스, 시장 트렌드 파악'
                },
                lab: {
                    title: '지식 연구소',
                    desc: '체계적인 트레이딩 학습, 초급부터 고급까지'
                },
                note: {
                    title: '트레이딩 노트',
                    desc: '거래 복기 기록, 지속적인 전략 최적화'
                },
                tools: {
                    title: '트레이딩 도구',
                    desc: '전문 계산기 및 분석 도구 모음'
                },
            },
            tools_ui: {
                entry: '진입가',
                sl: '손절가',
                tp: '목표가',
                size: '수량',
                balance: '자산 잔고',
                risk: '리스크',
                symbol: '심볼',
                target: '목표가',
                addAlert: '설정',
                activeAlerts: '활성 알림',
                noAlerts: '알림 없음',
                tradingTips: '트레이딩 팁',
                tips: {
                    rrTitle: 'R:R 비율 가이드',
                    rr1: '최소 1:2 이상 권장',
                    rr2: '스캘핑: 1:1.5 ~ 1:2',
                    rr3: '스윙: 1:3 이상',
                    riskTitle: '리스크 관리',
                    risk1: '거래당 1-2% 리스크 권장',
                    risk2: '일일 최대 손실 5% 설정',
                    risk3: '승률보다 손익비가 중요',
                    posTitle: '포지션 관리',
                    pos1: '분할 진입/청산 고려',
                    pos2: '트레일링 스탑 활용',
                    pos3: '감정적 거래 피하기',
                }
            },
            dashboard_ui: {
                marketStats: {
                    high: '24h 고가',
                    low: '24h 저가',
                    vol: '24h 거래량',
                    rank: '시장 순위',
                    change: '등락폭'
                },
                sections: {
                    markets: '시장',
                    positions: '포지션',
                    orderBook: '오더북',
                    trades: '체결',
                    chart: '차트'
                },
                cols: {
                    symbol: '심볼',
                    price: '가격',
                    change24h: '24h',
                    change7d: '7D',
                    side: '방향',
                    size: '수량',
                    entry: '진입가',
                    mark: '현재가',
                    pnl: '손익 (ROE%)',
                    action: '액션',
                    spread: '스프레드',
                    total: '합계',
                    time: '시간'
                },
                status: {
                    connected: '연결됨',
                    connecting: '연결 중...',
                    secure: '보안',
                    server: '서버',
                    live: '실시간'
                },
                account: {
                    simulation: '시뮬레이션',
                    balance: '가용 잔고',
                    equity: '총 자산',
                    usedMargin: '증거금',
                    unrealized: '미실현 손익',
                    cumulative: '누적 손익',
                    winRate: '승률',
                    reset: '초기화'
                },
                actions: {
                    trade: '거래',
                    close: '청산',
                    closeAll: '모두 청산',
                    search: '검색...',
                    addToWatchlist: '관심 등록',
                    removeFromWatchlist: '관심 해제'
                },
                categories: {
                    all: '전체',
                    watchlist: '관심',
                    index: '지수',
                    crypto: '암호화폐',
                    forex: '외환',
                    commodity: '원자재'
                },
                msg: {
                    noPositions: '보유 포지션 없음',
                    openPositionSuccess: '포지션 진입 성공',
                    pnlTotal: '총 손익'
                }
            },
            symbols: {
                'SPY': 'S&P 500', 'QQQ': '나스닥 100', 'DIA': '다우존스', 'NIKKEI': '니케이 225', 'HSI': '항셍지수',
                'BTC/USDT': '비트코인', 'ETH/USDT': '이더리움', 'SOL/USDT': '솔라나', 'XRP/USDT': '리플',
                'GOLD': '금', 'SILVER': '은', 'WTI': 'WTI 원유', 'BRENT': '브렌트 유',
                'EUR/USD': '유로/달러', 'GBP/USD': '파운드/달러', 'USD/JPY': '달러/엔'
            },
        },
        views: {
            brief: {
                title: '실황 브리프',
                subtitle: '실시간 시장 동향',
                searchPlaceholder: '브리프 검색...',
                noData: '브리프가 없습니다',
                noDataDesc: '새 브리프가 곧 게시됩니다',
                all: '전체',
                urgent: '긴급',
                important: '중요',
                normal: '일반',
            },
            analysis: {
                title: '분석 아카이브',
                subtitle: '심층 리서치',
                searchPlaceholder: '분석 검색...',
                noData: '분석 문서가 없습니다',
                noDataDesc: '새 분석이 곧 게시됩니다',
                featured: '추천',
                readMore: '자세히 보기',
                readTime: '읽기 시간',
                author: '작성자',
            },
            news: {
                title: '마켓 뉴스',
                subtitle: '글로벌 뉴스',
                searchPlaceholder: '뉴스 검색...',
                noData: '뉴스가 없습니다',
                noDataDesc: '새 뉴스가 곧 게시됩니다',
                breaking: '속보',
                bullish: '상승',
                bearish: '하락',
                neutral: '중립',
                source: '출처',
            },
            lab: {
                title: '지식 연구소',
                subtitle: '트레이딩 교육',
                searchPlaceholder: '강좌 검색...',
                noData: '강좌가 없습니다',
                noDataDesc: '새 강좌가 곧 게시됩니다',
                beginner: '초급',
                intermediate: '중급',
                advanced: '고급',
                lessons: '강의',
                startCourse: '시작하기',
            },
            note: {
                title: '트레이딩 노트',
                subtitle: '거래 복기',
                searchPlaceholder: '노트 검색...',
                noData: '노트가 없습니다',
                noDataDesc: '새 거래를 기록하세요',
                addNote: '노트 추가',
                pair: '거래쌍',
                entry: '진입가',
                exit: '청산가',
                pnl: '손익',
                date: '날짜',
                grade: '등급',
            },
            tools: {
                title: '트레이딩 도구',
                subtitle: '전문 도구',
                positionCalc: '포지션 계산기',
                positionDesc: '리스크 기반 포지션 크기 산출',
                riskReward: '손익비 계산기',
                riskRewardDesc: '리스크/리워드 시나리오 분석',
                compound: '복리 계산기',
                compoundDesc: '복리 성장 시뮬레이션',
                sessions: '마켓 세션',
                sessionsDesc: '글로벌 세션 시간',
                ruin: '파산 확률',
                ruinDesc: '거래 전략별 파산 위험 분석',
            },
            dashboard: {
                title: '대시보드',
                subtitle: '개요',
                marketOverview: '시장 개요',
                recentActivity: '최근 활동',
                quickStats: '통계',
                price: '가격',
                change24h: '24시간 변동',
                volume: '거래량',
            },
        },
    },
    zh: {
        nav: {
            home: '首页',
            dashboard: '仪表盘',
            brief: '实时快讯',
            analysis: '分析文章',
            news: '市场新闻',
            lab: '研究课程',
            note: '交易笔记',
            tools: '工具',
            about: '我们',
            logout: '退出登录',
            profile: '个人资料',
            settings: '账户设置',
            login: '登录',
        },
        common: {
            search: '搜索',
            loading: '加载中...',
            error: '发生错误',
            retry: '重试',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            delete: '删除',
            edit: '编辑',
            close: '关闭',
        },
        trading: {
            buy: '买入',
            sell: '卖出',
            long: '做多',
            short: '做空',
            leverage: '杠杆',
            position: '持仓',
            position: '持仓',
            pnl: '盈亏',
        },
        auth: {
            title_signin: '欢迎回来',
            title_signup: '创建账户',
            subtitle_signin: '登录以继续您的交易之旅',
            subtitle_signup: '开始您的职业交易生涯',
            username: '用户名',
            username_placeholder: '您的称呼',
            email: '电子邮箱',
            email_placeholder: 'name@example.com',
            password: '密码',
            password_placeholder: '请输入密码',
            signin_btn: '登录',
            signup_btn: '注册',
            no_account: '还没有账户？',
            has_account: '已有账户？',
            go_signup: '立即注册',
            go_signin: '去登录',
            error_required: '请填写所有必填字段',
            error_username: '请输入用户名',
            success_signup: '注册成功！请检查邮箱完成验证。',
            or: '或是',
            features: {
                security: '银行级安全加密',
                realtime: '实时行情毫秒级推送',
                ai: 'AI 辅助交易分析'
            },
            mask: {
                title: '跟随专家交易',
                desc: '登录以获取深度市场分析、独家指标和实战交易策略。',
                btn: '加入社区 / 登录',
                features: ['深度市场分析', '独家辅助指标', '实战交易策略', '活跃社区']
            },
        },
        intro: {
            subtitle: '专业全球金融市场分析与策略',
            desc: '提供基于数据的市场分析、自研交易指标以及实战交易教育。'
        },
        time: {
            now: '刚刚',
            secondsAgo: '{n}秒前',
            minutesAgo: '{n}分钟前',
            hoursAgo: '{n}小时前',
            daysAgo: '{n}天前',
        },
        home: {
            badge: '专业交易研究平台',
            heroDesc: '实时市场资讯 · 深度分析报告 · 系统化学习 · 交易复盘工具',
            statBriefs: '条快讯',
            statAnalysis: '篇分析',
            statCourses: '门课程',
            exploreModules: '探索模块',
            recentBriefs: '最新快讯',
            viewAll: '查看全部',
            urgent: '紧急',
            important: '重要',
            normal: '普通',
            footerText: '专业的加密货币交易研究平台 · 数据驱动决策',
            modules: {
                brief: {
                    title: '实时快讯',
                    desc: '加密市场最新动态，第一时间掌握重要信息'
                },
                analysis: {
                    title: '分析文章',
                    desc: '深度市场研究报告，技术与链上数据分析'
                },
                news: {
                    title: '市场新闻',
                    desc: '全球加密行业资讯，把握市场脉搏'
                },
                lab: {
                    title: '研究课程',
                    desc: '系统化交易学习，从入门到精通'
                },
                note: {
                    title: '交易笔记',
                    desc: '记录交易复盘，持续优化策略'
                },
                tools: {
                    title: '交易工具',
                    desc: '专业计算器与分析工具集合'
                },
            },
            tools_ui: {
                entry: '入场价',
                sl: '止损价',
                tp: '止盈价',
                size: '数量',
                balance: '账户余额',
                risk: '风险',
                symbol: '币种',
                target: '目标价',
                addAlert: '设置',
                activeAlerts: '活跃提醒',
                noAlerts: '暂无提醒',
                tradingTips: '交易贴士',
                tips: {
                    rrTitle: '盈亏比指南',
                    rr1: '建议至少 1:2',
                    rr2: '超短线: 1:1.5 ~ 1:2',
                    rr3: '波段: 1:3 以上',
                    riskTitle: '风险管理',
                    risk1: '单笔交易风险建议 1-2%',
                    risk2: '日内最大回撤限制 5%',
                    risk3: '盈亏比优于胜率',
                    posTitle: '仓位管理',
                    pos1: '考虑分批进出场',
                    pos2: '使用追踪止损',
                    pos3: '避免情绪化交易',
                }
            },
            dashboard_ui: {
                marketStats: {
                    high: '24h 最高',
                    low: '24h 最低',
                    vol: '24h 成交量',
                    rank: '市场排名',
                    change: '涨跌幅'
                },
                sections: {
                    markets: '市场列表',
                    positions: '持仓',
                    orderBook: '订单簿',
                    trades: '最新成交',
                    chart: '图表'
                },
                cols: {
                    symbol: '币种',
                    price: '价格',
                    change24h: '24h',
                    change7d: '7D',
                    side: '方向',
                    size: '数量',
                    entry: '开仓价',
                    mark: '标记价',
                    pnl: '盈亏 (ROE%)',
                    action: '操作',
                    spread: '价差',
                    total: '总计',
                    time: '时间'
                },
                status: {
                    connected: '已连接',
                    connecting: '连接中...',
                    secure: '安全',
                    server: '服务器',
                    live: '实时'
                },
                account: {
                    simulation: '模拟交易',
                    balance: '可用余额',
                    equity: '总权益',
                    usedMargin: '占用保证金',
                    unrealized: '未实现盈亏',
                    cumulative: '累计盈亏',
                    winRate: '胜率',
                    reset: '重置'
                },
                actions: {
                    trade: '交易',
                    close: '平仓',
                    closeAll: '全部平仓',
                    search: '搜索...',
                    addToWatchlist: '添加自选',
                    removeFromWatchlist: '取消自选'
                },
                categories: {
                    all: '全部',
                    watchlist: '自选',
                    index: '指数',
                    crypto: '加密货币',
                    forex: '外汇',
                    commodity: '大宗商品'
                },
                msg: {
                    noPositions: '当前无持仓',
                    openPositionSuccess: '开仓成功',
                    pnlTotal: '总盈亏'
                }
            },
            symbols: {
                'SPY': '标普 500', 'QQQ': '纳斯达克 100', 'DIA': '道琼斯', 'NIKKEI': '日经 225', 'HSI': '恒生指数',
                'BTC/USDT': '比特币', 'ETH/USDT': '以太坊', 'SOL/USDT': '索拉纳', 'XRP/USDT': '瑞波币',
                'GOLD': '黄金', 'SILVER': '白银', 'WTI': 'WTI 原油', 'BRENT': '布伦特原油',
                'EUR/USD': '欧元/美元', 'GBP/USD': '英镑/美元', 'USD/JPY': '美元/日元'
            },
        },
        views: {
            brief: {
                title: '实时快讯',
                subtitle: '实时市场动态',
                searchPlaceholder: '搜索快讯...',
                noData: '暂无快讯',
                noDataDesc: '新快讯即将发布',
                all: '全部',
                urgent: '紧急',
                important: '重要',
                normal: '普通',
            },
            analysis: {
                title: '分析文章',
                subtitle: '深度研究',
                searchPlaceholder: '搜索分析...',
                noData: '暂无分析',
                noDataDesc: '新分析即将发布',
                featured: '推荐',
                readMore: '阅读更多',
                readTime: '阅读时长',
                author: '作者',
            },
            news: {
                title: '市场新闻',
                subtitle: '全球资讯',
                searchPlaceholder: '搜索新闻...',
                noData: '暂无新闻',
                noDataDesc: '新新闻即将发布',
                breaking: '突发',
                bullish: '看涨',
                bearish: '看跌',
                neutral: '中性',
                source: '来源',
            },
            lab: {
                title: '研究课程',
                subtitle: '交易教育',
                searchPlaceholder: '搜索课程...',
                noData: '暂无课程',
                noDataDesc: '新课程即将发布',
                beginner: '初级',
                intermediate: '中级',
                advanced: '高级',
                lessons: '课时',
                startCourse: '开始学习',
            },
            note: {
                title: '交易笔记',
                subtitle: '交易复盘',
                searchPlaceholder: '搜索笔记...',
                noData: '暂无笔记',
                noDataDesc: '记录您的交易',
                addNote: '添加笔记',
                pair: '交易对',
                entry: '入场价',
                exit: '出场价',
                pnl: '盈亏',
                date: '日期',
                grade: '评级',
            },
            tools: {
                title: '交易工具',
                subtitle: '专业工具',
                positionCalc: '仓位计算器',
                positionDesc: '基于风险计算仓位大小',
                riskReward: '盈亏比计算器',
                riskRewardDesc: '分析风险/回报场景',
                compound: '复利计算器',
                compoundDesc: '复利增长模拟',
                sessions: '市场时段',
                sessionsDesc: '全球交易时段',
                ruin: '爆仓概率',
                ruinDesc: '交易策略风险分析',
            },
            dashboard: {
                title: '仪表盘',
                subtitle: '概览',
                marketOverview: '市场概览',
                recentActivity: '最近活动',
                quickStats: '统计数据',
                price: '价格',
                change24h: '24小时变动',
                volume: '成交量',
            },
        },
    },
    en: {
        nav: {
            home: 'Home',
            dashboard: 'Dashboard',
            brief: 'Live Brief',
            analysis: 'Analysis',
            news: 'Market News',
            lab: 'Research Lab',
            note: 'Trading Notes',
            tools: 'Tools',
            about: 'About',
            logout: 'Log Out',
            profile: 'Profile',
            settings: 'Settings',
            login: 'Log In',
        },
        common: {
            search: 'Search',
            loading: 'Loading...',
            error: 'Error occurred',
            retry: 'Retry',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close',
        },
        trading: {
            buy: 'Buy',
            sell: 'Sell',
            long: 'Long',
            short: 'Short',
            leverage: 'Leverage',
            position: 'Position',
            position: 'Position',
            pnl: 'PnL',
        },
        auth: {
            title_signin: 'Welcome Back',
            title_signup: 'Create Account',
            subtitle_signin: 'Log in to continue your trading journey',
            subtitle_signup: 'Start your professional trading career',
            username: 'Username',
            username_placeholder: 'Your name',
            email: 'Email',
            email_placeholder: 'name@example.com',
            password: 'Password',
            password_placeholder: 'Enter password',
            signin_btn: 'Sign In',
            signup_btn: 'Sign Up',
            no_account: 'No account yet?',
            has_account: 'Already have an account?',
            go_signup: 'Join now',
            go_signin: 'Log in',
            error_required: 'Please fill in all required fields',
            error_username: 'Please enter a username',
            success_signup: 'Sign up successful! Please check your email for verification.',
            or: 'OR',
            features: {
                security: 'Bank-grade Security',
                realtime: 'Real-time Millisecond Data',
                ai: 'AI Trading Assistant'
            },
            mask: {
                title: 'Trade with Insight',
                desc: 'Log in to access in-depth market analysis, exclusive indicators, and trading strategies.',
                btn: 'Join Community / Login',
                features: ['In-depth Analysis', 'Custom Indicators', 'Trading Strategies', 'Community']
            },
        },
        intro: {
            subtitle: 'Professional Global Market Analysis & Strategy',
            desc: 'Data-driven market analysis, proprietary indicators, and practical trading education.'
        },
        time: {
            now: 'now',
            secondsAgo: '{n}s ago',
            minutesAgo: '{n}m ago',
            hoursAgo: '{n}h ago',
            daysAgo: '{n}d ago',
        },
        home: {
            badge: 'Professional Trading Research Platform',
            heroDesc: 'Real-time Market Info · In-depth Analysis · Systematic Learning · Trade Journal Tools',
            statBriefs: ' Briefs',
            statAnalysis: ' Analysis',
            statCourses: ' Courses',
            exploreModules: 'Explore Modules',
            recentBriefs: 'Latest Briefs',
            viewAll: 'View All',
            urgent: 'Urgent',
            important: 'Important',
            normal: 'Normal',
            footerText: 'Professional Crypto Trading Research Platform · Data-Driven Decisions',
            modules: {
                brief: {
                    title: 'Live Brief',
                    desc: 'Latest crypto market updates, get important info first'
                },
                analysis: {
                    title: 'Analysis Archive',
                    desc: 'In-depth market research, technical & on-chain data analysis'
                },
                news: {
                    title: 'Market News',
                    desc: 'Global crypto industry news, stay on top of trends'
                },
                lab: {
                    title: 'Research Lab',
                    desc: 'Systematic trading education, beginner to advanced'
                },
                note: {
                    title: 'Trading Notes',
                    desc: 'Trade journal and review, optimize your strategy'
                },
                tools: {
                    title: 'Trading Tools',
                    desc: 'Professional calculators and analysis tools'
                },
            },
            tools_ui: {
                entry: 'Entry',
                sl: 'Stop Loss',
                tp: 'Take Profit',
                size: 'Size',
                balance: 'Balance',
                risk: 'Risk',
                symbol: 'Symbol',
                target: 'Target',
                addAlert: 'Set',
                activeAlerts: 'Active Alerts',
                noAlerts: 'No Alerts',
                tradingTips: 'Trading Tips',
                tips: {
                    rrTitle: 'R:R Guide',
                    rr1: 'Min 1:2 recommended',
                    rr2: 'Scalping: 1:1.5 ~ 1:2',
                    rr3: 'Swing: 1:3+',
                    riskTitle: 'Risk Mgmt',
                    risk1: 'Risk 1-2% per trade',
                    risk2: 'Max daily loss 5%',
                    risk3: 'R:R > Win Rate',
                    posTitle: 'Position Mgmt',
                    pos1: 'Scale in/out',
                    pos2: 'Use trailing stops',
                    pos3: 'Avoid emotional trading',
                }
            },
            dashboard_ui: {
                marketStats: {
                    high: '24h High',
                    low: '24h Low',
                    vol: '24h Vol',
                    rank: 'Rank',
                    change: 'Change'
                },
                sections: {
                    markets: 'Markets',
                    positions: 'Positions',
                    orderBook: 'Order Book',
                    trades: 'Trades',
                    chart: 'Chart'
                },
                cols: {
                    symbol: 'Symbol',
                    price: 'Price',
                    change24h: '24h',
                    change7d: '7D',
                    side: 'Side',
                    size: 'Size',
                    entry: 'Entry',
                    mark: 'Mark',
                    pnl: 'PnL (ROE%)',
                    action: 'Action',
                    spread: 'Spread',
                    total: 'Total',
                    time: 'Time'
                },
                status: {
                    connected: 'Connected',
                    connecting: 'Connecting...',
                    secure: 'Secure',
                    server: 'Server',
                    live: 'LIVE'
                },
                account: {
                    simulation: 'Simulation',
                    balance: 'Balance',
                    equity: 'Equity',
                    usedMargin: 'Margin',
                    unrealized: 'Unrealized PnL',
                    cumulative: 'Total PnL',
                    winRate: 'Win Rate',
                    reset: 'Reset'
                },
                actions: {
                    trade: 'Trade',
                    close: 'Close',
                    closeAll: 'Close All',
                    search: 'Search...',
                    addToWatchlist: 'Watch',
                    removeFromWatchlist: 'Unwatch'
                },
                categories: {
                    all: 'All',
                    watchlist: 'Watchlist',
                    index: 'Index',
                    crypto: 'Crypto',
                    forex: 'Forex',
                    commodity: 'Commodity'
                },
                msg: {
                    noPositions: 'No open positions',
                    openPositionSuccess: 'Position opened',
                    pnlTotal: 'Total PnL'
                }
            },
            symbols: {
                'SPY': 'S&P 500', 'QQQ': 'Nasdaq 100', 'DIA': 'Dow Jones', 'NIKKEI': 'Nikkei 225', 'HSI': 'Hang Seng',
                'BTC/USDT': 'Bitcoin', 'ETH/USDT': 'Ethereum', 'SOL/USDT': 'Solana', 'XRP/USDT': 'Ripple',
                'GOLD': 'Gold', 'SILVER': 'Silver', 'WTI': 'WTI Crude', 'BRENT': 'Brent Crude',
                'EUR/USD': 'Euro/USD', 'GBP/USD': 'GBP/USD', 'USD/JPY': 'USD/JPY'
            },
        },
        views: {
            brief: {
                title: 'Live Brief',
                subtitle: 'Real-time Updates',
                searchPlaceholder: 'Search briefs...',
                noData: 'No briefs yet',
                noDataDesc: 'New briefs coming soon',
                all: 'All',
                urgent: 'Urgent',
                important: 'Important',
                normal: 'Normal',
            },
            analysis: {
                title: 'Analysis Archive',
                subtitle: 'Deep Research',
                searchPlaceholder: 'Search analysis...',
                noData: 'No analysis yet',
                noDataDesc: 'New analysis coming soon',
                featured: 'Featured',
                readMore: 'Read More',
                readTime: 'Read Time',
                author: 'Author',
            },
            news: {
                title: 'Market News',
                subtitle: 'Global Updates',
                searchPlaceholder: 'Search news...',
                noData: 'No news yet',
                noDataDesc: 'New news coming soon',
                breaking: 'Breaking',
                bullish: 'Bullish',
                bearish: 'Bearish',
                neutral: 'Neutral',
                source: 'Source',
            },
            lab: {
                title: 'Research Lab',
                subtitle: 'Trading Education',
                searchPlaceholder: 'Search courses...',
                noData: 'No courses yet',
                noDataDesc: 'New courses coming soon',
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
                lessons: 'Lessons',
                startCourse: 'Start Course',
            },
            note: {
                title: 'Trading Notes',
                subtitle: 'Trade Journal',
                searchPlaceholder: 'Search notes...',
                noData: 'No notes yet',
                noDataDesc: 'Record your trades',
                addNote: 'Add Note',
                pair: 'Pair',
                entry: 'Entry',
                exit: 'Exit',
                pnl: 'PnL',
                date: 'Date',
                grade: 'Grade',
            },
            tools: {
                title: 'Trading Tools',
                subtitle: 'Pro Tools',
                positionCalc: 'Position Calculator',
                positionDesc: 'Calculate position size based on risk',
                riskReward: 'Risk/Reward Calculator',
                riskRewardDesc: 'Analyze risk/reward scenarios',
                compound: 'Compound Calculator',
                compoundDesc: 'Compound growth simulation',
                sessions: 'Market Sessions',
                sessionsDesc: 'Global trading hours',
                ruin: 'Risk of Ruin',
                ruinDesc: 'Trading strategy risk analysis',
            },
            dashboard: {
                title: 'Dashboard',
                subtitle: 'Overview',
                marketOverview: 'Market Overview',
                recentActivity: 'Recent Activity',
                quickStats: 'Quick Stats',
                price: 'Price',
                change24h: '24h Change',
                volume: 'Volume',
            },
        },
    },
}

export function useI18n() {
    // If used outside of provider (rare case if we integrate into AppContext), safe fallback
    let context
    try {
        context = useAppState()
    } catch {
        // Fallback or error handled by React
    }

    const language = context?.language || 'ko'

    const t = useCallback((key, params = {}) => {
        const keys = key.split('.')
        let value = translations[language]

        for (const k of keys) {
            value = value?.[k]
            if (value === undefined) {
                // Fallback to KO if missing
                value = translations.ko
                for (const fallbackKey of keys) {
                    value = value?.[fallbackKey]
                }
                break
            }
        }

        if (value === undefined) return key

        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
        }

        return value
    }, [language])

    return {
        language,
        t,
        languages: Object.keys(translations),
    }
}

export function formatRelativeTime(date, lang = 'ko') {
    const now = new Date()
    const then = new Date(date)
    const diff = Math.floor((now - then) / 1000)

    const t = translations[lang]?.time || translations.ko.time

    if (diff < 10) return t.now
    if (diff < 60) return t.secondsAgo.replace('{n}', diff)
    if (diff < 3600) return t.minutesAgo.replace('{n}', Math.floor(diff / 60))
    if (diff < 86400) return t.hoursAgo.replace('{n}', Math.floor(diff / 3600))
    return t.daysAgo.replace('{n}', Math.floor(diff / 86400))
}

export default useI18n
