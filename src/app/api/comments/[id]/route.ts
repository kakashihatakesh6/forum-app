import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// interface Params {
//   params: {
//     id: string;
//   };
// }

// Delete a comment
export async function DELETE(
  _request: NextRequest,
  // { params }: Params
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      // where: { id: params.id },
      where: { id },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if the user is the author of the comment
    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error: Error | unknown) {
    console.error("Comment deletion error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the comment" },
      { status: 500 }
    );
  }
} 