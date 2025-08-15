// src/lib/avatar.ts
import { supabase } from './supabase'

export interface AvatarUploadResult {
  success: boolean
  avatarUrl?: string
  error?: string
}

// 画像ファイルをアップロードする関数
export const uploadAvatar = async (file: File, userId: string): Promise<AvatarUploadResult> => {
  try {
    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'ファイルサイズは5MB以下にしてください' }
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '画像ファイルを選択してください' }
    }

    // ファイル名を生成（ユーザーIDと現在時刻）
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    // 既存のアバターを削除（もしあれば）
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list('', { search: userId })

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(file => file.name)
      await supabase.storage.from('avatars').remove(filesToDelete)
    }

    // 新しいファイルをアップロード
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    // 公開URLを取得
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return { success: true, avatarUrl: data.publicUrl }
  } catch (error) {
    console.error('Avatar upload failed:', error)
    return { success: false, error: 'アップロードに失敗しました' }
  }
}

// 画像を削除する関数
export const deleteAvatar = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list('', { search: userId })

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(file => file.name)
      const { error } = await supabase.storage.from('avatars').remove(filesToDelete)
      
      if (error) throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Avatar deletion failed:', error)
    return { success: false, error: '削除に失敗しました' }
  }
}
