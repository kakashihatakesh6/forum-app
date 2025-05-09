"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
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
      className="bg-white border border-gray-100 rounded-lg p-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/forums/${forum.id}`}>
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {forum.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {forum.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
                    {forum.creator.name || "Anonymous"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {forum._count.posts} posts
                </span>
                {forum.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {forum.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      variants={item}
      className="mt-8 bg-white p-8 rounded-md border border-gray-100 text-center"
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        No discussions yet
      </h3>
      <p className="text-gray-600 mb-6">
        Start the first discussion to get the conversation going!
      </p>
      <Link
        href="/forums/create"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <FiPlus className="mr-1.5 h-4 w-4" />
        New discussion
      </Link>
    </motion.div>
  );
} 