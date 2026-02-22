import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RootLayout } from '@/components/layout'
import { DashboardLayout } from '@/components/dashboard-layout'
import { HomePage } from '@/pages/home-page'
import { AdminDashboard } from '@/pages/admin-dashboard'
import './App.css'

export type UserRole = "SYSTEM-ADMIN" | "MANAGER" | "STAFF"

function App() {
  const [role, setRole] = useState<UserRole>("STAFF")

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          {/* Public Home Page with RootLayout */}
          <Route 
            path="/" 
            element={
              <RootLayout 
                userRole={role} 
                onRoleChange={(newRole) => setRole(newRole)}
              >
                <HomePage userRole={role} />
              </RootLayout>
            } 
          />

          {/* Admin Section with DashboardLayout */}
          <Route 
            path="/gateway-control/*" 
            element={
              role !== "STAFF" ? (
                <DashboardLayout 
                  userRole={role} 
                  onRoleChange={(newRole) => setRole(newRole)}
                >
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="registry" element={<div className="p-10 font-bold bg-white m-6 rounded-3xl border shadow-sm">App Registry Management Module</div>} />
                    <Route path="rbac" element={<div className="p-10 font-bold bg-white m-6 rounded-3xl border shadow-sm">Role Based Access Control Console</div>} />
                    <Route path="hr" element={<div className="p-10 font-bold bg-white m-6 rounded-3xl border shadow-sm">Personnel & Teams Directory</div>} />
                    <Route path="settings" element={<div className="p-10 font-bold bg-white m-6 rounded-3xl border shadow-sm">Global System Configuration</div>} />
                  </Routes>
                </DashboardLayout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
