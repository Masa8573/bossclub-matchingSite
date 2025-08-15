export interface Database {
    public: {
      Tables: {
        profiles: {
          Row: {
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
          Insert: {
            id: string
            role: 'student' | 'professional'
            full_name: string
            organization?: string | null
            title?: string | null
            bio?: string | null
            avatar_url?: string | null
            contact_email?: string | null
            phone_number?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            role?: 'student' | 'professional'
            full_name?: string
            organization?: string | null
            title?: string | null
            bio?: string | null
            avatar_url?: string | null
            contact_email?: string | null
            phone_number?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        reviews: {
          Row: {
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
          }
          Insert: {
            id?: number
            reviewer_id: string
            reviewee_id: string
            review_type: 's_to_p' | 'p_to_s'
            is_anonymous?: boolean
            comment?: string | null
            rating_overall?: number | null
            rating_contact?: number | null
            rating_talk?: number | null
            rating_learning?: number | null
            rating_future?: number | null
            rating_satisfaction?: number | null
            is_published?: boolean
            created_at?: string
          }
          Update: {
            id?: number
            reviewer_id?: string
            reviewee_id?: string
            review_type?: 's_to_p' | 'p_to_s'
            is_anonymous?: boolean
            comment?: string | null
            rating_overall?: number | null
            rating_contact?: number | null
            rating_talk?: number | null
            rating_learning?: number | null
            rating_future?: number | null
            rating_satisfaction?: number | null
            is_published?: boolean
            created_at?: string
          }
        }
      }
    }
  }