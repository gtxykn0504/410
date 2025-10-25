"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, Trophy, ArrowLeft, ArrowRight, Award, Clock } from "lucide-react"
import { clearGameState } from "@/lib/eye/storage"

export default function HomePage() {
  const router = useRouter()

  // 清理游戏数据
  useEffect(() => {
    clearGameState()
  }, [])

  const startGame = () => {
    router.push("/eye/game")
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 bg-white">
      <div className="mx-auto max-w-3xl">
        {/* 返回主页按钮 */}
        <div className="mb-10 flex justify-start">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回主页</span>
          </Link>
        </div>

        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
            <Eye size={48} />
          </div>

          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            慧眼识珠
          </h1>
          <p className="text-lg text-gray-600">通过眼睛识别人物，挑战你的观察力</p>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl bg-gray-50 shadow-md">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">游戏规则</h2>
          </div>

          <div className="p-6">
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">识别眼睛</h3>
                  <p className="text-sm text-gray-600">系统会随机选择一张眼睛照片，你需要从选项中选择正确的人物</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">查看结果</h3>
                  <p className="text-sm text-gray-600">每次猜测后，无论正确与否，都会显示完整照片，你可以放大查看</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">挑战模式</h3>
                  <p className="text-sm text-gray-600">游戏包含多道题目，完成后可查看你的准确率和总成绩</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">获取高分</h3>
                  <p className="text-sm text-gray-600">准确率越高，得分越高，挑战你的极限</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={startGame}
            size="lg"
            className="group gap-2 bg-indigo-600 px-8 py-6 text-lg font-bold hover:bg-indigo-700"
          >
            开始游戏
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}