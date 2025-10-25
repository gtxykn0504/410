"use client"

import React, { useState } from "react"
import { Menu, X} from "lucide-react"
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
      {/* Enhanced Floating menu button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
        aria-label={isOpen ? "关闭日志导航" : "显示日志导航"}
      >
        <div className={cn(
          "transition-transform duration-300",
          isOpen ? "rotate-90 scale-110" : "group-hover:scale-110"
        )}>
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Enhanced Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Slide-out panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-white w-80 max-w-[85vw] shadow-2xl border-l border-gray-200 transition-transform duration-300 ease-out",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Enhanced Panel header */}
          <div className="flex-shrink-0 pt-7 px-5 pb-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900">班级日志</h2>
              <span className="text-sm text-gray-400 font-mono">Log</span>
            </div>
          </div>
          
          {/* Enhanced Scrollable content - with hidden scrollbar */}
          <div className="flex-1 overflow-y-auto 
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-3 space-y-2 pt-4">
              {posts.map((post) => {
                const isActive = pathname === `/log/${post.slug}`
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
                    onClick={handleLinkClick}
                  >
                    <h3 className={cn(
                      "font-medium text-sm leading-tight mb-1",
                      isActive ? "text-blue-600" : "text-gray-900 group-hover:text-gray-800"
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