/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { ThumbsUpIcon, ReplyIcon } from "lucide-react"
import { CommentForm } from "@/components/comment-form"
import { dummyComments } from "@/lib/dummy-data"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  forumId: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    avatar: string
  }
  likes: number
  parentId?: string
}

interface CommentListProps {
  forumId: string
}

export function CommentList({ forumId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(dummyComments.filter((comment) => comment.forumId === forumId))
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  // Get top-level comments
  const topLevelComments = comments.filter((comment) => !comment.parentId)

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((comment) => comment.parentId === commentId)
  }

  const handleLike = (commentId: string) => {
    if (likedComments.has(commentId)) {
      // Unlike
      setLikedComments((prev) => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes - 1 } : comment)),
      )
    } else {
      // Like
      setLikedComments((prev) => new Set(prev).add(commentId))
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
      )
    }
  }

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `comment${comments.length + 1}`,
      forumId,
      content,
      createdAt: new Date().toISOString(),
      author: {
        id: "user1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      likes: 0,
      parentId,
    }

    setComments((prev) => [...prev, newComment])
    setReplyingTo(null)
  }

  const renderComment = (comment: Comment) => {
    const replies = getReplies(comment.id)
    const isLiked = likedComments.has(comment.id)

    return (
      <div key={comment.id} className="mb-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <img
                  src="/avtaar.png"
                  alt={comment.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between py-2 px-6 border-t border-gray-100">
            <button
              className={`inline-flex items-center text-xs text-gray-500 hover:text-gray-700 ${isLiked ? "text-blue-600" : ""}`}
              onClick={() => handleLike(comment.id)}
            >
              <ThumbsUpIcon className={`mr-1 h-4 w-4 ${isLiked ? "fill-blue-600 text-blue-600" : ""}`} />
              {comment.likes} {comment.likes === 1 ? "Like" : "Likes"}
            </button>
            <button
              className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <ReplyIcon className="mr-1 h-4 w-4" />
              Reply
            </button>
          </div>
        </div>

        {replyingTo === comment.id && (
          <div className="ml-12 mt-2">
            <CommentForm
              forumId={forumId}
              parentId={comment.id}
              onSubmit={handleAddComment}
              onCancel={() => setReplyingTo(null)}
              placeholder="Write a reply..."
            />
          </div>
        )}

        {replies.length > 0 && <div className="ml-12 mt-2 space-y-2">{replies.map(renderComment)}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {topLevelComments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to start the discussion!</p>
      ) : (
        topLevelComments.map(renderComment)
      )}
    </div>
  )
}
