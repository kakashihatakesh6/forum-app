/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { dummyUser } from "@/lib/dummy-data"

interface CommentFormProps {
  forumId: string
  parentId?: string
  onSubmit?: (content: string, parentId?: string) => void
  onCancel?: () => void
  placeholder?: string
}

export function CommentForm({
  forumId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = "Add to the discussion...",
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    // If onSubmit is provided, use it (for client-side updates)
    if (onSubmit) {
      onSubmit(content, parentId)
      setContent("")
      setIsSubmitting(false)
      return
    }

    // Simulate server action
    setTimeout(() => {
      setContent("")
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="/avtaar.png"
            alt={dummyUser.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : parentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  )
}
