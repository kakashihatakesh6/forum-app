import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, postId, parentId } = await request.json();

    // Basic validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }

      // Ensure parent comment belongs to the same post
      if (parentComment.postId !== postId) {
        return NextResponse.json(
          { error: "Parent comment does not belong to this post" },
          { status: 400 }
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: user.id,
        postId,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the comment" },
      { status: 500 }
    );
  }
} 