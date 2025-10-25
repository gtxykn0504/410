"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shuffle, Eye } from "lucide-react"

interface PhotoDialogProps {
  children: React.ReactNode
}

export function PhotoDialog({ children }: PhotoDialogProps) {
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