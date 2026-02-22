import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface RootLayoutProps {
  children: React.ReactNode
  userRole: "SYSTEM-ADMIN" | "MANAGER" | "STAFF"
  onRoleChange: (role: "SYSTEM-ADMIN" | "MANAGER" | "STAFF") => void
}

export function RootLayout({ children, userRole, onRoleChange }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header
        userName="Nguyễn Văn A"
        userRole={userRole}
        onRoleChange={onRoleChange}
        onViewProfile={() => console.log('View profile')}
        onLogout={() => console.log('Logout')}
        onLanguageChange={(lang) => console.log('Language:', lang)}
      />
      {children}
      <Footer />
    </div>
  )
}
