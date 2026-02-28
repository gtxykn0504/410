"use client"

import { useEffect, useRef, useCallback } from "react"
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

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  // DOM 引用
  const wrapperRef = useRef<HTMLDivElement>(null) // 包裹图片的容器（绝对定位）
  const imageRef = useRef<HTMLImageElement>(null) // 实际图片元素
  const controlRef = useRef<HTMLDivElement>(null) // 底部控制栏

  // 指针数据（多点触控）
  const pointersRef = useRef<Map<number, PointerData>>(new Map())
  // 起始图片矩形（在每次手势开始时记录）
  const startRectRef = useRef<DOMRect | null>(null)
  // 起始中心点
  const startCenterRef = useRef<{ x: number; y: number } | null>(null)
  // 起始两指距离
  const startDistanceRef = useRef<number>(0)
  // 是否正在拖动（用于禁用过渡）
  const isDraggingRef = useRef(false)

  // 缩放限制
  const MIN_SCALE = 0.5
  const MAX_SCALE = 4

  // 工具函数：获取当前图片容器的矩形
  const getWrapperRect = useCallback(() => {
    return wrapperRef.current?.getBoundingClientRect() || null
  }, [])

  // 工具函数：获取当前两指的中心点和距离
  const getPinchData = useCallback(() => {
    const pointers = Array.from(pointersRef.current.values())
    if (pointers.length < 2) return null

    const [p1, p2] = pointers
    const center = {
      x: (p1.currentX + p2.currentX) / 2,
      y: (p1.currentY + p2.currentY) / 2,
    }
    const distance = Math.hypot(p1.currentX - p2.currentX, p1.currentY - p2.currentY)
    return { center, distance }
  }, [])

  // 工具函数：更新图片位置和尺寸（直接操作样式）
  const updateImageStyle = useCallback((left: number, top: number, width: number, height: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    wrapper.style.left = left + "px"
    wrapper.style.top = top + "px"
    wrapper.style.width = width + "px"
    wrapper.style.height = height + "px"
  }, [])

  // 应用过渡（用于平滑动画）
  const applyTransition = useCallback(() => {
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.transition = "all 0.2s ease"
  }, [])

  // 移除过渡（用于拖拽时实时响应）
  const removeTransition = useCallback(() => {
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.transition = ""
  }, [])

  // 重置图片到适应屏幕的尺寸（居中）
  const resetToFit = useCallback(() => {
    const wrapper = wrapperRef.current
    const img = imageRef.current
    if (!wrapper || !img) return

    // 等待图片自然尺寸加载完成
    if (!img.naturalWidth) {
      img.onload = () => resetToFit()
      return
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const rate = 0.9

    const maxWidth = viewportWidth * rate
    const maxHeight = viewportHeight * rate
    const imgRatio = img.naturalWidth / img.naturalHeight

    let width, height
    if (maxWidth / maxHeight > imgRatio) {
      height = maxHeight
      width = height * imgRatio
    } else {
      width = maxWidth
      height = width / imgRatio
    }

    const left = (viewportWidth - width) / 2
    const top = (viewportHeight - height) / 2

    applyTransition()
    updateImageStyle(left, top, width, height)
    // 过渡结束后移除 transition（避免影响后续拖动）
    const onTransitionEnd = () => {
      wrapper.removeEventListener("transitionend", onTransitionEnd)
      removeTransition()
    }
    wrapper.addEventListener("transitionend", onTransitionEnd)
  }, [applyTransition, removeTransition, updateImageStyle])

  // 打开时初始化位置
  useEffect(() => {
    if (isOpen) {
      resetToFit()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, resetToFit])

  // 切换图片时重置位置
  useEffect(() => {
    if (isOpen) {
      resetToFit()
    }
  }, [currentIndex, isOpen, resetToFit])

  // --- 指针事件处理 ---
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const wrapper = wrapperRef.current
    if (!wrapper) return

    // 开始拖拽，移除过渡
    removeTransition()

    pointersRef.current.set(e.pointerId, {
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    })

    if (pointersRef.current.size === 1) {
      const rect = wrapper.getBoundingClientRect()
      startRectRef.current = rect
    }

    if (pointersRef.current.size === 2) {
      const pinch = getPinchData()
      if (pinch) {
        startCenterRef.current = pinch.center
        startDistanceRef.current = pinch.distance
      }
    }

    isDraggingRef.current = true
    wrapper.setPointerCapture(e.pointerId)
  }, [getPinchData, removeTransition])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const pointer = pointersRef.current.get(e.pointerId)
    if (!pointer) return

    pointer.currentX = e.clientX
    pointer.currentY = e.clientY

    const pointersCount = pointersRef.current.size

    // 单指拖动
    if (pointersCount === 1 && startRectRef.current) {
      const dx = e.clientX - pointer.startX
      const dy = e.clientY - pointer.startY
      const newLeft = startRectRef.current.left + dx
      const newTop = startRectRef.current.top + dy
      wrapper.style.left = newLeft + "px"
      wrapper.style.top = newTop + "px"
    }

    // 双指缩放
    if (pointersCount === 2) {
      const pinch = getPinchData()
      if (pinch && startCenterRef.current && startDistanceRef.current > 0 && startRectRef.current) {
        const scale = pinch.distance / startDistanceRef.current
        const newWidth = startRectRef.current.width * scale
        const newHeight = startRectRef.current.height * scale

        if (newWidth < 50 || newHeight < 50 || newWidth > window.innerWidth * 2) return

        const centerShiftX = pinch.center.x - startCenterRef.current.x
        const centerShiftY = pinch.center.y - startCenterRef.current.y
        const newLeft = startRectRef.current.left + centerShiftX - (newWidth - startRectRef.current.width) * (pinch.center.x - startRectRef.current.left) / startRectRef.current.width
        const newTop = startRectRef.current.top + centerShiftY - (newHeight - startRectRef.current.height) * (pinch.center.y - startRectRef.current.top) / startRectRef.current.height

        updateImageStyle(newLeft, newTop, newWidth, newHeight)
      }
    }
  }, [getPinchData, updateImageStyle])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    pointersRef.current.delete(e.pointerId)
    const wrapper = wrapperRef.current
    if (wrapper) {
      wrapper.releasePointerCapture(e.pointerId)
    }

    if (pointersRef.current.size === 0) {
      isDraggingRef.current = false
      startRectRef.current = null
      startCenterRef.current = null
      startDistanceRef.current = 0
      // 拖拽结束，恢复过渡（为后续滚轮或双击做准备）
      applyTransition()
    } else if (pointersRef.current.size === 1) {
      const rect = wrapperRef.current?.getBoundingClientRect()
      if (rect) {
        startRectRef.current = rect
        const remainingPointer = Array.from(pointersRef.current.values())[0]
        remainingPointer.startX = remainingPointer.currentX
        remainingPointer.startY = remainingPointer.currentY
      }
    }
  }, [applyTransition])

  // --- 滚轮缩放 ---
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    const { left, top, width, height } = rect

    let ratio = 1 + Math.abs(e.deltaY) / (e.ctrlKey ? 20 : 200)
    if (e.deltaY > 0) ratio = 1 / ratio

    const newWidth = width * ratio
    const newHeight = height * ratio

    if (newWidth < 50 || newHeight < 50 || newWidth > window.innerWidth * 2) return

    const mouseX = e.clientX
    const mouseY = e.clientY
    const newLeft = left - (mouseX - left) * (ratio - 1)
    const newTop = top - (mouseY - top) * (ratio - 1)

    // 应用过渡实现平滑缩放
    applyTransition()
    updateImageStyle(newLeft, newTop, newWidth, newHeight)
    // 过渡结束后移除 transition
    const onTransitionEnd = () => {
      wrapper.removeEventListener("transitionend", onTransitionEnd)
      removeTransition()
    }
    wrapper.addEventListener("transitionend", onTransitionEnd)
  }, [applyTransition, removeTransition, updateImageStyle])

  // --- 双击缩放 ---
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const wrapper = wrapperRef.current
    const img = imageRef.current
    if (!wrapper || !img) return

    const rect = wrapper.getBoundingClientRect()
    const { left, top, width, height } = rect

    // 判断当前是否为适应尺寸（近似）
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const fitWidth = viewportWidth * 0.9
    const fitHeight = viewportHeight * 0.9

    if (width < fitWidth * 1.1 && height < fitHeight * 1.1) {
      // 放大到 2 倍，以鼠标为中心
      const newWidth = width * 2
      const newHeight = height * 2
      const newLeft = left - (e.clientX - left)
      const newTop = top - (e.clientY - top)

      applyTransition()
      updateImageStyle(newLeft, newTop, newWidth, newHeight)
    } else {
      // 恢复适应尺寸
      resetToFit()
    }
  }, [applyTransition, resetToFit, updateImageStyle])

  // --- 键盘事件 ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrev?.()
          break
        case "ArrowRight":
          onNext?.()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onPrev, onNext])

  // --- 点击外部关闭 ---
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* 图片容器 */}
      <div
        ref={wrapperRef}
        className="absolute will-change-[left,top,width,height] cursor-default"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <Image
          ref={imageRef}
          src={images[currentIndex]}
          alt="Lightbox image"
          width={1600}
          height={1200}
          className="pointer-events-none select-none w-full h-full object-contain"
          sizes="100vw"
          priority
          draggable={false}
        />
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

interface PointerData {
  startX: number
  startY: number
  currentX: number
  currentY: number
}