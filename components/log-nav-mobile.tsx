"use client"

import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface LogMeta {
  slug: string
  title: string
  date: string
}

interface LogNavMobileProps {
  posts: LogMeta[]
}

export function LogNavMobile({ posts }: LogNavMobileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()
  
  // 只在移动端显示
  if (!isMobile) {
    return null
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggleMenu()
    }
  }

  const handleLinkClick = () => {
    if (isOpen) {
      toggleMenu()
    }
  }

  return (
    <>
      {/* Floating menu button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:shadow-lg transition-all duration-300"
        aria-label={isOpen ? "关闭日志导航" : "显示日志导航"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Slide-out panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-white w-80 max-w-[85vw] shadow-xl border-l border-gray-100 transition-transform duration-300 ease-in-out",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Panel header */}
          <div className="flex-shrink-0 pt-6 px-6 pb-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">日志列表</h2>
            </div>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {posts.map((post) => {
                const isActive = pathname === `/log/${post.slug}`
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
                    onClick={handleLinkClick}
                  >
                    <h3 className={cn(
                      "font-medium text-sm leading-tight",
                      isActive ? "text-blue-600" : "text-gray-700"
                    )}>
                      {post.title}
                    </h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}