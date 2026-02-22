import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header
        userName="Nguyễn Văn A"
        onViewProfile={() => console.log('View profile')}
        onLogout={() => console.log('Logout')}
        onLanguageChange={(lang) => console.log('Language:', lang)}
      />
      {children}
      <Footer />
    </div>
  )
}
