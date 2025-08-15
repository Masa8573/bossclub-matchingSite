import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 管理者認証用のヘルパー関数
export const signInAsAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// ログアウト関数
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 認証状態チェック関数
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// プロフィール関連のAPI関数
export const profilesApi = {
  // 社会人一覧を取得
  getProfessionals: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'professional')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // 特定の社会人詳細を取得
  getProfessional: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // 全ユーザー一覧を取得（管理者用）
  getAllProfiles: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // プロフィールを作成
  createProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  },

  // プロフィールを更新
  updateProfile: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // プロフィールを削除
  deleteProfile: async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// レビュー関連のAPI関数
export const reviewsApi = {
  // 特定の社会人へのレビューを取得
  getReviewsForProfessional: async (professionalId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
      `)
      .eq('reviewee_id', professionalId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // レビューを投稿
  createReview: async (review: any) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()
    return { data, error }
  },

  // 全レビューを取得（管理者用）
  getAllReviews: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name),
        reviewee:profiles!reviews_reviewee_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // レビューの公開状態を更新
  updateReviewPublishStatus: async (id: number, is_published: boolean) => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_published })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// 管理者用ユーザー作成関数
export const createUserWithProfile = async (userData: {
  email: string
  password: string
  role: 'student' | 'professional'
  full_name: string
  organization?: string
  title?: string
  bio?: string
  contact_email?: string
  phone_number?: string
}) => {
  try {
    // 1. 認証ユーザーを作成
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    })

    if (authError) throw authError

    // 2. プロフィールを作成
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        role: userData.role,
        full_name: userData.full_name,
        organization: userData.organization,
        title: userData.title,
        bio: userData.bio,
        contact_email: userData.contact_email,
        phone_number: userData.phone_number,
      })
      .select()
      .single()

    if (profileError) throw profileError

    return { data: { user: authData.user, profile: profileData }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
