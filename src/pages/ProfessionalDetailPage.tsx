import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../components/common/Layout'
import { ReviewItem } from '../components/review/ReviewItem'
import { ReviewForm } from '../components/review/ReviewForm'
import { profilesApi, reviewsApi } from '../lib/supabase'
import type { Profile, Review } from '../types'

export const ProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [professional, setProfessional] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    if (!id) return

    try {
      setLoading(true)
      
      // 社会人情報を取得
      const { data: profData, error: profError } = await profilesApi.getProfessional(id)
      if (profError) throw profError
      setProfessional(profData)

      // レビュー情報を取得
      const { data: reviewData, error: reviewError } = await reviewsApi.getReviewsForProfessional(id)
      if (reviewError) throw reviewError
      setReviews(reviewData || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = () => {
    setShowReviewForm(false)
    fetchData() // レビューリストを再取得
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '16rem' 
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '2px solid #f3f4f6',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </Layout>
    )
  }

  if (error || !professional) {
    return (
      <Layout>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem', 
          padding: '1rem',
          margin: '1rem'
        }}>
          <p style={{ color: '#991b1b' }}>{error || '社会人が見つかりませんでした'}</p>
        </div>
      </Layout>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating_overall || 0), 0) / reviews.length 
    : 0

  return (
    <Layout>
      <div style={{ 
        maxWidth: '64rem', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        {/* プロフィール情報 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '1.5rem',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row'
          }}>
            <div style={{ flexShrink: 0 }}>
              {professional.avatar_url ? (
                <img
                  src={professional.avatar_url}
                  alt={professional.full_name}
                  style={{
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
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
                marginBottom: '1rem',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                gap: window.innerWidth < 768 ? '1rem' : '0'
              }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: '700', 
                  color: '#111827',
                  margin: 0
                }}>
                  {professional.full_name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        style={{ 
                          fontSize: '1.25rem',
                          color: star <= averageRating ? '#fbbf24' : '#d1d5db'
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    ({reviews.length}件のレビュー)
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                {professional.organization && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563', gap: '0.5rem' }}>
                    <span>🏢</span>
                    <span>{professional.organization}</span>
                  </div>
                )}
                {professional.title && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563', gap: '0.5rem' }}>
                    <span>👤</span>
                    <span>{professional.title}</span>
                  </div>
                )}
                {professional.contact_email && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563', gap: '0.5rem' }}>
                    <span>📧</span>
                    <a 
                      href={`mailto:${professional.contact_email}`} 
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
                    >
                      {professional.contact_email}
                    </a>
                  </div>
                )}
                {professional.phone_number && (
                  <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563', gap: '0.5rem' }}>
                    <span>📞</span>
                    <a 
                      href={`tel:${professional.phone_number}`} 
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
                    >
                      {professional.phone_number}
                    </a>
                  </div>
                )}
              </div>

              {professional.bio && (
                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#111827', 
                    marginBottom: '0.5rem' 
                  }}>
                    自己紹介
                  </h3>
                  <p style={{ 
                    color: '#374151', 
                    whiteSpace: 'pre-wrap' 
                  }}>
                    {professional.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #e5e7eb' 
          }}>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              {showReviewForm ? 'レビューを閉じる' : 'レビューを投稿する'}
            </button>
          </div>
        </div>

        {/* レビューフォーム */}
        {showReviewForm && (
          <div style={{ marginBottom: '2rem' }}>
            <ReviewForm
              professionalId={professional.id}
              onSubmit={handleReviewSubmit}
            />
          </div>
        )}

        {/* レビュー一覧 */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem' 
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '1.5rem' 
          }}>
            レビュー ({reviews.length}件)
          </h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: '#6b7280' }}>まだレビューがありません。</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}