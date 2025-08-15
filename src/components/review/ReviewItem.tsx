import type { Review } from '../../types'

interface ReviewItemProps {
  review: Review
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const StarRating: React.FC<{ rating: number | null; label: string }> = ({ rating, label }) => {
    if (!rating) return null
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontSize: '0.875rem' 
      }}>
        <span style={{ color: '#4b5563', width: '5rem' }}>{label}:</span>
        <div style={{ display: 'flex', color: '#fbbf24' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ 
                fontSize: '1rem',
                color: star <= rating ? '#fbbf24' : '#d1d5db'
              }}
            >
              ⭐
            </span>
          ))}
        </div>
        <span style={{ color: '#4b5563' }}>({rating}/5)</span>
      </div>
    )
  }

  return (
    <div style={{ 
      borderBottom: '1px solid #e5e7eb', 
      paddingBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flexShrink: 0 }}>
          {!review.is_anonymous && review.reviewer?.avatar_url ? (
            <img
              src={review.reviewer.avatar_url}
              alt="レビュアー"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              👤
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            gap: window.innerWidth < 768 ? '0.5rem' : '0'
          }}>
            <div>
              <span style={{ fontWeight: '500', color: '#111827' }}>
                {review.is_anonymous ? '匿名ユーザー' : review.reviewer?.full_name || '不明なユーザー'}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                {formatDate(review.created_at)}
              </span>
            </div>
            
            {review.rating_overall && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{ 
                        fontSize: '1rem',
                        color: star <= review.rating_overall! ? '#fbbf24' : '#d1d5db'
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  ({review.rating_overall}/5)
                </span>
              </div>
            )}
          </div>

          {review.comment && (
            <p style={{ 
              color: '#374151', 
              marginBottom: '1rem', 
              whiteSpace: 'pre-wrap' 
            }}>
              {review.comment}
            </p>
          )}

          {/* 詳細評価 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', 
            gap: '0.5rem', 
            fontSize: '0.875rem' 
          }}>
            <StarRating rating={review.rating_contact} label="連絡" />
            <StarRating rating={review.rating_talk} label="話しやすさ" />
            <StarRating rating={review.rating_learning} label="学び" />
            <StarRating rating={review.rating_future} label="参考度" />
            <StarRating rating={review.rating_satisfaction} label="満足度" />
          </div>
        </div>
      </div>
    </div>
  )
}
