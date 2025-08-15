import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import { profilesApi, reviewsApi } from '../lib/supabase'
import type { Profile, Review } from '../types'

export const AdminDashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [profilesResult, reviewsResult] = await Promise.all([
        profilesApi.getAllProfiles(),
        reviewsApi.getAllReviews()
      ])

      if (profilesResult.error) throw profilesResult.error
      if (reviewsResult.error) throw reviewsResult.error

      setProfiles(profilesResult.data || [])
      setReviews(reviewsResult.data || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProfile = async (id: string) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return

    try {
      const { error } = await profilesApi.deleteProfile(id)
      if (error) throw error
      
      setProfiles(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete profile:', err)
      alert('ユーザーの削除に失敗しました')
    }
  }

  const handleToggleReviewVisibility = async (reviewId: number, currentStatus: boolean) => {
    try {
      const { error } = await reviewsApi.updateReviewPublishStatus(reviewId, !currentStatus)
      if (error) throw error
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, is_published: !currentStatus }
          : review
      ))
    } catch (err) {
      console.error('Failed to update review status:', err)
      alert('レビューの公開状態の更新に失敗しました')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem', 
          padding: '1rem' 
        }}>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      </AdminLayout>
    )
  }

  const students = profiles.filter(p => p.role === 'student')
  const professionals = profiles.filter(p => p.role === 'professional')

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }

  return (
    <AdminLayout title="ダッシュボード">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 統計情報 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                fontSize: '1.5rem'
              }}>
                👥
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>
                  総ユーザー数
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {profiles.length}
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: '#d1fae5',
                borderRadius: '0.5rem',
                fontSize: '1.5rem'
              }}>
                🎓
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>
                  学生数
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: '#e0e7ff',
                borderRadius: '0.5rem',
                fontSize: '1.5rem'
              }}>
                💼
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>
                  社会人数
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {professionals.length}
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                fontSize: '1.5rem'
              }}>
                📝
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>
                  レビュー数
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ユーザー一覧 */}
        <div style={cardStyle}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 0 1rem 0', 
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
              ユーザー一覧
            </h2>
            <Link
              to="/admin/users/new"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              新規ユーザー追加
            </Link>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    ユーザー
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    役割
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    所属
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    連絡先
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {profiles.map((profile) => (
                  <tr key={profile.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flexShrink: 0 }}>
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              style={{
                                height: '2.5rem',
                                width: '2.5rem',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              height: '2.5rem',
                              width: '2.5rem',
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
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                            {profile.full_name}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {profile.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: profile.role === 'student' ? '#d1fae5' : '#dbeafe',
                        color: profile.role === 'student' ? '#065f46' : '#1e40af'
                      }}>
                        {profile.role === 'student' ? '学生' : '社会人'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {profile.organization}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {profile.contact_email}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/admin/users/${profile.id}/edit`}
                          style={{ color: '#2563eb', textDecoration: 'none' }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          style={{
                            color: '#dc2626',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#991b1b'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* レビュー管理 */}
        <div style={cardStyle}>
          <div style={{ 
            padding: '0 0 1rem 0', 
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>
              レビュー管理
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    レビュアー
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    対象者
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    評価
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    投稿日
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    公開状態
                  </th>
                  <th style={{ 
                    padding: '0.75rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase' 
                  }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {reviews.map((review) => (
                  <tr key={review.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>
                      {review.reviewer?.full_name || '削除されたユーザー'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>
                      {review.reviewee?.full_name || '削除されたユーザー'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {review.rating_overall ? `${review.rating_overall}/5` : '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(review.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: review.is_published ? '#d1fae5' : '#fef2f2',
                        color: review.is_published ? '#065f46' : '#991b1b'
                      }}>
                        {review.is_published ? '公開' : '非公開'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      <button
                        onClick={() => handleToggleReviewVisibility(review.id, review.is_published)}
                        style={{
                          color: '#2563eb',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
                      >
                        {review.is_published ? '👁️‍🗨️' : '👁️'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}