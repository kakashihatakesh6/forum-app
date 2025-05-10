/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// Get a single forum
export async function GET(
  request: Request,
  // { params }: { params: { id: string } }
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const forum = await prisma.forum.findUnique({
      where: {
        id,
      },
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
                id: true,
                name: true,
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
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    return NextResponse.json(forum);
  } catch (error: any) {
    console.error("Forum fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the forum" },
      { status: 500 }
    );
  }
}

// Update a forum
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, tags, category } = await request.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
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

    // Check if the forum exists
    const existingForum = await prisma.forum.findUnique({
      where: { id },
    });

    if (!existingForum) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    // Check if the user is the creator of the forum
    if (existingForum.creatorId !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own forums" },
        { status: 403 }
      );
    }

    // Update the forum
    const updatedForum = await prisma.forum.update({
      where: { id },
      data: {
        title,
        description: description || null,
        tags: tags || [],
        category,
      },
    });

    return NextResponse.json(updatedForum);
  } catch (error: any) {
    console.error("Forum update error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the forum" },
      { status: 500 }
    );
  }
}

// Delete a forum
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the forum exists
    const existingForum = await prisma.forum.findUnique({
      where: { id },
    });

    if (!existingForum) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    // Check if the user is the creator of the forum
    if (existingForum.creatorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own forums" },
        { status: 403 }
      );
    }

    // Delete the forum
    await prisma.forum.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Forum deleted successfully" });
  } catch (error: any) {
    console.error("Forum deletion error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the forum" },
      { status: 500 }
    );
  }
} 