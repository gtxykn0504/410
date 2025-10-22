import Link from "next/link"
import { FileText, Shuffle, Menu } from "lucide-react"

export default function HomePage() {
  const projects = [
    {
      name: "Report",
      description: "每日总结文案生成器",
      href: "https://410report.ofhe.cn/",
      icon: FileText,
    },
    {
      name: "Random",
      description: "随机图片",
      href: "/random",
      icon: Shuffle,
    },
    {
      name: "Log",
      description: "班级日志",
      href: "/log",
      icon: Menu,
    }
  ]

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
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group bg-gray-50 p-6 rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <project.icon className="w-8 h-8 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Status */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            All Systems Operational
          </div>
        </div>
      </div>
    </main>
  )
}