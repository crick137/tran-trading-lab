import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pikvpypivivzhmoyeipd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3ZweXBpdml2emhtb3llaXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzUxOTYsImV4cCI6MjA4MDM1MTE5Nn0.GqWNIbdhXD5yHuYrzD7MB-dcliWIO0LXlH9qa5cLIGk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 存储桶名称
const STORAGE_BUCKET = 'images'

// 图片上传功能
export const storage = {
    // 上传图片
    async uploadImage(file, folder = 'uploads') {
        if (!file) return null

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            throw new Error('不支持的图片格式，请上传 JPG、PNG、GIF 或 WebP 格式')
        }

        // 验证文件大小 (最大 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            throw new Error('图片大小不能超过 5MB')
        }

        // 生成唯一文件名
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = file.name.split('.').pop()
        const fileName = `${folder}/${timestamp}_${randomStr}.${ext}`

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('上传失败:', error)
            throw new Error('图片上传失败: ' + error.message)
        }

        // 返回公开URL
        const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path)

        return urlData.publicUrl
    },

    // 删除图片
    async deleteImage(url) {
        if (!url) return

        try {
            // 从URL提取路径
            const urlObj = new URL(url)
            const path = urlObj.pathname.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`)[1]
            if (path) {
                await supabase.storage.from(STORAGE_BUCKET).remove([path])
            }
        } catch (err) {
            console.warn('删除图片失败:', err)
        }
    },

    // 获取图片公开URL
    getPublicUrl(path) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
        return data.publicUrl
    }
}

// 通用CRUD操作
export const db = {
    // 获取所有记录
    async getAll(table, options = {}) {
        let query = supabase.from(table).select('*')

        if (options.orderBy) {
            query = query.order(options.orderBy, { ascending: options.ascending ?? false })
        }
        if (options.limit) {
            query = query.limit(options.limit)
        }
        if (options.filter) {
            Object.entries(options.filter).forEach(([key, value]) => {
                query = query.eq(key, value)
            })
        }

        const { data, error } = await query
        if (error) throw error
        return data
    },

    // 获取单条记录
    async getById(table, id) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    },

    // 创建记录
    async create(table, data) {
        const { data: result, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single()
        if (error) throw error
        return result
    },

    // 更新记录
    async update(table, id, data) {
        const { data: result, error } = await supabase
            .from(table)
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        return result
    },

    // 删除记录
    async delete(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)
        if (error) throw error
        return true
    },

    // 批量删除
    async deleteMany(table, ids) {
        const { error } = await supabase
            .from(table)
            .delete()
            .in('id', ids)
        if (error) throw error
        return true
    },

    // 切换发布状态
    async togglePublish(table, id, currentStatus) {
        return this.update(table, id, { is_published: !currentStatus })
    }
}

// 表名常量
export const TABLES = {
    BRIEFS: 'briefs',
    ANALYSIS: 'analysis',
    NEWS: 'news',
    LAB_COURSES: 'lab_courses',
    TRADE_NOTES: 'trade_notes',
    PROFILES: 'profiles',
    ARTICLE_LIKES: 'article_likes',
    ARTICLE_COMMENTS: 'article_comments',
    ARTICLE_BOOKMARKS: 'article_bookmarks',
}

// Authentication Helpers
export const auth = {
    // Sign Up
    async signUp(email, password, metadata = {}) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        })
        if (error) throw error
        return data
    },

    // Sign In
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    },

    // Sign Out
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return true
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data.session
    },

    // Get current user
    async getUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error) return null
        return data.user
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    },

    // 🆕 Password Reset - Send reset email
    async resetPassword(email, redirectTo = window.location.origin + '/reset-password') {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo
        })
        if (error) throw error
        return data
    },

    // 🆕 Update Password (after reset or for logged-in user)
    async updatePassword(newPassword) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })
        if (error) throw error
        return data
    },

    // 🆕 Resend verification email
    async resendVerificationEmail(email) {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email
        })
        if (error) throw error
        return data
    },

    // 🆕 Refresh session
    async refreshSession() {
        const { data, error } = await supabase.auth.refreshSession()
        if (error) throw error
        return data.session
    },

    // 🆕 Update user metadata
    async updateProfile(metadata) {
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        })
        if (error) throw error
        return data.user
    },

    // 🆕 OAuth Sign In (Google, GitHub, etc.)
    async signInWithOAuth(provider, options = {}) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
                ...options
            }
        })
        if (error) throw error
        return data
    }
}

// 文章互动功能
export const interactions = {
    // ========== 点赞功能 ==========

    // 切换点赞状态（点赞/取消点赞）
    async toggleLike(articleId, userId) {
        const hasLiked = await this.hasLiked(articleId, userId)

        if (hasLiked) {
            // 取消点赞
            const { error } = await supabase
                .from(TABLES.ARTICLE_LIKES)
                .delete()
                .eq('article_id', articleId)
                .eq('user_id', userId)
            if (error) throw error
            return { liked: false }
        } else {
            // 添加点赞
            const { error } = await supabase
                .from(TABLES.ARTICLE_LIKES)
                .insert({ article_id: articleId, user_id: userId })
            if (error) throw error
            return { liked: true }
        }
    },

    // 检查是否已点赞
    async hasLiked(articleId, userId) {
        if (!userId) return false
        const { data, error } = await supabase
            .from(TABLES.ARTICLE_LIKES)
            .select('id')
            .eq('article_id', articleId)
            .eq('user_id', userId)
            .single()
        return !error && !!data
    },

    // 获取点赞数
    async getLikeCount(articleId) {
        const { count, error } = await supabase
            .from(TABLES.ARTICLE_LIKES)
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId)
        if (error) return 0
        return count || 0
    },

    // ========== 评论功能 ==========

    // 添加评论
    async addComment(articleId, userId, username, content) {
        const { data, error } = await supabase
            .from(TABLES.ARTICLE_COMMENTS)
            .insert({
                article_id: articleId,
                user_id: userId,
                username,
                content
            })
            .select()
            .single()
        if (error) throw error
        return data
    },

    // 获取评论列表
    async getComments(articleId) {
        const { data, error } = await supabase
            .from(TABLES.ARTICLE_COMMENTS)
            .select('*')
            .eq('article_id', articleId)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data || []
    },

    // 删除评论（只能删除自己的）
    async deleteComment(commentId, userId) {
        const { error } = await supabase
            .from(TABLES.ARTICLE_COMMENTS)
            .delete()
            .eq('id', commentId)
            .eq('user_id', userId)
        if (error) throw error
        return true
    },

    // 获取评论数
    async getCommentCount(articleId) {
        const { count, error } = await supabase
            .from(TABLES.ARTICLE_COMMENTS)
            .select('*', { count: 'exact', head: true })
            .eq('article_id', articleId)
        if (error) return 0
        return count || 0
    },

    // ========== 收藏功能 ==========

    // 切换收藏状态
    async toggleBookmark(articleId, userId) {
        const hasBookmarked = await this.hasBookmarked(articleId, userId)

        if (hasBookmarked) {
            const { error } = await supabase
                .from(TABLES.ARTICLE_BOOKMARKS)
                .delete()
                .eq('article_id', articleId)
                .eq('user_id', userId)
            if (error) throw error
            return { bookmarked: false }
        } else {
            const { error } = await supabase
                .from(TABLES.ARTICLE_BOOKMARKS)
                .insert({ article_id: articleId, user_id: userId })
            if (error) throw error
            return { bookmarked: true }
        }
    },

    // 检查是否已收藏
    async hasBookmarked(articleId, userId) {
        if (!userId) return false
        const { data, error } = await supabase
            .from(TABLES.ARTICLE_BOOKMARKS)
            .select('id')
            .eq('article_id', articleId)
            .eq('user_id', userId)
            .single()
        return !error && !!data
    },

    // 获取用户的收藏列表
    async getUserBookmarks(userId) {
        const { data, error } = await supabase
            .from(TABLES.ARTICLE_BOOKMARKS)
            .select(`
                id,
                article_id,
                created_at,
                analysis:article_id (id, title, summary, image_url, created_at)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data || []
    }
}

