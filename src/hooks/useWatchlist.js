import { useState, useEffect, useCallback } from 'react'
import { useAppState } from '../context/AppContext'
import { db, TABLES } from '../lib/supabase'

/**
 * 自选列表Hook
 * 提供收藏、排序、持久化功能，支持云端同步
 */
export function useWatchlist() {
    const { user, isAuthenticated } = useAppState()
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem('watchlist')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    // 本地持久化
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }, [watchlist])

    // 云端同步：登录时拉取
    useEffect(() => {
        const fetchCloudWatchlist = async () => {
            if (!isAuthenticated || !user) return
            try {
                const profile = await db.getById(TABLES.PROFILES, user.id)
                if (profile && profile.watchlist && Array.isArray(profile.watchlist)) {
                    // 合并策略：这里简单采用云端覆盖本地，或者可以做并集
                    // 为简单起见，如果云端有数据，使用云端数据
                    if (profile.watchlist.length > 0) {
                        setWatchlist(profile.watchlist)
                    }
                }
            } catch (err) {
                console.warn('Failed to fetch cloud watchlist:', err)
                // 如果profile不存在，可能需要创建，或者只需在下次保存时创建/更新
            }
        }
        fetchCloudWatchlist()
    }, [isAuthenticated, user?.id])

    // 云端同步：更新时保存
    const syncToCloud = useCallback(async (newList) => {
        if (!isAuthenticated || !user) return
        try {
            // 尝试更新
            await db.update(TABLES.PROFILES, user.id, { watchlist: newList })
        } catch (err) {
            // 如果更新失败（例如记录不存在），尝试创建 (Upsert logic might be needed in db.update or handle here)
            // 由于supabase.js的update是简单的update，我们可能需要先check exists or use upsert if we modify supabase.js
            // 这里假设profiles行在注册时已创建。如果没有，我们尝试upsert via db.create if needed but ideally auth triggers create profile
            console.warn('Cloud sync failed:', err)
        }
    }, [isAuthenticated, user])

    // 添加到自选
    const addToWatchlist = useCallback((symbol) => {
        setWatchlist(prev => {
            if (prev.includes(symbol)) return prev
            const newList = [...prev, symbol]
            syncToCloud(newList)
            return newList
        })
    }, [syncToCloud])

    // 从自选移除
    const removeFromWatchlist = useCallback((symbol) => {
        setWatchlist(prev => {
            const newList = prev.filter(s => s !== symbol)
            syncToCloud(newList)
            return newList
        })
    }, [syncToCloud])

    // 切换自选状态
    const toggleWatchlist = useCallback((symbol) => {
        setWatchlist(prev => {
            let newList
            if (prev.includes(symbol)) {
                newList = prev.filter(s => s !== symbol)
            } else {
                newList = [...prev, symbol]
            }
            syncToCloud(newList)
            return newList
        })
    }, [syncToCloud])

    // 检查是否在自选中
    const isInWatchlist = useCallback((symbol) => {
        return watchlist.includes(symbol)
    }, [watchlist])

    // 重新排序（拖拽）
    const reorderWatchlist = useCallback((fromIndex, toIndex) => {
        setWatchlist(prev => {
            const result = [...prev]
            const [removed] = result.splice(fromIndex, 1)
            result.splice(toIndex, 0, removed)
            syncToCloud(result)
            return result
        })
    }, [syncToCloud])

    // 清空自选
    const clearWatchlist = useCallback(() => {
        setWatchlist([])
        syncToCloud([])
    }, [syncToCloud])

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        reorderWatchlist,
        clearWatchlist,
    }
}

export default useWatchlist
