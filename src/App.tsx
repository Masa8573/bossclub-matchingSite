import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProfessionalDetailPage } from './pages/ProfessionalDetailPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { UserCreatePage } from './pages/UserCreatePage'
import { UserEditPage } from './pages/UserEditPage'
import { ProtectedRoute } from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 公開ページ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
          
          {/* 管理者ページ */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/new" 
            element={
              <ProtectedRoute>
                <UserCreatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users/:id/edit" 
            element={
              <ProtectedRoute>
                <UserEditPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App