import Link from "next/link"
import { FileText, Users, Shuffle, Eye, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 pt-32 pb-16 sm:px-8 pt-4">
      <div className="max-w-4xl w-full">
        {/* Title Section */}
        <div className="space-y-3 mb-16 text-left">
          <p className="text-base text-gray-500 font-light">🧐 Hello</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-tight">
            At410
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            一个班级项目，记录高中生活
          </p>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* 410 Report*/}
          <a 
            href="https://410report.ofhe.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-gray-200 bg-white hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-center items-center h-32 bg-gradient-to-br from-blue-50 to-blue-100">
              <FileText className="w-14 h-14 text-blue-500 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">410 Report</h3>
              <div className="flex gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">工具</span>
                <span className="px-2 py-1 text-xs bg-sky-100 text-sky-800 rounded">Next.js</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">每日总结文案生成器</p>
            </div>
          </a>

          {/* Face Random Selector */}
          <a 
            href="/facerandom"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-gray-200 bg-white hover:border-purple-300 transition-colors"
          >
            <div className="flex justify-center items-center h-32 bg-gradient-to-br from-purple-50 to-purple-100">
              <Users className="w-14 h-14 text-purple-500 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Face Random Selector</h3>
              <div className="flex gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">工具</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Python</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">人脸随机选择工具</p>
            </div>
          </a>

          {/* Random Image */}
          <a 
            href="/random"
            className="group block border border-gray-200 bg-white hover:border-green-300 transition-colors"
          >
            <div className="flex justify-center items-center h-32 bg-gradient-to-br from-green-50 to-green-100">
              <Shuffle className="w-14 h-14 text-green-500 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Random Image</h3>
              <div className="flex gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">图片</span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">PHP</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">随机图片服务</p>
            </div>
          </a>

          {/* Eye Game */}
          <a 
            href="/eye"
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-gray-200 bg-white hover:border-yellow-300 transition-colors"
          >
            <div className="flex justify-center items-center h-32 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <Eye className="w-14 h-14 text-yellow-500 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Eye Game</h3>
              <div className="flex gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">图片</span>
                <span className="px-2 py-1 text-xs bg-sky-100 text-sky-800 rounded">Next.js</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">慧眼识珠游戏</p>
            </div>
          </a>

          {/* Log */}
          <Link
            href="/log"
            className="group block border border-gray-200 bg-white hover:border-gray-300 transition-colors sm:col-span-2"
          >
            <div className="flex justify-center items-center h-32 bg-gradient-to-br from-gray-50 to-gray-100">
              <BookOpen className="w-14 h-14 text-gray-500 group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Log</h3>
              <div className="flex gap-1.5 mb-3">
                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">日志</span>
                <span className="px-2 py-1 text-xs bg-sky-100 text-sky-800 rounded">Next.js</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">班级日志记录</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}