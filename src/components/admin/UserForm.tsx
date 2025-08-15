import { useState } from 'react'
import type { UserFormData } from '../../types'

interface UserFormProps {
  initialData?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => Promise<void>
  isEditing?: boolean
  loading?: boolean
}

export const UserForm: React.FC<UserFormProps> = ({ 
  initialData, 
  onSubmit, 
  isEditing = false, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'student',
    full_name: initialData?.full_name || '',
    organization: initialData?.organization || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    contact_email: initialData?.contact_email || '',
    phone_number: initialData?.phone_number || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'メールアドレスは必須です'
    if (!isEditing && !formData.password) newErrors.password = 'パスワードは必須です'
    if (!formData.full_name) newErrors.full_name = '氏名は必須です'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const inputStyle = (hasError: boolean = false) => ({
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none'
  })

  const labelStyle = {
    display: 'block' as const,
    fontSize: '0.875rem',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '0.5rem'
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', 
        gap: '1.5rem' 
      }}>
        {/* メールアドレス */}
        <div>
          <label style={labelStyle}>
            メールアドレス *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={inputStyle(!!errors.email)}
            onFocus={(e) => {
              if (!errors.email) {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }
            }}
            onBlur={(e) => {
              if (!errors.email) {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }
            }}
            placeholder="user@example.com"
          />
          {errors.email && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* パスワード */}
        <div>
          <label style={labelStyle}>
            パスワード {!isEditing && '*'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            style={inputStyle(!!errors.password)}
            onFocus={(e) => {
              if (!errors.password) {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }
            }}
            onBlur={(e) => {
              if (!errors.password) {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }
            }}
            placeholder={isEditing ? '変更する場合のみ入力' : 'パスワード'}
          />
          {errors.password && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* 役割 */}
        <div>
          <label style={labelStyle}>
            役割 *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value as 'student' | 'professional')}
            style={inputStyle()}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
          >
            <option value="student">学生</option>
            <option value="professional">社会人</option>
          </select>
        </div>

        {/* 氏名 */}
        <div>
          <label style={labelStyle}>
            氏名 *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            style={inputStyle(!!errors.full_name)}
            onFocus={(e) => {
              if (!errors.full_name) {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }
            }}
            onBlur={(e) => {
              if (!errors.full_name) {
                e.target.style.borderColor = '#d1d5db'
                e.target.style.boxShadow = 'none'
              }
            }}
            placeholder="山田太郎"
          />
          {errors.full_name && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
              {errors.full_name}
            </p>
          )}
        </div>

        {/* 所属 */}
        <div>
          <label style={labelStyle}>
            所属
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            style={inputStyle()}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="〇〇大学 / 株式会社〇〇"
          />
        </div>

        {/* 役職・学年 */}
        <div>
          <label style={labelStyle}>
            役職・学年
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            style={inputStyle()}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="3年生 / エンジニア"
          />
        </div>

        {/* 連絡先メール */}
        <div>
          <label style={labelStyle}>
            連絡先メールアドレス
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
            style={inputStyle()}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="contact@example.com"
          />
        </div>

        {/* 電話番号 */}
        <div>
          <label style={labelStyle}>
            電話番号
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            style={inputStyle()}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb'
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="090-1234-5678"
          />
        </div>
      </div>

      {/* 自己紹介 */}
      <div>
        <label style={labelStyle}>
          自己紹介
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          style={{
            ...inputStyle(),
            resize: 'vertical' as const
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#2563eb'
            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db'
            e.target.style.boxShadow = 'none'
          }}
          placeholder="自己紹介や専門分野について記載してください..."
        />
      </div>

      {/* 送信ボタン */}
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
          {loading ? '保存中...' : (isEditing ? '更新' : '作成')}
        </button>
      </div>
    </form>
  )
}