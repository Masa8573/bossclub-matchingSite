// データベースの型定義
export interface Profile {
  id: string
  role: 'student' | 'professional'
  full_name: string
  organization: string | null
  title: string | null
  bio: string | null
  avatar_url: string | null
  contact_email: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  reviewer_id: string
  reviewee_id: string
  review_type: 's_to_p' | 'p_to_s'
  is_anonymous: boolean
  comment: string | null
  rating_overall: number | null
  rating_contact: number | null
  rating_talk: number | null
  rating_learning: number | null
  rating_future: number | null
  rating_satisfaction: number | null
  is_published: boolean
  created_at: string
  reviewer?: {
    full_name: string
    avatar_url: string | null
  }
  reviewee?: {
    full_name: string
  }
}

// フォームの型定義
export interface ReviewFormData {
  comment: string
  rating_overall: number
  rating_contact: number
  rating_talk: number
  rating_learning: number
  rating_future: number
  rating_satisfaction: number
  is_anonymous: boolean
}

export interface UserFormData {
  email: string
  password?: string
  role: 'student' | 'professional'
  full_name: string
  organization: string
  title: string
  bio: string
  contact_email: string
  phone_number: string
}

// Supabase Database型定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
    }
  }
}