import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "随机图片",
  description: "Random Image",
}

export default function RandomLayout({ children }: { children: React.ReactNode }) {
  return children
}