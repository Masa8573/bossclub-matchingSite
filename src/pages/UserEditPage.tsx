import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/admin/AdminLayout'
import { UserForm } from '../components/admin/UserForm'
import { profilesApi } from '../lib/supabase'
import type { Profile, UserFormData } from '../types'

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
  }, [id])

  const fetchProfile = async () => {
    if (!id) return

    try {
      const { data, error } = await profilesApi.getProfessional(id)
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setError('ユーザー情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: UserFormData) => {
    if (!id) return

    setSubmitLoading(true)
    setError(null)

    try {
      const updateData = {
        role: formData.role,
        full_name: formData.full_name,
        organization: formData.organization,
        title: formData.title,
        bio: formData.bio,
        contact_email: formData.contact_email,
        phone_number: formData.phone_number
      }

      const { error } = await profilesApi.updateProfile(id, updateData)
      if (error) throw error

      navigate('/admin')
    } catch (err: any) {
      console.error('Failed to update user:', err)
      setError('ユーザーの更新に失敗しました: ' + (err.message || '不明なエラー'))
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="ユーザー編集">
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

  if (error || !profile) {
    return (
      <AdminLayout title="ユーザー編集">
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem', 
          padding: '1rem' 
        }}>
          <p style={{ color: '#991b1b', margin: 0 }}>
            {error || 'ユーザーが見つかりませんでした'}
          </p>
        </div>
      </AdminLayout>
    )
  }

  const initialData: Partial<UserFormData> = {
    email: '', // 編集時はメールアドレスは表示しない
    role: profile.role,
    full_name: profile.full_name,
    organization: profile.organization || '',
    title: profile.title || '',
    bio: profile.bio || '',
    contact_email: profile.contact_email || '',
    phone_number: profile.phone_number || ''
  }

  return (
    <AdminLayout title="ユーザー編集">
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
              ユーザー情報編集: {profile.full_name}
            </h2>
            <p style={{ 
              marginTop: '0.25rem', 
              fontSize: '0.875rem', 
              color: '#4b5563',
              margin: 0
            }}>
              ユーザーのプロフィール情報を編集します。
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
            initialData={initialData}
            onSubmit={handleSubmit}
            isEditing={true}
            loading={submitLoading}
          />
        </div>
      </div>
    </AdminLayout>
  )
}