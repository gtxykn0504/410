"use client"

import type React from "react"

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
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const contentRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // 重置所有变换
  const resetTransform = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          // 如果已放大，先重置缩放，否则关闭
          if (scale > 1) {
            resetTransform()
          } else {
            onClose()
          }
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

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = isOpen ? "hidden" : "unset"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, onNext, onPrev, resetTransform, scale])

  // 点击外部区域关闭
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // 如果已放大，不关闭
      if (scale > 1) return

      // 检查点击是否发生在图片区域
      const isImageClick = imageRef.current?.contains(e.target as Node)
      // 检查点击是否发生在控制栏区域
      const isControlClick = controlRef.current?.contains(e.target as Node)

      // 只有当点击不在图片上且不在控制栏上时才关闭
      if (!isImageClick && !isControlClick) {
        onClose()
      }
    },
    [onClose, scale],
  )

  // 处理双击事件
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (scale === 1) {
      setScale(2)
    } else {
      resetTransform()
    }
  }

  // 鼠标拖动处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return

    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return

    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 切换图片时重置变换
  useEffect(() => {
    resetTransform()
  }, [currentIndex, resetTransform])

  // 触发全局事件，通知 Bloghelper 隐藏/显示
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event("lightbox-open"))
    } else {
      window.dispatchEvent(new Event("lightbox-close"))
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-xs cursor-pointer"
      onClick={handleOverlayClick}
    >
      {/* 内容区域 */}
      <div
        ref={contentRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-default"
      >
        <div
          className={`relative flex items-center justify-center transition-transform duration-300 ease-in-out ${
            isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
          }`}
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          }}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative w-auto h-auto flex items-center justify-center">
            <Image
              ref={imageRef}
              src={images[currentIndex]}
              alt="Lightbox image"
              width={1600}
              height={1200}
              style={{
                maxWidth: "95vw",
                maxHeight: "95vh",
                objectFit: "contain",
                width: "auto",
                height: "auto",
              }}
              className="rounded-sm select-none"
              sizes="(max-width: 768px) 95vw, 90vw"
              priority
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* 底部控制栏 */}
      <div
        ref={controlRef}
        className="absolute bottom-6 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 ? (
          // 多图片模式 - 显示完整控制栏
          <div className="flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-md rounded-full min-w-[300px]">
            {/* 图片计数器 */}
            <div className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center gap-4">
              {onPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPrev()
                    resetTransform()
                  }}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {onNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNext()
                    resetTransform()
                  }}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // 单图片模式 - 只显示关闭按钮
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
