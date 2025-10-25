"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/lightbox"
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react"
import { initializeGame, generateRandomUid, generateOptions, getEyeImageUrl, getFullImageUrl } from "@/lib/eye/game-utils"
import { getAnswerByUid } from "@/lib/eye/answers"
import { saveGameState, loadGameState } from "@/lib/eye/storage"
import type { GameState } from "@/types/eye/student"

export default function GamePage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 初始化或加载游戏状态
  useEffect(() => {
    const savedState = loadGameState()
    if (savedState) {
      setGameState(savedState)
      const answer = getAnswerByUid(savedState.currentUid)
      if (answer) {
        setOptions(generateOptions(answer.studentName))
      }
    } else {
      const newGame = initializeGame(10)
      setGameState(newGame)
      const answer = getAnswerByUid(newGame.currentUid)
      if (answer) {
        setOptions(generateOptions(answer.studentName))
      }
    }
  }, [])

  // 保存游戏状态
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState)
    }
  }, [gameState])

  const handleSelectAnswer = (answer: string) => {
    if (showResult || !gameState) return

    setSelectedAnswer(answer)
    const correctAnswer = getAnswerByUid(gameState.currentUid)
    if (!correctAnswer) return

    const correct = answer === correctAnswer.studentName
    setIsCorrect(correct)
    setShowResult(true)

    // 更新游戏状态
    const newHistory = [
      ...gameState.history,
      {
        uid: gameState.currentUid,
        eyeImageUrl: getEyeImageUrl(gameState.currentUid),
        fullImageUrl: getFullImageUrl(gameState.currentUid),
        correctAnswer: correctAnswer.studentName,
        userAnswer: answer,
        isCorrect: correct,
        options,
      },
    ]

    setGameState({
      ...gameState,
      score: correct ? gameState.score + 1 : gameState.score,
      history: newHistory,
    })
  }

  const handleNext = () => {
    if (!gameState) return

    if (gameState.currentRound >= gameState.totalRounds) {
      // 游戏结束，跳转到结果页面
      router.push("/eye/result")
      return
    }

    // 生成下一题
    const nextUid = generateRandomUid(gameState.usedUids)
    const answer = getAnswerByUid(nextUid)
    if (!answer) return

    setGameState({
      ...gameState,
      currentUid: nextUid,
      currentRound: gameState.currentRound + 1,
      usedUids: [...gameState.usedUids, nextUid],
    })

    setOptions(generateOptions(answer.studentName))
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
  }



  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  if (!gameState) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <div className="flex items-center gap-2 text-lg">
          <Loader2 className="h-5 w-5 animate-spin" />
          加载中...
        </div>
      </div>
    )
  }

  const eyeImageUrl = getEyeImageUrl(gameState.currentUid)
  const fullImageUrl = getFullImageUrl(gameState.currentUid)
  const correctAnswer = getAnswerByUid(gameState.currentUid)

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 bg-white">
      {/* 进度 顶部显示 */}
      <div className="mb-6 w-full max-w-md flex justify-between items-center">
        <div className="text-lg font-medium">
          第 {gameState.currentRound} / {gameState.totalRounds} 题
        </div>
        <div className="text-lg font-medium">
          得分: <span className="text-violet-600">{gameState.score}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gray-50 shadow-md transition-all">
        {!showResult ? (
          <>
            {/* 问题区域 */}
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-center text-xl font-semibold text-gray-900">这是谁的眼睛？</h2>
            </div>

            {/* 眼睛图片 */}
            <div className="p-4">
              <div
                className="relative aspect-[2/1] w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openLightbox(0)}
              >
                <Image src={eyeImageUrl} alt="Eye image" fill className="object-contain" priority />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">点击图片可放大查看</p>
            </div>

            {/* 选项 */}
            <div className="grid grid-cols-2 gap-3 p-4">
              {options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  variant="outline"
                  className="h-auto border-gray-200 py-3 text-base transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 结果区域 */}
            <div
                className={`border-b border-gray-200 p-4 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}
              >
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="text-green-500" size={24} />
                    <h2 className="text-xl font-semibold text-green-600">回答正确！</h2>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500" size={24} />
                    <h2 className="text-xl font-semibold text-red-600">回答错误</h2>
                  </>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4 text-center">
                <p className="text-gray-700">
                  这是 <span className="font-semibold">{correctAnswer?.studentName}</span> 的眼睛
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-sm text-gray-500">
                    你选择了: <span className="font-medium">{selectedAnswer}</span>
                  </p>
                )}
              </div>

              {/* 完整图片 */}
              <div
                className="relative aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer mb-4"
                onClick={() => openLightbox(1)}
              >
                <Image src={fullImageUrl} alt="Full image" fill className="object-contain" />
              </div>

              <p className="text-center text-sm text-gray-500 mb-4">点击图片可放大查看</p>

              {/* 按钮组 */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleNext}
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  {gameState.currentRound >= gameState.totalRounds - 1 ? (
                    "查看结果"
                  ) : (
                    <>
                      下一题
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={[eyeImageUrl, fullImageUrl]}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % 2)}
        onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + 2) % 2)}
      />
    </div>
  )
}