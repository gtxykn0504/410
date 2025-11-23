"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Users, Shuffle, Eye } from "lucide-react"

interface DialogProps {
  children: React.ReactNode
}

// AppDialog组件
export function AppDialog({ children }: DialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>实用小软件</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <a 
            href="https://410report.ofhe.cn/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">410 Report</p>
              <p className="text-sm text-gray-500">每日总结文案生成器</p>
            </div>
          </a>
          <a 
            href="/facerandom" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Face Random Selector</p>
              <p className="text-sm text-gray-500">人脸随机选择工具</p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// PhotoDialog组件
export function PhotoDialog({ children }: DialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>图片服务</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <a 
            href="/random" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Shuffle className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Random Image</p>
              <p className="text-sm text-gray-500">随机图片</p>
            </div>
          </a>
          <a 
            href="/eye" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Eye Game</p>
              <p className="text-sm text-gray-500">慧眼识珠</p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}