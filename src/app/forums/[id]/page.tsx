import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { FiMessageCircle, FiPlus, FiTag, FiCalendar, FiUser } from "react-icons/fi";
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
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link 
          href="/forums" 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          ← Back to Discussions
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <ForumHeader forum={formattedForum} />
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Posts</h2>
              <Link
                href={`/forums/${forum.id}/posts/create`}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                <span>New post</span>
              </Link>
            </div>

            {forum.posts.length > 0 ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {forum.posts.map((post) => (
                    <li key={post.id} className="hover:bg-gray-50">
                      <Link 
                        href={`/forums/${forum.id}/posts/${post.id}`} 
                        className="block px-4 py-3 sm:px-6"
                      >
                        <div className="flex items-start gap-4">
                          {/* Left - Post icon */}
                          <div className="pt-1">
                            <FiMessageCircle className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          {/* Middle - Main content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 truncate">
                              {post.title}
                            </h3>
                            
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                              {post.content.length > 150
                                ? post.content.substring(0, 150) + "..."
                                : post.content}
                            </p>
                            
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiUser className="h-3 w-3" />
                                <span className="font-medium">
                                  {post.author.name || post.author.email.split('@')[0]}
                                </span>
                              </span>
                              <span className="mx-2">•</span>
                              <span className="flex items-center gap-1">
                                <FiCalendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          
                          {/* Right - Stats */}
                          <div className="text-xs flex items-center gap-1 text-gray-500 whitespace-nowrap">
                            <FiMessageCircle className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white shadow-sm border border-gray-200 rounded-md text-center p-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                  <FiMessageCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No posts yet
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Be the first to start a conversation in this discussion forum.
                </p>
                <Link
                  href={`/forums/${forum.id}/posts/create`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <FiPlus className="mr-1.5 h-4 w-4" />
                  Create Post
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/4 shrink-0 order-first lg:order-last">
          <div className="sticky top-8 space-y-6">
            {/* About this discussion */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-700">About</h2>
              </div>
              <div className="p-4">
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-700 flex items-center gap-1.5">
                      <FiCalendar className="h-4 w-4 text-gray-500" />
                      Created
                    </dt>
                    <dd className="mt-1 text-gray-500">
                      {new Date(forum.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="font-medium text-gray-700 flex items-center gap-1.5">
                      <FiUser className="h-4 w-4 text-gray-500" />
                      Started by
                    </dt>
                    <dd className="mt-1 text-blue-600 hover:text-blue-800">
                      <Link href={`/users/${forum.creator.id}`}>
                        {forum.creator.name || forum.creator.email.split('@')[0]}
                      </Link>
                    </dd>
                  </div>
                  
                  {forum.tags && forum.tags.length > 0 && (
                    <div>
                      <dt className="font-medium text-gray-700 flex items-center gap-1.5">
                        <FiTag className="h-4 w-4 text-gray-500" />
                        Tags
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1">
                        {forum.tags.map((tag, i) => (
                          <Link 
                            key={i} 
                            href={`/forums?tag=${encodeURIComponent(tag)}`}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            {tag}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            
            {/* Related discussions - placeholder */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-700">Related discussions</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  No related discussions found.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 