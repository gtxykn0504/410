// app/random-image/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, ZoomIn, ArrowLeft} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Lightbox } from "@/components/lightbox"

export default function RandomImagePage() {
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const fetchRandomImage = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setIsLoading(true)
      setImageLoaded(false)
    }
    setError("")
    
    try {
      const timestamp = new Date().getTime()
      // 添加缓存避免重复请求
      const url = `https://api.spircape.com/random-410?t=${timestamp}&cache=${timestamp}`
      setImageUrl(url)
    } catch (err) {
      setError("加载失败，请重试")
      console.error("Failed to load image:", err)
      setIsLoading(false)
    }
  }, [])

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setError("加载失败，请重试")
    setIsLoading(false)
    setImageLoaded(false)
  }

  const handleRefresh = () => {
    fetchRandomImage()
  }

  const handleZoom = () => {
    if (imageUrl && !isLoading && !error) {
      setLightboxOpen(true)
    }
  }

  // 修复：使用 ref 来跟踪是否已经发起过请求，避免重复请求
  useEffect(() => {
    let isMounted = true
    
    const fetchInitialImage = async () => {
      if (isMounted) {
        await fetchRandomImage(true)
      }
    }
    
    fetchInitialImage()
    
    return () => {
      isMounted = false
    }
  }, [fetchRandomImage])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full">
        {/* 返回主页按钮 */}
        <Link 
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
        >
            <ArrowLeft className="w-4 h-4" />
            <span>返回主页</span>
        </Link>

        {/* 标题区域 */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
              <div className="w-8 sm:w-12 h-1 bg-blue-500 rounded-full" />
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">随机图片</h1>
              <div className="w-8 sm:w-12 h-1 bg-blue-500 rounded-full" />
            </div>
            <p className="text-sm sm:text-base text-gray-500">刷新获取一张新的随机图片</p>
          </div>
        </div>

        {/* Image Container - 仅在加载或错误时显示灰色背景 */}
        {!imageLoaded && (
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 sm:border-2 shadow sm:shadow-lg mb-4 sm:mb-6 max-w-3xl mx-auto">
            {/* Image Display - 限制容器尺寸 */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center max-h-[60vh] sm:max-h-[70vh]">
              {!imageUrl && !error ? (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gray-200 rounded-full animate-pulse" />
                  <p className="text-base sm:text-lg">加载中...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <p className="text-base sm:text-lg mb-3 sm:mb-4">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 sm:px-6 sm:py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
                  >
                    重试
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full max-w-3xl max-h-[60vh] sm:max-h-[70vh]">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="text-center">
                        <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-500 text-xs sm:text-sm">加载中...</p>
                      </div>
                    </div>
                  )}
                  <Image
                    src={imageUrl}
                    alt="随机图片"
                    fill
                    className={`object-contain transition-opacity duration-300 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 图片加载成功后直接显示图片，无灰色背景 */}
        {imageLoaded && (
          <div className="mb-4 sm:mb-6 max-w-3xl mx-auto">
            <div className="relative aspect-video max-h-[60vh] sm:max-h-[70vh]">
              <Image
                src={imageUrl}
                alt="随机图片"
                fill
                className="object-contain"
                onError={handleImageError}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          </div>
        )}

        {/* Control Buttons - Below Image */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={handleZoom}
            disabled={!imageUrl || isLoading || !!error || !imageLoaded}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">放大</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <RefreshCw className={["w-4 h-4", "sm:w-5 sm:h-5", isLoading && "animate-spin"].filter(Boolean).join(" ")} />
            <span className="font-medium text-sm sm:text-base">刷新</span>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {imageUrl && (
        <Lightbox
          images={[imageUrl]}
          currentIndex={0}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  )
}