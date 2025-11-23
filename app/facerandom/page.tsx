"use client"

import { ArrowLeft, Github, Download } from "lucide-react"
import Link from "next/link"

export default function FaceRandomSelectorPage() {
  return (
    <main className="min-h-screen bg-white pt-8 sm:pt-16 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* 返回主页按钮 */}
        <Link 
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回主页</span>
        </Link>

        {/* 标题区域 */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <div className="w-8 sm:w-12 h-1 bg-blue-500 rounded-full" />
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">FaceRandomSelector</h1>
              <div className="w-8 sm:w-12 h-1 bg-blue-500 rounded-full" />
            </div>
            <p className="text-sm sm:text-base text-gray-500">人脸随机选择工具</p>
          </div>
        </div>

        {/* 软件介绍部分 */}
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">软件介绍</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              FaceRandomSelector 是一款人脸随机选择工具。软件采用opencv的人脸检测算法，能够快速准确地识别摄像头中的人脸，并提供高效的随机选择功能，帮助教师轻松实现课堂互动。
            </p>
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">主要特性</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>高精度人脸检测和识别</li>
                <li>简洁易用的用户界面</li>
                <li>完全离线运行，保护隐私</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {/* GitHub 按钮 */}
          <a
            href="https://github.com/gtxykn0504/face-random"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </a>

          {/* 下载按钮 */}
          <a
            href="https://box.ofhe.cn/s/l0TE"
            className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-lg"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">下载安装包</span>
          </a>
        </div>

        {/* 版本信息 */}
        <div className="text-center text-gray-500 text-sm">
          <p>当前版本 v3.3 | 发布日期: 2025年11月</p>
        </div>
      </div>
    </main>
  )
}