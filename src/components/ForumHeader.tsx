/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type ForumHeaderProps = {
  forum: {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    createdAt: string;
    creator: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
};

export default function ForumHeader({ forum }: ForumHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isCreator = session?.user?.email === forum.creator.email;
  const timeAgo = formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this forum? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/forums/${forum.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete forum");
      }

      router.push("/forums");
      router.refresh();
    } catch (error: any) {
      alert(error.message || "An error occurred while deleting the forum");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex-grow">
            {forum.title}
          </h1>

          {isCreator && (
            <div className="flex space-x-2">
              <Link
                href={`/forums/${forum.id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {forum.description && (
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{forum.description}</p>
        )}

        {forum.tags && forum.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {forum.tags.map((tag, index) => (
              <Link 
                key={index} 
                href={`/forums?tag=${encodeURIComponent(tag)}`}
                className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full hover:bg-indigo-200 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {forum.creator.image ? (
                <Image
                  src={forum.creator.image}
                  alt={forum.creator.name || "Creator"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">
                    {(forum.creator.name || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {forum.creator.name || forum.creator.email}
              </p>
              <p className="text-xs text-gray-500">Created {timeAgo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 