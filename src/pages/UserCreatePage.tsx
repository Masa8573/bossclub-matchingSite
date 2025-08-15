import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import { UserForm } from '../components/admin/UserForm'
import { createUserWithProfile } from '../lib/supabase'
import type { UserFormData } from '../types'

export const UserCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (formData: UserFormData) => {

    if (!data.password) {
      alert('パスワードは必須です');
      return;
    setLoading(true)
    setError(null)

    try {
      const { error } = await createUserWithProfile(formData)
      if (error) throw error

      navigate('/admin')
    } catch (err: any) {
      console.error('Failed to create user:', err)
      setError('ユーザーの作成に失敗しました: ' + (err.message || '不明なエラー'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="ユーザー新規登録">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem' 
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '500', 
              color: '#111827', 
              margin: '0 0 0.25rem 0' 
            }}>
              新規ユーザー情報
            </h2>
            <p style={{ 
              marginTop: '0.25rem', 
              fontSize: '0.875rem', 
              color: '#4b5563',
              margin: 0
            }}>
              学生または社会人の新規ユーザーを登録します。
            </p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.375rem', 
              padding: '1rem', 
              marginBottom: '1.5rem' 
            }}>
              <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          <UserForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

