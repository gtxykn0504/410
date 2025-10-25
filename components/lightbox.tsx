"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightboxProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
  // 状态管理
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  
  // 使用 ref 稳定图片数组引用，确保不会重复
  const imagesRef = useRef<string[]>([])
  
  // DOM 引用
  const imageRef = useRef<HTMLImageElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  
  // 手势状态
  const dragStartRef = useRef({ x: 0, y: 0 })
  const initialDistanceRef = useRef<number>(0)
  const initialScaleRef = useRef<number>(1)

  // 只在组件打开时更新图片数组，避免重复
  useEffect(() => {
    if (isOpen) {
      // 使用 Set 去重确保图片不会重复
      const uniqueImages = [...new Set(images)]
      imagesRef.current = uniqueImages
    }
  }, [isOpen, images])

  // 重置变换状态
  const resetTransform = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // 双击缩放处理
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setScale(scale === 1 ? 2 : 1)
    setPosition({ x: 0, y: 0 })
  }, [scale])

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return
    
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return
    
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    })
  }, [isDragging, scale])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touches = e.touches
    
    if (touches.length === 1 && scale > 1) {
      setIsDragging(true)
      dragStartRef.current = {
        x: touches[0].clientX - position.x,
        y: touches[0].clientY - position.y
      }
    } else if (touches.length === 2) {
      const touch1 = touches[0]
      const touch2 = touches[1]
      initialDistanceRef.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
      initialScaleRef.current = scale
      setIsDragging(false)
    }
  }, [scale, position])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touches = e.touches
    
    if (touches.length === 1 && scale > 1) {
      setPosition({
        x: touches[0].clientX - dragStartRef.current.x,
        y: touches[0].clientY - dragStartRef.current.y
      })
    } else if (touches.length === 2) {
      const touch1 = touches[0]
      const touch2 = touches[1]
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
      
      if (initialDistanceRef.current > 0) {
        const scaleFactor = currentDistance / initialDistanceRef.current
        const newScale = Math.max(1, Math.min(4, initialScaleRef.current * scaleFactor))
        setScale(newScale)
      }
    }
  }, [scale])

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.touches.length === 0) {
      setIsDragging(false)
      initialDistanceRef.current = 0
    }
  }, [])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          scale > 1 ? resetTransform() : onClose()
          break
        case "ArrowLeft":
          onPrev?.()
          resetTransform()
          break
        case "ArrowRight":
          onNext?.()
          resetTransform()
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, onNext, onPrev, resetTransform, scale])

  // 点击外部区域关闭
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (scale > 1) return
    
    const isImageClick = imageRef.current?.contains(e.target as Node)
    const isControlClick = controlRef.current?.contains(e.target as Node)
    
    if (!isImageClick && !isControlClick) {
      onClose()
    }
  }, [onClose, scale])

  // 切换图片时重置变换
  useEffect(() => {
    if (isOpen) {
      resetTransform()
    }
  }, [currentIndex, isOpen, resetTransform])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-xs cursor-pointer"
      onClick={handleOverlayClick}
    >
      {/* 图片内容区域 */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-default">
        <div
          className={`relative flex items-center justify-center transition-transform duration-300 ease-out ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{ 
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            touchAction: 'none'
          }}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <Image
            ref={imageRef}
            src={imagesRef.current[currentIndex] || ""}
            alt="Lightbox image"
            width={1600}
            height={1200}
            style={{ 
              maxWidth: "95vw", 
              maxHeight: "95vh", 
              objectFit: "contain",
              width: "auto",
              height: "auto"
            }}
            className="rounded-sm select-none"
            sizes="(max-width: 768px) 95vw, 90vw"
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* 底部控制栏 */}
      <div 
        ref={controlRef}
        className="absolute bottom-6 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {imagesRef.current.length > 1 ? (
          <div className="flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-md rounded-full min-w-[300px]">
            <div className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {imagesRef.current.length}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev?.()
                  resetTransform()
                }}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Previous image"
                disabled={!onPrev}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNext?.()
                  resetTransform()
                }}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Next image"
                disabled={!onNext}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}