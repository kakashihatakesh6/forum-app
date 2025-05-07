import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, forumId } = await request.json();

    // Basic validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!forumId) {
      return NextResponse.json(
        { error: "Forum ID is required" },
        { status: 400 }
      );
    }

    // Find the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if forum exists
    const forum = await prisma.forum.findUnique({
      where: { id: forumId },
    });

    if (!forum) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
        forumId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
} 