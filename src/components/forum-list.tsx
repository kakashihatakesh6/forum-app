"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageSquareIcon, UsersIcon } from "lucide-react"
import { dummyForums } from "@/lib/dummy-data"

export function ForumList() {
  const [forums] = useState(dummyForums)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {forums.map((forum) => (
        <Link href={`/forum/${forum.id}`} key={forum.id} className="transition-all hover:scale-[1.01]">
          <div className="h-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center text-sm text-gray-500">
                  <UsersIcon className="mr-1 h-4 w-4" />
                  {forum.participants}
                </div>
              </div>
              <h3 className="mt-2 line-clamp-1 text-lg font-medium">{forum.title}</h3>
              <p className="line-clamp-2 text-sm text-gray-500">{forum.description}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500 line-clamp-3">{forum.excerpt}</p>
              </div>
              <div className="mt-6 flex justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full">
                    <Image
                      src={forum.author.avatar || "/placeholder.svg"}
                      alt={forum.author.name}
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-500">{forum.author.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MessageSquareIcon className="mr-1 h-4 w-4" />
                  {forum.commentCount}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
