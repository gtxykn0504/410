"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, CheckCircle2, XCircle} from "lucide-react"
import { loadGameState } from "@/lib/eye/storage"
import type { GameState } from "@/types/eye/student"
import { Lightbox } from "@/components/lightbox"

export default function ResultPage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const savedState = loadGameState()
    if (!savedState || savedState.history.length === 0) {
      router.push("/")
      return
    }
    setGameState(savedState)
  }, [router])

  const openLightbox = (images: string[], startIndex = 0) => {
    setLightboxImages(images)
    setCurrentImageIndex(startIndex)
    setLightboxOpen(true)
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  const accuracy = Math.round((gameState.score / gameState.totalRounds) * 100)

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 bg-white">
      <div className="mx-auto w-full max-w-3xl">
        {/* 总结卡片 */}
        <div className="mb-10 overflow-hidden rounded-2xl bg-gray-50 shadow-lg">
          <div className="border-b border-gray-200 p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">游戏结束</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">总题数</p>
                <p className="text-3xl font-bold text-violet-600">{gameState.totalRounds}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">正确数</p>
                <p className="text-3xl font-bold text-green-600">{gameState.score}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">准确率</p>
                <p className="text-3xl font-bold text-pink-600">{accuracy}%</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Button 
                onClick={() => router.push("/eye")}
                variant="outline"
                className="gap-2 border-gray-200 bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white"
              >
                <Home className="h-4 w-4" />
                返回首页
              </Button>
            </div>
          </div>
        </div>

        {/* 答题记录 */}
        <div className="overflow-hidden rounded-2xl bg-gray-50 shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-xl font-semibold text-gray-900">答题记录</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {gameState.history.map((record, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 rounded-xl p-4 ${record.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div className="flex-shrink-0">
                  <div 
                    className="relative h-24 w-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openLightbox([record.eyeImageUrl, record.fullImageUrl], 0)}
                  >
                    <Image
                      src={record.eyeImageUrl}
                      alt={`Question ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">第 {index + 1} 题</span>
                    {record.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-600">你的答案：</span>
                      <span className={record.isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                        {record.userAnswer}
                      </span>
                    </p>
                    {!record.isCorrect && (
                      <p>
                        <span className="text-gray-600">正确答案：</span>
                        <span className="text-green-700 font-medium">{record.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)}
          onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
        />
      )}
    </div>
  )
}
