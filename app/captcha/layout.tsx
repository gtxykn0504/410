import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "captcha",
  description: "一个验证码游戏",
}

export default function CaptchaLayout({ children }: { children: React.ReactNode }) {
  return children
}