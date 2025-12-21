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
    PROFILES: 'profiles'
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
