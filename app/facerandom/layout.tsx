import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Face Random Selector",
  description: "人脸随机选择工具",
}

export default function FaceRandomLayout({ children }: { children: React.ReactNode }) {
  return children
}