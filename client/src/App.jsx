import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import CarsPage from './pages/CarsPage'
import ReportsPage from './pages/ReportsPage'
import Login from './pages/Login'

// --- PROTECTION ---
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children, isSidebarOpen, toggleSidebar, closeSidebar }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block"><Sidebar /></div>
      <div className={`fixed inset-0 z-40 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeSidebar}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4">
          <Sidebar onLinkClick={closeSidebar} />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected - All need token */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar}>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/cars" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar}>
              <CarsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <AppLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar}>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
export default App