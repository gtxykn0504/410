import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log",
  description: "班级日志",
}

export default function LogLayout({ children }: { children: React.ReactNode }) {
  return children
}