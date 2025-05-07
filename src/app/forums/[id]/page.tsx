import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import CreatePostButton from "./CreatePostButton";
import ForumHeader from "@/components/ForumHeader";

interface ForumDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ForumDetailPage({ params }: ForumDetailPageProps) {
  const { id } = await params;

  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
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
              image: true,
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

  // Create a formatted version of the forum that matches the expected type for ForumHeader
  const formattedForum = {
    id: forum.id,
    title: forum.title,
    description: forum.description,
    tags: forum.tags,
    createdAt: forum.createdAt.toISOString(),
    creator: forum.creator
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <ForumHeader forum={formattedForum} />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Posts</h2>
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
      </div>
    </div>
  );
} 