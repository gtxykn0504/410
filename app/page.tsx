import Link from "next/link"
import { AppWindow, Camera, Menu } from "lucide-react"
import { PhotoDialog, AppDialog } from "@/components/page-dialog"

export default function HomePage() {
  // 单个项目组件定义
  const ReportProject = () => (
    <AppDialog>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <AppWindow className="w-8 h-8 mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">App</h3>
          <p className="text-gray-600 text-sm">实用小软件</p>
        </div>
      </div>
    </AppDialog>
  )

  const ContactProject = () => (
    <PhotoDialog>
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md cursor-pointer">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <Camera className="w-8 h-8 mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">Photo</h3>
          <p className="text-gray-600 text-sm">图片服务</p>
        </div>
      </div>
    </PhotoDialog>
  )

  const LogProject = () => (
    <Link
      href="/log"
      className="group bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <Menu className="w-8 h-8 mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">Log</h3>
        <p className="text-gray-600 text-sm">班级日志</p>
      </div>
    </Link>
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 pt-20 sm:pt-0 pb-20 sm:pb-0">
      <div className="max-w-2xl w-full">
        {/* Title Section */}
        <div className="space-y-4 mb-12 text-left">
          <p className="text-lg text-gray-500 font-light">🧐Hello</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 tracking-tight leading-tight">
            At410
          </h1>
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
           一个班级项目，记录高中生活
          </p>
        </div>

        {/* Projects Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* Report Project */}
            <ReportProject />
            
            {/* Contact Project */}
            <ContactProject />
            
            {/* Log Project */}
            <LogProject />
          </div>
      </div>
    </main>
  )
}