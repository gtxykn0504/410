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
  
  // DOM 引用
  const contentRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  // 使用 ref 来存储实时数据，避免闭包问题
  const scaleRef = useRef(scale)
  const positionRef = useRef(position)
  const isDraggingRef = useRef(isDragging)
  
  // 更新 ref 值
  useEffect(() => {
    scaleRef.current = scale
    positionRef.current = position
    isDraggingRef.current = isDragging
  }, [scale, position, isDragging])

  // 触摸手势相关
  const dragStartRef = useRef({ x: 0, y: 0 })
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const initialDistanceRef = useRef<number>(0)
  const initialScaleRef = useRef<number>(1)
  const lastTouchTimeRef = useRef<number>(0)
  const isTouchDeviceRef = useRef(false)

  // 检测是否为触摸设备
  useEffect(() => {
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || 
             navigator.maxTouchPoints > 0 || 
             (navigator as any).msMaxTouchPoints > 0
    }
    isTouchDeviceRef.current = checkTouchDevice()
  }, [])

  // 重置变换状态
  const resetTransform = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // 双击缩放处理 - 触摸设备上禁用
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDeviceRef.current) return
    
    e.stopPropagation()
    
    if (scale === 1) {
      setScale(2)
    } else {
      resetTransform()
    }
  }, [scale, resetTransform])

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (scaleRef.current <= 1) return
    
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || scaleRef.current <= 1) return
    
    e.preventDefault()
    
    const newX = e.clientX - dragStartRef.current.x
    const newY = e.clientY - dragStartRef.current.y
    
    setPosition({ x: newX, y: newY })
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 触摸开始处理 - 阻止默认行为
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // 阻止所有默认触摸行为
    e.preventDefault()
    e.stopPropagation()
    
    const touches = e.touches
    const now = Date.now()
    
    if (touches.length === 1) {
      // 单指触摸 - 准备拖动
      const touch = touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now
      }
      
      if (scaleRef.current > 1) {
        setIsDragging(true)
        dragStartRef.current = {
          x: touch.clientX - positionRef.current.x,
          y: touch.clientY - positionRef.current.y
        }
      }
      
      // 检测双击（300ms 内两次触摸）- 触摸设备上的双击缩放
      if (now - lastTouchTimeRef.current < 300) {
        // 双击处理
        if (scaleRef.current === 1) {
          setScale(2)
        } else {
          resetTransform()
        }
      }
      lastTouchTimeRef.current = now
      
    } else if (touches.length === 2) {
      // 双指触摸 - 准备缩放
      const touch1 = touches[0]
      const touch2 = touches[1]
      
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )
      
      initialDistanceRef.current = distance
      initialScaleRef.current = scaleRef.current
      
      // 重置拖动状态
      setIsDragging(false)
    }
  }, [resetTransform])

  // 触摸移动处理 - 阻止默认行为
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // 阻止所有默认触摸行为
    e.preventDefault()
    e.stopPropagation()
    
    const touches = e.touches
    
    if (touches.length === 1 && scaleRef.current > 1) {
      // 单指移动 - 拖动
      const touch = touches[0]
      const newX = touch.clientX - dragStartRef.current.x
      const newY = touch.clientY - dragStartRef.current.y
      
      setPosition({ x: newX, y: newY })
    } else if (touches.length === 2) {
      // 双指移动 - 缩放
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
        
        // 缩放时保持触摸中心点
        if (newScale > 1) {
          // 简单的中心点保持逻辑
          const scaleChange = newScale / scaleRef.current
          const newPosition = {
            x: positionRef.current.x * scaleChange,
            y: positionRef.current.y * scaleChange
          }
          
          setPosition(newPosition)
        } else {
          setPosition({ x: 0, y: 0 })
        }
      }
    }
  }, [])

  // 触摸结束处理 - 阻止默认行为
  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    // 阻止所有默认触摸行为
    e.preventDefault()
    e.stopPropagation()
    
    if (e.touches.length === 0) {
      // 所有手指都离开
      setIsDragging(false)
      initialDistanceRef.current = 0
      touchStartRef.current = null
    }
  }, [])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
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
    resetTransform()
  }, [currentIndex, resetTransform])

  // 触发全局事件，通知 Bloghelper 隐藏/显示
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('lightbox-open'))
    } else {
      window.dispatchEvent(new Event('lightbox-close'))
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
          className={`relative flex items-center justify-center transition-transform duration-300 ease-out ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{ 
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            // 阻止触摸设备的默认行为
            touchAction: 'none'
          }}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          // 触摸事件 - 阻止所有默认行为
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
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
                height: "auto"
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
          <div className="flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-md rounded-full min-w-[300px]">
            <div className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
            
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