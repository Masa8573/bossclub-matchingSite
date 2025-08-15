// src/components/common/AvatarUpload.tsx
import { useState, useRef } from 'react'
import { uploadAvatar, deleteAvatar } from '../../lib/avatar'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userId: string
  onAvatarChange: (avatarUrl: string | null) => void
  disabled?: boolean
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userId,
  onAvatarChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const result = await uploadAvatar(file, userId)
      
      if (result.success && result.avatarUrl) {
        onAvatarChange(result.avatarUrl)
      } else {
        setError(result.error || 'アップロードに失敗しました')
      }
    } catch (err) {
      setError('アップロードに失敗しました')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm('プロフィール画像を削除しますか？')) return

    setUploading(true)
    setError(null)

    try {
      const result = await deleteAvatar(userId)
      
      if (result.success) {
        onAvatarChange(null)
      } else {
        setError(result.error || '削除に失敗しました')
      }
    } catch (err) {
      setError('削除に失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* アバター表示 */}
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '8rem',
          height: '8rem',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px dashed #d1d5db',
          cursor: disabled ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          transition: 'border-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!disabled) e.currentTarget.style.borderColor = '#2563eb'
        }}
        onMouseOut={(e) => {
          if (!disabled) e.currentTarget.style.borderColor = '#d1d5db'
        }}
      >
        {uploading ? (
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #f3f4f6',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        ) : currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="プロフィール画像"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280'
          }}>
            <span style={{ fontSize: '2rem' }}>📷</span>
            <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>
              クリックして<br />画像を選択
            </span>
          </div>
        )}

        {/* アップロード中のオーバーレイ */}
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid #f3f4f6',
              borderTop: '2px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}
      </div>

      {/* ボタン */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || uploading}
          style={{
            backgroundColor: disabled || uploading ? '#9ca3af' : '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: disabled || uploading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (!disabled && !uploading) e.currentTarget.style.backgroundColor = '#1d4ed8'
          }}
          onMouseOut={(e) => {
            if (!disabled && !uploading) e.currentTarget.style.backgroundColor = '#2563eb'
          }}
        >
          {currentAvatarUrl ? '画像を変更' : '画像を選択'}
        </button>

        {currentAvatarUrl && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={disabled || uploading}
            style={{
              backgroundColor: disabled || uploading ? '#9ca3af' : '#dc2626',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: disabled || uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!disabled && !uploading) e.currentTarget.style.backgroundColor = '#991b1b'
            }}
            onMouseOut={(e) => {
              if (!disabled && !uploading) e.currentTarget.style.backgroundColor = '#dc2626'
            }}
          >
            削除
          </button>
        )}
      </div>

      {/* ファイル入力（非表示） */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* エラーメッセージ */}
      {error && (
        <p style={{ 
          color: '#dc2626', 
          fontSize: '0.875rem', 
          textAlign: 'center',
          margin: 0
        }}>
          {error}
        </p>
      )}

      {/* 注意事項 */}
      <p style={{ 
        fontSize: '0.75rem', 
        color: '#6b7280', 
        textAlign: 'center',
        margin: 0
      }}>
        JPG、PNG形式、5MB以下
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
