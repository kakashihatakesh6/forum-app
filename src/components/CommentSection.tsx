"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  parentId: string | null;
  replies?: Comment[];
};

type CommentSectionProps = {
  postId: string;
  initialComments: Comment[];
};

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push("/signin");
      return;
    }
    
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
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
          content: newComment.trim(),
          postId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add comment");
      }
      
      const comment = await response.json();
      
      // Add user info to the comment for display
      const enhancedComment = {
        ...comment,
        author: {
          id: session.user?.id || "",
          name: session.user?.name || "Anonymous",
          image: session.user?.image || null,
        },
      };
      
      setComments([enhancedComment, ...comments]);
      setNewComment("");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push("/signin");
      return;
    }
    
    if (!replyContent.trim() || !replyToId) {
      setError("Reply cannot be empty");
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
          content: replyContent.trim(),
          postId,
          parentId: replyToId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add reply");
      }
      
      const reply = await response.json();
      
      // Add user info to the reply for display
      const enhancedReply = {
        ...reply,
        author: {
          id: session.user?.id || "",
          name: session.user?.name || "Anonymous",
          image: session.user?.image || null,
        },
      };
      
      // Update the comments array with the new reply
      const updatedComments = comments.map(comment => {
        if (comment.id === replyToId) {
          // If this is the parent comment
          return {
            ...comment,
            replies: [...(comment.replies || []), enhancedReply],
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setReplyToId(null);
      setReplyContent("");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      router.push("/signin");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete comment");
      }
      
      // Remove the comment from state
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred while deleting the comment");
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const canDelete = session?.user?.id === comment.author.id;
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    
    return (
      <div 
        key={comment.id} 
        className={`${isReply ? 'ml-12 mt-2' : 'mt-4'} border-l-2 pl-4 ${isReply ? 'border-gray-200' : 'border-gray-300'}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {comment.author?.image ? (
              <Image
                src={comment.author.image}
                alt={comment.author.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {(comment.author?.name || "A")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {comment.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
            
            <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </div>
            
            <div className="mt-2 flex gap-4 text-xs">
              {session && (
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                >
                  {replyToId === comment.id ? "Cancel Reply" : "Reply"}
                </button>
              )}
              
              {canDelete && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
            
            {replyToId === comment.id && (
              <form onSubmit={handleReply} className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-2"
                  placeholder="Write your reply..."
                  rows={2}
                ></textarea>
                
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Post Reply"}
                  </button>
                </div>
              </form>
            )}
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map(reply => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {status === "authenticated" ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border-b resize-none focus:outline-none focus:ring-0"
              placeholder="Add a comment..."
              rows={3}
            ></textarea>
            
            <div className="bg-gray-50 p-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
          <p className="text-gray-700 mb-2">Sign in to join the conversation</p>
          <button
            onClick={() => router.push("/signin")}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.filter(comment => !comment.parentId).map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
} 