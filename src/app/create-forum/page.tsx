"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function CreateForumPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    setIsSelectOpen(false)
  }

  // Close select dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to forums
        </Link>
      </div>

      <div className="max-w-2xl mx-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Create a New Forum</h2>
          <p className="text-sm text-gray-500">Start a discussion on a topic you&apos;re passionate about</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="Give your forum a clear title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="relative" ref={selectRef}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  {formData.category || "Select a category"}
                  <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSelectOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                    <ul className="max-h-60 overflow-auto rounded-md py-1 text-sm">
                      {["Tech", "Design", "Development", "Career", "Other"].map((category) => (
                        <li
                          key={category}
                          className="cursor-pointer select-none px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleCategoryChange(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                id="description"
                name="description"
                placeholder="A brief description of your forum topic"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="Provide details about your topic to start the discussion"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[200px] w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>
          </div>
          <div className="flex justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Forum"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
