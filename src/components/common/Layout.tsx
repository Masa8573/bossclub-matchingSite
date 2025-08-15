import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex justify-between items-center h-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to="/"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#2563eb', 
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}
              >
                👥 交流プラットフォーム
              </Link>
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link
                to="/"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  color: '#4b5563', 
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                🏠 ホーム
              </Link>
              <Link
                to="/admin/login"
                style={{ 
                  color: '#4b5563', 
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                管理者ログイン
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ flex: '1' }}>
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white" style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', marginTop: '3rem' }}>
        <div className="max-w-7xl mx-auto px-4 py-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ textAlign: 'center', color: '#4b5563' }}>
            <p>&copy; 2025 社会人・学生交流プラットフォーム. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}