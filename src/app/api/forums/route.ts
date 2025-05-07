import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
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

    // Create the forum
    const forum = await prisma.forum.create({
      data: {
        title,
        description: description || null,
        creatorId: user.id,
      },
    });

    return NextResponse.json(forum, { status: 201 });
  } catch (error: any) {
    console.error("Forum creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the forum" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const forums = await prisma.forum.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    const total = await prisma.forum.count();

    return NextResponse.json({
      forums,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Forums fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching forums" },
      { status: 500 }
    );
  }
} 