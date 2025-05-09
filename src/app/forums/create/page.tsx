"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft, FiTag, FiMessageCircle, FiAlertCircle } from "react-icons/fi";

// GitHub-like categories for discussions
const categories = [
  { id: "general", name: "General", description: "For general discussion topics", icon: "💬" },
  { id: "q-and-a", name: "Q&A", description: "For questions and answers", icon: "❓" },
  { id: "ideas", name: "Ideas", description: "For sharing ideas and suggestions", icon: "💡" },
  { id: "announcements", name: "Announcements", description: "For important announcements", icon: "📢" },
  { id: "show-and-tell", name: "Show and Tell", description: "For showcasing your work", icon: "🔍" },
];

export default function CreateForum() {
  const router = useRouter();
  const { status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    router.push("/signin?callbackUrl=/forums/create");
    return null;
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          tags,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create discussion");
      }

      const forum = await response.json();
      router.push(`/forums/${forum.id}`);
      router.refresh();
    } catch (error: Error | unknown) {
      setError(error instanceof Error ? error.message : "An error occurred creating the discussion");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/forums" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <FiArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to discussions
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-900">New discussion</h1>
          <p className="text-sm text-gray-600 mt-1">Create a new discussion to share with the community</p>
        </div>

        {error && (
          <div className="bg-red-50 border-b border-red-100 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {/* Category selection */}
          <div className="px-6 py-5">
            <h2 className="text-base font-medium text-gray-900 mb-3">Choose a category</h2>
            
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mb-2">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-start p-3 rounded-md border ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                      : 'border-gray-200 hover:bg-gray-50'
                  } cursor-pointer transition-colors`}
                >
                  <div className="flex-shrink-0 mr-3 text-xl">{category.icon}</div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title and description */}
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Brief title that describes the discussion"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add a description to provide more context..."
              ></textarea>
              <p className="text-xs text-gray-500 flex items-center">
                <FiMessageCircle className="mr-1 h-3 w-3" />
                Supports plain text formatting
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center">
              <FiTag className="mr-2 h-4 w-4 text-gray-500" />
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (optional)
              </label>
            </div>
            
            <div className="flex space-x-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add a tag and press Enter"
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Add
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Tags help categorize discussions and make them more discoverable
            </p>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="text-xs text-gray-500 italic">
              Please follow our community guidelines when posting
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/forums"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Start discussion"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}