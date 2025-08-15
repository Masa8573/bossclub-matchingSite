import { useState } from 'react'
import { reviewsApi } from '../../lib/supabase'
import type { ReviewFormData } from '../../types'

interface ReviewFormProps {
  professionalId: string
  onSubmit: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ professionalId, onSubmit }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    comment: '',
    rating_overall: 5,
    rating_contact: 5,
    rating_talk: 5,
    rating_learning: 5,
    rating_future: 5,
    rating_satisfaction: 5,
    is_anonymous: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 仮のユーザーIDを使用（実際の実装では認証されたユーザーIDを使用）
      const tempUserId = 'temp-user-id'
      
      const reviewData = {
        reviewer_id: tempUserId,
        reviewee_id: professionalId,
        review_type: 's_to_p' as const,
        ...formData
      }

      const { error } = await reviewsApi.createReview(reviewData)
      if (error) throw error

      // フォームをリセット
      setFormData({
        comment: '',
        rating_overall: 5,
        rating_contact: 5,
        rating_talk: 5,
        rating_learning: 5,
        rating_future: 5,
        rating_satisfaction: 5,
        is_anonymous: false
      })

      onSubmit()
    } catch (err) {
      console.error('Failed to submit review:', err)
      setError('レビューの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (field: keyof ReviewFormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const RatingInput: React.FC<{ 
    label: string
    value: number
    onChange: (value: number) => void
  }> = ({ label, value, onChange }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: '500', 
        color: '#374151', 
        marginBottom: '0.5rem' 
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: rating <= value ? '#fbbf24' : '#d1d5db',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => {
              if (rating > value) e.currentTarget.style.color = '#fbbf24'
            }}
            onMouseOut={(e) => {
              if (rating > value) e.currentTarget.style.color = '#d1d5db'
            }}
          >
            ⭐
          </button>
        ))}
        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
          ({value}/5)
        </span>
      </div>
    </div>
  )

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      padding: '1.5rem' 
    }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        color: '#111827', 
        marginBottom: '1.5rem' 
      }}>
        レビューを投稿
      </h3>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem', 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', 
          gap: '1.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <RatingInput
            label="総合評価"
            value={formData.rating_overall}
            onChange={(value) => handleRatingChange('rating_overall', value)}
          />
          <RatingInput
            label="連絡のしやすさ"
            value={formData.rating_contact}
            onChange={(value) => handleRatingChange('rating_contact', value)}
          />
          <RatingInput
            label="話しやすさ"
            value={formData.rating_talk}
            onChange={(value) => handleRatingChange('rating_talk', value)}
          />
          <RatingInput
            label="学びの深さ"
            value={formData.rating_learning}
            onChange={(value) => handleRatingChange('rating_learning', value)}
          />
          <RatingInput
            label="今後の参考度"
            value={formData.rating_future}
            onChange={(value) => handleRatingChange('rating_future', value)}
          />
          <RatingInput
            label="満足度"
            value={formData.rating_satisfaction}
            onChange={(value) => handleRatingChange('rating_satisfaction', value)}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '0.5rem' 
          }}>
            詳細なコメント
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none',
              resize: 'vertical'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="交流の感想や具体的なフィードバックをお書きください..."
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
              style={{
                width: '1rem',
                height: '1rem',
                accentColor: '#2563eb'
              }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              匿名でレビューを投稿する
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'
            }}
          >
            {loading ? '投稿中...' : 'レビューを投稿'}
          </button>
        </div>
      </form>
    </div>
  )
}