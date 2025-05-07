import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import CreatePostButton from "./CreatePostButton";

interface ForumDetailPageProps {
  params: { id: string };
}

export default async function ForumDetailPage({ params }: ForumDetailPageProps) {
  const { id } = params;

  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
    },
  });

  if (!forum) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/forums"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Forums
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold">{forum.title}</h1>
          </div>
          {forum.description && (
            <p className="mt-2 text-gray-600">{forum.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Created by {forum.creator.name || forum.creator.email}{" "}
            {formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true })}
          </p>
        </div>
        <CreatePostButton forumId={forum.id} />
      </div>

      {forum.posts.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {forum.posts.map((post) => (
              <li key={post.id}>
                <Link href={`/forums/${forum.id}/posts/${post.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-md font-medium text-indigo-600 truncate">
                        {post.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {post._count.comments} comments
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {post.content.length > 150
                          ? post.content.substring(0, 150) + "..."
                          : post.content}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {post.author.name || post.author.email}{" "}
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              No posts yet
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
              <p>Be the first to create a post in this forum!</p>
            </div>
            <div className="mt-5">
              <Link
                href={`/forums/${forum.id}/posts/create`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 