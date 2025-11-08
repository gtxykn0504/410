"use client"

import { useState, useEffect } from "react"
import { RotateCcw, X } from "lucide-react"

interface PuzzleData {
  id: string
  title: string
  imageUrl: string
  correctAnswers: number[]
}

interface PuzzleDataArray {
  default?: PuzzleData[]
}

interface PuzzleVerificationProps {
  onComplete: () => void
}

export default function PuzzleVerification({ onComplete }: PuzzleVerificationProps) {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null)
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPuzzle()
  }, [])

  const loadPuzzle = () => {
    try {
      // 直接导入数据，避免客户端 fetch 请求
      import('../../data/puzzle.json')
        .then((data) => {
          // 获取题目数组
          const puzzlesArray: PuzzleData[] = data.default || data
          
          // 随机选择一个题目
          const randomIndex = Math.floor(Math.random() * puzzlesArray.length)
          const selectedPuzzle = puzzlesArray[randomIndex]
          
          setPuzzle(selectedPuzzle)
          setError("")
        })
        .catch((err) => {
          setError("加载拼图失败")
          console.error(err)
          // 3秒后自动清除错误
          setTimeout(() => setError(""), 3000)
        })
    } catch (err) {
      setError("加载拼图失败")
      console.error(err)
      // 3秒后自动清除错误
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleTileClick = (tileNumber: number) => {
    setSelectedTiles((prev) =>
      prev.includes(tileNumber) ? prev.filter((n) => n !== tileNumber) : [...prev, tileNumber],
    )
  }

  const handleVerify = async () => {
    if (!puzzle) return

    const sortedSelected = [...selectedTiles].sort((a, b) => a - b)
    const sortedCorrect = [...puzzle.correctAnswers].sort((a, b) => a - b)

    const isCorrect =
      sortedSelected.length === sortedCorrect.length && sortedSelected.every((n, i) => n === sortedCorrect[i])

    if (isCorrect) {
      setVerified(true)
      setError("")
      setTimeout(() => onComplete(), 1000)
    } else {
      setError("选择错误，请重试")
      setSelectedTiles([])
      // 3秒后自动清除错误
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleReset = () => {
    setSelectedTiles([])
    setError("")
    setVerified(false)
  }

  if (!puzzle) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
        <p className="text-red-600">{error || "加载中..."}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <div className="space-y-1">
          <h2 className="text-sm text-blue-100">请选择含该同学的所有区域</h2>
          <h1 className="font-bold text-2xl">{puzzle.title}</h1>
          <p className="text-sm text-blue-100">Highlight the areas that match the student</p>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-500 bg-opacity-90 rounded flex items-start gap-2">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className={`relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200 transition-all ${verified ? 'bg-white' : 'bg-slate-100'}`}>
            {!verified ? (
              <>
                <img src={puzzle.imageUrl || "/placeholder.svg"} alt="Puzzle" className="w-full h-full object-cover" />

                {/* Grid overlay */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-slate-300 border-opacity-30" />
                  ))}
                </div>

                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const tileNum = i + 1
                    const isSelected = selectedTiles.includes(tileNum)
                    return (
                      <button
                        key={tileNum}
                        onClick={() => handleTileClick(tileNum)}
                        className={`transition-all relative ${isSelected ? "bg-blue-500 opacity-60" : ""}`}
                        title={`Tile ${tileNum}`}
                      />
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg
                  className="w-24 h-24 text-blue-500 animate-scale-in"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">

          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={selectedTiles.length === 0 || verified}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              提交
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded transition-colors flex items-center gap-2"
              title="Reset selection"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">重置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}