"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface CreatePostButtonProps {
  forumId: string;
}

export default function CreatePostButton({ forumId }: CreatePostButtonProps) {
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <Link
        href={`/signin?callbackUrl=/forums/${forumId}/posts/create`}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign in to create post
      </Link>
    );
  }

  return (
    <Link
      href={`/forums/${forumId}/posts/create`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      Create Post
    </Link>
  );
} 