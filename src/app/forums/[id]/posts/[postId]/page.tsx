import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";

interface PostDetailPageProps {
  params: { id: string; postId: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id: forumId, postId } = params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      forum: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!post || post.forumId !== forumId) {
    notFound();
  }

  // Fetch comments at the root level
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null, // Only get root comments
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <div className="text-sm breadcrumbs">
          <Link href="/forums" className="text-indigo-600 hover:text-indigo-900">
            Forums
          </Link>
          {" / "}
          <Link
            href={`/forums/${forumId}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {post.forum.title}
          </Link>
        </div>

        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>

        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
          <span>Posted by {post.author.name || post.author.email}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            {post.content.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <CommentSection postId={postId} initialComments={comments} />
    </div>
  );
} 