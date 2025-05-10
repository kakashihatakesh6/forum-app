/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { FiPlus, FiMessageCircle, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

interface Forum {
  id: string;
  title: string;
  description: string | null;
  creator: {
    name: string | null;
    email: string;
    image: string | null;
  };
  _count: {
    posts: number;
  };
  createdAt: Date;
  tags: string[];
  category?: string;
}

interface ForumsListProps {
  forums: Forum[];
}

export default function ForumsList({ forums }: ForumsListProps) {
  return (
    <motion.div
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {forums.length > 0 ? (
        forums.map((forum) => (
          <ForumItem key={forum.id} forum={forum} />
        ))
      ) : (
        <EmptyState />
      )}
    </motion.div>
  );
}

interface ForumItemProps {
  forum: Forum;
}

function ForumItem({ forum }: ForumItemProps) {
  const formattedDate = formatDistanceToNow(new Date(forum.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      variants={item}
      className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/forums/${forum.id}`} className="block p-4">
        <div>
          {/* Category tag and post count */}
          <div className="flex justify-between items-center mb-2">
            {forum.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {forum.category}
              </span>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <FiMessageCircle className="mr-1 h-4 w-4" />
              <span>{forum._count.posts} posts</span>
            </div>
          </div>

          {/* Title and description */}
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {forum.title}
          </h3>
          {forum.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {forum.description}
            </p>
          )}

          {/* Footer with creator, date, and tags */}
          <div className="flex items-center justify-between flex-wrap mt-4">
            <div className="flex items-center space-x-4 mr-4">
              <div className="flex items-center">
                {forum.creator.image ? (
                  <img
                    src={forum.creator.image}
                    alt={forum.creator.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {forum.creator.name?.[0] || "U"}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-sm text-gray-600">
                  {forum.creator.name || forum.creator.email.split('@')[0]}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
              
            {forum.tags && forum.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                {forum.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <FiTag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
                {forum.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{forum.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Empty state when no forums are available
function EmptyState() {
  return (
    <div className="text-center py-12 px-4 border border-gray-200 rounded-lg bg-gray-50">
      <FiMessageCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No discussions yet</h3>
      <p className="mt-2 text-sm text-gray-500">
        Be the first to start a discussion in this community.
      </p>
      <div className="mt-6">
        <Link
          href="/forums/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          New discussion
        </Link>
      </div>
    </div>
  );
} 