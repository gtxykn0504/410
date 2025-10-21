"use client"

import { useCallback, useRef, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import 'artalk/Artalk.css'
import Artalk from 'artalk'

interface ArtalkCommentProps {
  server?: string
  site?: string
  path?: string
  title?: string
  className?: string
}

export function ArtalkComment({
  server = "https://artalk.spircape.com/",
  site = "At410",
  path,
  title,
  className = ""
}: ArtalkCommentProps) {
  const pathname = usePathname()
  const artalk = useRef<Artalk | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleContainerInit = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return
    }
    
    containerRef.current = node
    setIsLoading(true)
    setError(null)

    try {
      // 清理已存在的实例
      if (artalk.current) {
        artalk.current.destroy()
        artalk.current = null
      }

      // 初始化 Artalk
      artalk.current = Artalk.init({
        el: node,
        pageKey: path || pathname || '/',
        pageTitle: title || document.title,
        server: server,
        site: site
      })
      
      setIsLoading(false)
    } catch (err) {
      console.error('Artalk 初始化错误:', err)
      setError(err instanceof Error ? err.message : 'Artalk 初始化失败')
      setIsLoading(false)
    }
  }, [server, site, path, title, pathname])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (artalk.current) {
        artalk.current.destroy()
        artalk.current = null
      }
    }
  }, [])

  if (error) {
    return (
      <div className={`artalk-container ${className}`}>
        <div className="border border-red-200 dark:border-red-800 rounded-xl p-6 text-center bg-red-50/50 dark:bg-red-900/10">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`artalk-container ${className}`}>
      {isLoading && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/20">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">正在加载评论区...</p>
        </div>
      )}
      
      <div ref={handleContainerInit} className="min-h-[200px]"></div>
    </div>
  )
}