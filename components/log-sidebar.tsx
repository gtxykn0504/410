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
    <aside
      className="
        w-full sm:w-80 
        flex-shrink-0 
        p-4 
        overflow-y-auto 
        min-h-screen
      "
    >
      {/* Header */}
      <div className="mb-6 pt-4">
        <div className="flex items-center gap-2 px-2 mb-2">
          <h2 className="text-lg font-semibold text-gray-900">班级日志 Log</h2>
        </div>
        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent ml-2 mr-4" />
      </div>

      {/* Posts List */}
      <div className="space-y-3 pb-8 px-2">
        {posts.map((post) => {
          const isActive = currentSlug === post.slug || pathname === `/log/${post.slug}`

          return (
            <Link
              key={post.slug}
              href={`/log/${post.slug}`}
              className={cn(
                "block p-3 transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <h3 className={cn(
                "font-medium text-sm leading-tight line-clamp-1",
                isActive ? "text-blue-600" : "text-gray-700"
              )}>
                {post.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
