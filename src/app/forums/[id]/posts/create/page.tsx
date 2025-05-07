"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CreatePostPageProps {
  params: { id: string };
}

export default function CreatePostPage({ params }: CreatePostPageProps) {
  const forumId = params.id;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    router.push(`/signin?callbackUrl=/forums/${forumId}/posts/create`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          forumId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      const post = await response.json();
      router.push(`/forums/${forumId}/posts/${post.id}`);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred creating the post");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/forums/${forumId}`}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          ← Back to forum
        </Link>
        <h1 className="text-2xl font-bold mt-2">Create a New Post</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Link
            href={`/forums/${forumId}`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
} 