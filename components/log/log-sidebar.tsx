"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface LogMeta {
  slug: string
  title: string
  date: string
}

interface LogSidebarProps {
  posts: LogMeta[]
  currentSlug?: string
}

export function LogSidebar({ posts, currentSlug }: LogSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-full sm:w-80 flex-shrink-0 border-r pt-2 pl-2 border-gray-100 bg-white">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 pt-6 pb-4 px-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-lg font-semibold text-gray-900">班级日志</h2>
          <span className="text-sm text-gray-400 font-mono">Log</span>
        </div>
      </div>

      {/* Scrollable Posts List - with hidden scrollbar */}
      <div className="h-[calc(100vh-120px)] overflow-y-auto px-2 py-4 
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-2">
          {posts.map((post) => {
            const isActive = currentSlug === post.slug || pathname === `/log/${post.slug}`

            return (
              <Link
                key={post.slug}
                href={`/log/${post.slug}`}
                className={cn(
                  "group block p-3 transition-all duration-200 rounded-lg border",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <h3 className={cn(
                  "font-medium text-sm leading-tight line-clamp-1 mb-1",
                  isActive ? "text-blue-600" : "text-gray-900 group-hover:text-gray-800"
                )}>
                  {post.title}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}