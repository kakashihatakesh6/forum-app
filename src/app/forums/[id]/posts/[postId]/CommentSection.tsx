"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Author {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string;
  parentId: string | null;
  author: Author;
  replies: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }

    if (!comment.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add comment");
      }

      const newComment = await response.json();
      
      // Add user info to the comment for display purposes
      const commentWithAuthor = {
        ...newComment,
        author: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
        replies: [],
      };
      
      setComments([...comments, commentWithAuthor]);
      setComment("");
    } catch (err: any) {
      setError(err.message || "An error occurred adding your comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }

    if (!replyContent.trim() || !replyToId) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: replyContent.trim(),
          parentId: replyToId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add reply");
      }

      const newReply = await response.json();
      
      // Add user info to the reply for display purposes
      const replyWithAuthor = {
        ...newReply,
        author: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
        replies: [],
      };
      
      // Update the comments state by adding the reply to the correct parent
      const updatedComments = comments.map(c => {
        if (c.id === replyToId) {
          return {
            ...c,
            replies: [...c.replies, replyWithAuthor],
          };
        }
        return c;
      });
      
      setComments(updatedComments);
      setReplyToId(null);
      setReplyContent("");
    } catch (err: any) {
      setError(err.message || "An error occurred adding your reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 mt-3" : "mb-6 border-b border-gray-200 pb-6"}`}>
      <div className="flex items-start">
        {comment.author.image ? (
          <img
            src={comment.author.image}
            alt={`${comment.author.name || comment.author.email}'s avatar`}
            className="h-8 w-8 rounded-full mr-3"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-indigo-800">
              {(comment.author.name?.[0] || comment.author.email[0])?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">
              {comment.author.name || comment.author.email}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-1 text-gray-700">
            {comment.content}
          </div>
          {!isReply && session && (
            <button
              onClick={() => setReplyToId(comment.id)}
              className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {replyToId === comment.id && (
        <form onSubmit={handleSubmitReply} className="ml-11 mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            rows={3}
            required
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setReplyToId(null)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Comments</h3>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No comments yet. Be the first to start the discussion!
            </div>
          )}
        </div>

        {status === "authenticated" ? (
          <div className="mt-6">
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">
              Please{" "}
              <Link
                href={`/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`}
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                sign in
              </Link>{" "}
              to join the discussion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 