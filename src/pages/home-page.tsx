import { MenuGrid } from '@/components/menu-grid'
import { Search, CalendarDays } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function HomePage() {
  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <>
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Chào buổi sáng, <span className="text-primary italic">Mediplantex-ers!</span> 👋
              </h1>
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays className="size-4" />
                <span className="text-sm font-medium">{currentDate}</span>
              </div>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <Input
                placeholder="Tìm kiếm ứng dụng..."
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mediplantex App Hub</h2>
            <p className="text-slate-500 text-sm mt-1">Truy cập nhanh các ứng dụng phục trợ công việc của bạn.</p>
          </div>
        </div>

        <div className="space-y-12">
          <MenuGrid />
        </div>
      </main>
    </>
  )
}
