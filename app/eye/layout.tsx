import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "慧眼识珠",
  description: "通过眼睛识别人物，挑战你的观察力",
}

export default function EyeLayout({ children }: { children: React.ReactNode }) {
  return children
}