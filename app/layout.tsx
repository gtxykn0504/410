import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'At410',
  description: '一个班级项目',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased ${geist.className}`}>
        <div className="min-h-screen">
          {/* 简单的页面过渡效果 */}
          <main className="transition-opacity duration-300 ease-in-out">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
