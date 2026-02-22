import { TooltipProvider } from '@/components/ui/tooltip'
import { RootLayout } from '@/components/layout'
import { HomePage } from '@/pages/home-page'
import './App.css'

function App() {
  return (
    <TooltipProvider>
      <RootLayout>
        <HomePage />
      </RootLayout>
    </TooltipProvider>
  )
}

export default App
