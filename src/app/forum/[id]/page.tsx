'use client';

import Link from "next/link"
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { CommentList } from "@/components/comment-list"
import { CommentForm } from "@/components/comment-form"
import { dummyForums } from "@/lib/dummy-data"
import { formatDate } from "@/lib/utils"

export default function ForumPage() {
// export default function ForumPage({ params }: { params: { id: string } }) {
  const {id} = useParams();
  const forum = dummyForums.find((f) => f.id === id)

  if (!forum) {
    notFound()
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to forums
        </Link>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                forum.category === "Tech"
                  ? "bg-blue-100 text-blue-800"
                  : forum.category === "Design"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {forum.category}
            </span>
            <span className="text-sm text-gray-500">Posted {formatDate(forum.createdAt)}</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{forum.title}</h1>
          <p className="text-gray-500 mb-6">{forum.description}</p>

          <div className="mb-6">
            <p className="whitespace-pre-line">{forum.excerpt}</p>
          </div>

          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-3 overflow-hidden rounded-full">
              <Image
                src={forum.author.avatar || "/avtaar.png"}
                alt={forum.author.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{forum.author.name}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Discussion ({forum.commentCount})</h2>
          <CommentForm forumId={forum.id} />
          <div className="my-6 h-px bg-gray-200"></div>
          <CommentList forumId={forum.id} />
        </div>
      </div>

    </div>
  )
}
