import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
                M
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Mediplantex</span>
            </div>
            <p className="text-sm font-bold text-slate-800 uppercase leading-relaxed">
              CÔNG TY CỔ PHẦN DƯỢC TRUNG ƯƠNG MEDIPLANTEX
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Tiền thân là Công ty Thuốc Nam Thuốc Bắc Trung ương, với hơn 50 năm kinh nghiệm trong ngành dược phẩm, chuyên sản xuất dược phẩm, dược liệu và xuất nhập khẩu.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span>358 Giải Phóng, Phương Liệt, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="size-4 text-primary shrink-0" />
                <span>(024) 3668.6111</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="size-4 text-primary shrink-0" />
                <span>info@mediplantex.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Globe className="size-4 text-primary shrink-0" />
                <a href="http://www.mediplantex.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                  www.mediplantex.com
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Factories & Branches */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hệ thống sản xuất</h4>
            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Nhà máy dược phẩm số 1</p>
                <p className="text-xs">358 Giải Phóng, Thanh Xuân, Hà Nội</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Nhà máy dược phẩm số 2</p>
                <p className="text-xs">KCN Quang Minh, Mê Linh, Hà Nội (Đạt chuẩn GMP-WHO)</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-60" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 Mediplantex National Pharmaceutical JSC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

      {/* Version Footer */}
      <div className="bg-slate-900 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">System Status: Operational</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
            Platform Version <span className="text-slate-300">v2.4.0-build.8192</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
