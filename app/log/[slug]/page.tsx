import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BlogPostContent } from "@/components/log/blog-post-content"
import { LogSidebar } from "@/components/log/log-sidebar"
import { LogNavMobile } from "@/components/log/log-nav-mobile"
import { ArrowLeft } from "lucide-react"
import { ArtalkComment } from "@/components/log/artalk-comment"

interface LogPageProps {
  params: Promise<{
    slug: string
  }>
}

interface LogMeta {
  slug: string
  title: string
  date: string
}

async function getLogPosts(): Promise<LogMeta[]> {
  const logsDirectory = path.join(process.cwd(), "log")

  try {
    await fs.access(logsDirectory)
    const filenames = await fs.readdir(logsDirectory)
    const markdownFiles = filenames.filter((file) => file.endsWith(".md"))

    const posts = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(logsDirectory, filename)
        const fileContents = await fs.readFile(filePath, "utf8")
        const { data } = matter(fileContents)

        return {
          slug: filename.replace(/\.md$/, ""),
          title: data.title || filename.replace(/\.md$/, ""),
          date: data.date || "Unknown",
        }
      }),
    )

    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  } catch (error) {
    return []
  }
}

async function getLogPost(slug: string) {
  const filePath = path.join(process.cwd(), "log", `${slug}.md`)

  try {
    const fileContents = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      date: data.date,
      content,
    }
  } catch (error) {
    return null
  }
}

export default async function LogPostPage({ params }: LogPageProps) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getLogPost(slug), getLogPosts()])

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <LogNavMobile posts={allPosts} />

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 border-r border-gray-100 overflow-y-auto bg-white">
          <div className="flex min-h-screen overflow-hidden">
            <LogSidebar posts={allPosts} currentSlug={slug} />
          </div>

        </aside>

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-80 pt-8 pb-12">
          <article className="max-w-2xl mx-auto px-5 sm:px-6 py-6 sm:py-10 lg:py-12">
            {/* 文章头部 */}
            <header className="mb-8">
              <Link 
                href="/"
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回主页</span>
              </Link>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
            </header>

            {/* 文章内容 */}
            <div className="prose prose-gray max-w-none mb-8">
              <BlogPostContent content={post.content} title={post.title} />
            </div>
            <div className="max-w-3xl mx-auto mt-6 bg-white pt-8">
              <ArtalkComment path={`/log/${post.slug}`} title={post.title} className="min-h-[300px] sm:min-h-[400px]" />
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}