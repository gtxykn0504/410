import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-10">
      <div className="max-w-xl w-full">
        {/* Title Section */}
        <div className="space-y-4 mb-12">
          <p className="text-lg text-gray-500 font-light">🧐Hello</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 tracking-tight leading-tight">
            At410
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            一个班级项目，记录高中生活
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 sm:gap-10 text-base">
          {[
            { href: "/log", label: "Log" },
            { href: "https://410report.ofhe.cn/", label: "Report" },
            { href: "/random", label: "Random" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                relative text-gray-600 hover:text-gray-900 font-medium
                transition-all duration-300 ease-out
                after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 sm:after:translate-x-0 sm:after:left-0
                after:h-[1px] after:w-0 after:bg-gray-900
                hover:after:w-full
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}