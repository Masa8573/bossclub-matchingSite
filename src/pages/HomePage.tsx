import { useEffect, useState } from 'react'
import { Layout } from '../components/common/Layout'
import { ProfessionalCard } from '../components/professional/ProfessionalCard'
import { profilesApi } from '../lib/supabase'
import type { Profile } from '../types'

export const HomePage: React.FC = () => {
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await profilesApi.getProfessionals()
      if (error) throw error
      setProfessionals(data || [])
    } catch (err) {
      console.error('Failed to fetch professionals:', err)
      setError('社会人の情報を取得できませんでした')
    } finally {
      setLoading(false)
    }
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

  if (error) {
    return (
      <Layout>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem', 
          padding: '1rem',
          margin: '1rem'
        }}>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '1rem' 
          }}>
            社会人・学生交流プラットフォーム
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563', 
            maxWidth: '48rem', 
            margin: '0 auto' 
          }}>
            社会人と学生が交流し、お互いにレビューを行うことで、
            実践的なキャリア観と貢献・発見の機会を提供します。
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1.5rem' 
          }}>
            登録社会人一覧 ({professionals.length}名)
          </h2>
        </div>

        {professionals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#6b7280' }}>まだ登録された社会人がいません。</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {professionals.map((professional) => (
              <ProfessionalCard 
                key={professional.id} 
                profile={professional} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}