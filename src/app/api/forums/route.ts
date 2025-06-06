/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
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
        tags: tags || [],
        category,
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
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "latest";

    // Base query
    let whereClause: any = {};
    let orderByClause: any = { createdAt: "desc" };
    
    // Filter by tag if provided
    if (tag) {
      whereClause = {
        ...whereClause,
        tags: {
          has: tag
        }
      };
    }
    
    // Filter by category if provided
    if (category && category !== 'all') {
      whereClause = {
        ...whereClause,
        category
      };
    }
    
    // Apply sorting
    if (sort === "latest") {
      orderByClause = { createdAt: "desc" };
    } else if (sort === "top") {
      orderByClause = {
        posts: {
          _count: "desc"
        }
      };
    } else if (sort === "unanswered") {
      whereClause = {
        ...whereClause,
        posts: {
          none: {}
        }
      };
      orderByClause = { createdAt: "desc" };
    }

    const forums = await prisma.forum.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: orderByClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    const total = await prisma.forum.count({ where: whereClause });

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