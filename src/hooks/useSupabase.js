import { useState, useEffect, useCallback } from 'react'
import { db, TABLES } from '../lib/supabase'

// 通用数据获取 Hook
export function useSupabaseData(table, options = {}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await db.getAll(table, {
                orderBy: options.orderBy || 'created_at',
                ascending: options.ascending ?? false,
                limit: options.limit,
                filter: options.filter
            })
            setData(result || [])
        } catch (err) {
            console.error(`Error fetching ${table}:`, err)
            setError(err.message)
        }
        setLoading(false)
    }, [table, JSON.stringify(options)])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}

// 实况布里夫 Hook
export function useBriefs(options = {}) {
    return useSupabaseData(TABLES.BRIEFS, {
        orderBy: 'created_at',
        filter: options.onlyPublished !== false ? { is_published: true } : undefined,
        ...options
    })
}

// 分析文章 Hook
export function useAnalysis(options = {}) {
    return useSupabaseData(TABLES.ANALYSIS, {
        orderBy: 'created_at',
        filter: options.onlyPublished !== false ? { is_published: true } : undefined,
        ...options
    })
}

// 市场新闻 Hook
export function useNews(options = {}) {
    return useSupabaseData(TABLES.NEWS, {
        orderBy: 'created_at',
        filter: options.onlyPublished !== false ? { is_published: true } : undefined,
        ...options
    })
}

// 研究课程 Hook
export function useLabCourses(options = {}) {
    return useSupabaseData(TABLES.LAB_COURSES, {
        orderBy: 'order_index',
        ascending: true,
        filter: options.onlyPublished !== false ? { is_published: true } : undefined,
        ...options
    })
}

// 交易日志 Hook
export function useTradeNotes(options = {}) {
    return useSupabaseData(TABLES.TRADE_NOTES, {
        orderBy: 'trade_date',
        ...options
    })
}

// 获取推荐分析文章
export function useFeaturedAnalysis() {
    return useSupabaseData(TABLES.ANALYSIS, {
        orderBy: 'created_at',
        filter: { is_published: true, is_featured: true },
        limit: 1
    })
}

// 获取突发新闻
export function useBreakingNews() {
    return useSupabaseData(TABLES.NEWS, {
        orderBy: 'created_at',
        filter: { is_published: true, is_breaking: true },
        limit: 5
    })
}
