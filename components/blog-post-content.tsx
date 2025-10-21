"use client"

import { useState, useEffect } from "react"
import { Lightbox } from "@/components/lightbox"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// 日志内容组件的 props 类型定义
interface BlogPostContentProps {
  content: string
  title: string
}

export function BlogPostContent({ content, title }: BlogPostContentProps) {
  // 控制图片灯箱显示
  const [lightboxOpen, setLightboxOpen] = useState(false)
  // 当前所有图片列表
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  // 当前灯箱显示的图片索引
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 监听图片点击事件，打开灯箱
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement
      if (target.tagName === "IMG" && target.src) {
        e.preventDefault()
        const allImages = Array.from(document.querySelectorAll(".prose img")).map(
          (img) => (img as HTMLImageElement).src,
        )
        const clickedIndex = allImages.indexOf(target.src)
        setLightboxImages(allImages)
        setCurrentImageIndex(clickedIndex >= 0 ? clickedIndex : 0)
        setLightboxOpen(true)
      }
    }

    const proseElement = document.querySelector(".prose")
    if (proseElement) {
      proseElement.addEventListener("click", handleImageClick)
      return () => proseElement.removeEventListener("click", handleImageClick)
    }
  }, [content])

  // 灯箱切换到下一张图片
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  // 灯箱切换到上一张图片
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  return (
    <>
      <div
        className="prose prose-lg max-w-none 
        prose-headings:font-light prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-6 prose-h1:mt-12
        prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-5 prose-h2:mt-10
        prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-4 prose-h3:mt-8
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-gray-900 prose-a:underline prose-a:decoration-gray-300 prose-a:underline-offset-2 
        prose-a:transition-colors hover:prose-a:decoration-gray-900
        prose-strong:text-gray-900 prose-strong:font-medium
        prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-img:rounded-lg prose-img:border prose-img:border-gray-200
        prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
        prose-li:text-gray-600 prose-li:leading-relaxed
      "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl sm:text-4xl font-light mb-6 mt-12 text-gray-900 border-b border-gray-200 pb-4 leading-tight tracking-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl sm:text-3xl font-light mb-5 mt-10 text-gray-900 border-b border-gray-100 pb-3 leading-tight tracking-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl sm:text-2xl font-light mb-4 mt-8 text-gray-900 leading-tight tracking-tight">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="mb-6 text-gray-600 leading-relaxed text-base">{children}</p>,
            ul: ({ children }) => <ul className="mb-6 pl-6 space-y-2 list-disc marker:text-gray-400">{children}</ul>,
            ol: ({ children }) => <ol className="mb-6 pl-6 space-y-2 list-decimal marker:text-gray-400">{children}</ol>,
            li: ({ children }) => <li className="text-gray-600 leading-relaxed pl-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-gray-300 pl-4 italic text-gray-600 my-6">{children}</blockquote>
            ),
            code: ({ children, className }) => {
              const isInline = !className
              return isInline ? (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">{children}</code>
              ) : (
                <code className={className}>{children}</code>
              )
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-8 mt-6 leading-relaxed text-sm">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900 transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="font-medium text-gray-900">{children}</strong>,
            img: ({ src, alt }) => (
              <span className="flex flex-col items-center my-8 block">
                <img
                  src={src || "/placeholder.svg"}
                  alt={alt}
                  className="cursor-pointer rounded-lg border border-gray-200 max-w-full h-auto hover:border-gray-300 transition-colors"
                />
                {alt && <span className="mt-3 text-gray-400 text-sm text-center max-w-full break-words">{alt}</span>}
              </span>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </>
  )
}
